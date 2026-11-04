import {
  BookOpen,
  Calendar,
  Facebook,
  Heart,
  ImageIcon,
  Instagram,
  MapPin,
  User,
  Youtube,
} from '../components/icons'

/* TODO: replace with the church's real URLs. */
export const externalLinks = {
  youtube: 'https://www.youtube.com/@cacvoclagos', // The church channel, where services stream.
  teachings: 'https://www.youtube.com/@IsaacKAbiara', // Bishop Isaac's own channel.
  facebook: 'https://www.facebook.com/100063915377767',
  instagram: '#',
  lekkiBranch: '#',
  directions: '#',
}

/* Items with `to` are routes. Items with `href` open in a new tab. */
export const navLinks = [
  {
    label: 'About',
    menuLabel: 'About us',
    description: 'Our story and our founder',
    icon: User,
    to: '/about',
    children: [
      { label: 'Our story', to: '/about#story' },
      { label: 'Our founder', to: '/about#founder' },
    ],
  },
  { label: 'Events', description: 'What’s coming up', icon: Calendar, to: '/events' },
  { label: 'Gallery', description: 'Our youth in pictures', icon: ImageIcon, to: '/gallery' },
  { label: 'Projects', description: 'Give to a church project', icon: Heart, to: '/projects' },
  {
    label: 'Teachings',
    description: 'Messages on YouTube',
    icon: BookOpen,
    href: externalLinks.teachings,
  },
  { label: 'Contact', description: 'Visit, call or write to us', icon: MapPin, to: '/contact' },
]

export const socialLinks = [
  { label: 'YouTube', icon: Youtube, href: externalLinks.youtube },
  { label: 'Facebook', icon: Facebook, href: externalLinks.facebook },
  { label: 'Instagram', icon: Instagram, href: externalLinks.instagram },
]

export const footerExplore = [
  { label: 'Home', to: '/' },
  { label: 'About us', to: '/about' },
  { label: 'Events', to: '/events' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact', to: '/contact' },
]

export const footerWatchGive = [
  { label: 'Livestream', to: '/#live', showLiveBadge: true },
  { label: 'YouTube teachings', mobileLabel: 'Teachings', href: externalLinks.teachings },
  { label: 'Support the church', to: '/give' },
  { label: 'Plan your visit', to: '/visit' },
]

export const footerBranches = [{ label: 'CAC VOC Lekki', href: externalLinks.lekkiBranch }]

export const serviceTimes = [
  { day: 'SUN', name: '[Sunday service]', time: '[TIME]' },
  { day: '[DAY]', name: '[Midweek service]', time: '[TIME]' },
  { day: '[DAY]', name: '[Prayer meeting]', time: '[TIME]' },
]
