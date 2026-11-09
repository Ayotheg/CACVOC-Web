import { createClient } from '@supabase/supabase-js'

/* The browser-side Supabase client, used only by /admin. Its key is the public "publishable" key:
   it can do nothing on its own. What a signed-in person can see is decided by the rules in
   supabase/schema.sql, which only let people listed in public.admins read anything.

     VITE_SUPABASE_URL              https://<project-ref>.supabase.co
     VITE_SUPABASE_PUBLISHABLE_KEY  Project Settings → API Keys → Publishable key (sb_publishable_…) */

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = url && key ? createClient(url, key) : null
