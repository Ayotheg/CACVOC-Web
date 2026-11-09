# Forms & email setup

The website's two forms already work in code. They switch on in stages as each service is
connected, by adding settings in **Vercel → Project → Settings → Environment Variables**. No code
changes are needed. After changing any setting, redeploy (Deployments → ⋯ → Redeploy).

| Stage | What works |
| --- | --- |
| Nothing set | Forms show "couldn't send", nothing is lost silently |
| 1. Supabase | Every RSVP and subscriber is saved; analytics and the `/admin` page work |
| 2. Resend key | New subscribers are also added to the Resend contact list |
| 3. Domain verified + `EMAIL_FROM` | Welcome email, RSVP alerts, visitor confirmations, Sunday follow-ups |

Code: `api/subscribe.js`, `api/rsvp.js`, `api/follow-up.js`, `api/hit.js` (analytics), helpers
in `api/_lib/`, the admin page in `src/admin/`, database in `supabase/schema.sql`.

---

## 1. Supabase (do now)

Project: `https://omjghqggkfxmvhnrwvgq.supabase.co`

1. Supabase → SQL Editor → paste all of [`supabase/schema.sql`](supabase/schema.sql) → Run.
   It's safe to run again after changes.
2. Add to Vercel:

   | Variable | Where to find it |
   | --- | --- |
   | `SUPABASE_URL` | `https://omjghqggkfxmvhnrwvgq.supabase.co` |
   | `SUPABASE_SECRET_KEY` | Project Settings → API Keys → Secret key (`sb_secret_…`). Server only, never in frontend code. |
   | `VITE_SUPABASE_URL` | Same URL as above (the `VITE_` copy is what the /admin page uses) |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Project Settings → API Keys → Publishable key (`sb_publishable_…`). Safe to be public. |
   | `ANALYTICS_SALT` | Optional. Any long random string. |

   `VITE_` values are baked in when the site is built, so redeploy after adding them.
3. **Turn off public sign-ups:** Authentication → Sign In / Providers → turn off "Allow new users
   to sign up". (Even if left on, a stranger who signs up sees nothing: only admins can read data.)
4. **Add each admin:**
   1. Authentication → Users → Add user → Create new user. Enter their email and a password,
      tick "Auto confirm user".
   2. SQL Editor → run (with their email):
      ```sql
      insert into public.admins (user_id, email)
      select id, email from auth.users where email = 'person@example.com';
      ```
   To remove someone: `delete from public.admins where email = 'person@example.com';`
5. Redeploy, then check: submit both forms on the live site, open a few pages, and sign in at
   `/admin`. The RSVP, subscriber and visit counts should all show up.

## The admin page (`/admin`)

- **Website:** visitors per day, page views, top pages, where visitors came from (Google,
  Instagram, WhatsApp links…), countries and devices, for the last 7, 30 or 90 days. Counted by
  the site itself, with no cookies, so no cookie banner is needed.
- **Visitors:** every RSVP grouped by Sunday, with when they signed up, a "Came?" choice and
  notes for the welcome team, and whether the follow-up email went out. Filter by upcoming / past
  / not sure, search, and download for Excel.
- **Subscribers:** the mailing list, with a CSV download that Resend's contact import accepts.

Tip: to see which post or flyer brings people, add `?utm_source=instagram` (or `whatsapp`,
`flyer`…) to the links you share. That name shows up under "Where visitors came from".

## 2. Domain & Zoho Mail

1. The church buys the domain and points it at Vercel (Vercel → Settings → Domains).
2. Set up the inbox (e.g. `hello@…`) in Zoho Mail and add Zoho's DNS records (MX, SPF, DKIM).
   Zoho has nothing to do with the code; it's just the inbox where RSVP alerts arrive.

## 3. Resend

1. Resend → Domains → Add domain. Add the DNS records it shows. Resend uses a `send.` subdomain
   for its MX record, so it doesn't clash with Zoho's MX on the main domain. **SPF:** the domain
   can only have one SPF (`v=spf1 …`) record on the root. If Zoho's and Resend's both land there,
   merge them into one, e.g. `v=spf1 include:zoho.com include:amazonses.com ~all` (use the exact
   includes each service shows).
2. Wait for the domain to show **Verified**.
3. Resend → Audience: create a segment for the newsletter (optional) and copy its ID.
4. Resend → Templates: create and **publish** these. Set the subject and sender inside each
   template. Template IDs or aliases both work.

   | Template | Sent when | Variables you can use |
   | --- | --- | --- |
   | Welcome | Someone subscribes in the footer | none |
   | RSVP confirmation (optional) | A visitor plans a visit and gives an email | `NAME` (first name), `WHEN`, `PEOPLE` |
   | Follow-up | Sunday 7 p.m., to that day's visitors who gave an email | `NAME` |

   Add variables in the template editor with exactly these names (capitals). If a template uses
   a variable not in this list, Resend refuses to send it.
5. Add to Vercel:

   | Variable | Value |
   | --- | --- |
   | `RESEND_API_KEY` | Resend → API Keys → Create (Sending + Full access) |
   | `EMAIL_FROM` | `CAC Vineyard of Comfort <hello@yourdomain>`, on the verified domain |
   | `RESEND_SEGMENT_ID` | Segment ID from step 3 (optional) |
   | `WELCOME_TEMPLATE_ID` | Welcome template ID |
   | `RSVP_CONFIRM_TEMPLATE_ID` | Confirmation template ID (optional) |
   | `FOLLOWUP_TEMPLATE_ID` | Follow-up template ID |
   | `RSVP_NOTIFY_TO` | The Zoho inbox for RSVP alerts. Commas for several. Leave unset for no alerts. |
   | `CRON_SECRET` | Any long random string (e.g. from a password generator) |

6. **Bring over the early subscribers.** Anyone who subscribed before step 5 is only in Supabase.
   Table Editor → `subscribers` → Export to CSV, then Resend → Contacts → Import. They won't
   get the welcome email, only people who subscribe from now on.
7. Redeploy and test: subscribe with your own email (contact appears in Resend, welcome arrives),
   and plan a visit with your own email (alert in Zoho, confirmation in your inbox).

## Newsletters

Write the HTML, then Resend → Broadcasts → New → paste it, pick the segment, send. Include
`{{{RESEND_UNSUBSCRIBE_URL}}}` as the unsubscribe link. Broadcasts don't count toward the
transactional email limit.

## Sunday follow-up

`vercel.json` runs `/api/follow-up` every Sunday at 18:00 UTC (7 p.m. Lagos). On Vercel's free
plan the run can land any time within that hour. It emails everyone whose RSVP is for that
Sunday and who gave an email, then marks them sent so no one gets two. People who chose "Not
sure yet" have no date and aren't followed up automatically.

To send it by hand, e.g. for a missed Sunday:

```
curl -H "Authorization: Bearer <CRON_SECRET>" "https://yourdomain/api/follow-up?date=2026-11-15"
```

## Limits to keep in mind

Resend's free plan: 3,000 emails a month and 100 a day for alerts, confirmations, welcomes and
follow-ups. Marketing contacts are free up to 1,000. Check resend.com/pricing for current numbers.
The follow-up all goes out on Sunday evening, so the 100-a-day cap is the first limit to hit:
past roughly 100 emailed visitors in one Sunday, the rest fail (and are logged) until a paid plan.
