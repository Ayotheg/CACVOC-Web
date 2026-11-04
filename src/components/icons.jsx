/* oxlint-disable react/only-export-components -- createLucideIcon returns components. */
/* The project's icon set. Import icons from here, not from lucide-react directly.
   Unused icons are tree-shaken out of the build.
   For the solid play triangle, use <Play fill="currentColor" />. */
import { createLucideIcon } from 'lucide-react'

export {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  BookText,
  Calendar,
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CirclePlay,
  Clock,
  Copy,
  Equal as Menu, // the two-line menu icon
  Heart,
  Image as ImageIcon,
  Mail,
  MapPin,
  Minus,
  Pause,
  Phone,
  Play,
  Plus,
  Shield,
  Target,
  User,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'

/* Lucide no longer ships brand icons, so these keep its drawing style by hand. */
export const Youtube = createLucideIcon('Youtube', [
  [
    'path',
    {
      d: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17',
      key: 'frame',
    },
  ],
  ['path', { d: 'm10 15 5-3-5-3z', key: 'play' }],
])

export const Facebook = createLucideIcon('Facebook', [
  ['path', { d: 'M16 3h-2a4 4 0 0 0-4 4v14', key: 'stem' }],
  ['path', { d: 'M7 11h7', key: 'bar' }],
])

export const Instagram = createLucideIcon('Instagram', [
  ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5', key: 'frame' }],
  ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', key: 'lens' }],
  ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5', key: 'dot' }],
])
