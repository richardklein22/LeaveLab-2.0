/**
 * LeaveLab Landing Page Static Data
 * All content for the landing page sections
 */

import type { LucideIcon } from 'lucide-react';
import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  Handshake,
  Home,
  Laptop,
  MapPin,
  Plane,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Users,
  UsersRound,
  MessagesSquare,
  Hotel,
  Layers,
  Globe,
  Compass,
  BookOpen
} from 'lucide-react';

export interface ProgramItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ProgramSectionContent {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  items: ProgramItem[];
}

export interface PartnershipDetail {
  name: string;
  description: string;
  support: string;
  icon: LucideIcon;
}

export interface ResultStory {
  name: string;
  role: string;
  journey: string;
  outcome: string;
}

export const heroProgressStages: { icon: LucideIcon; label: string }[] = [
  { icon: Briefcase, label: 'Income Plan' },
  { icon: FileText, label: 'Visa Setup' },
  { icon: Home, label: 'Housing' },
  { icon: Users, label: 'Community' }
];

export const roadmapPhases: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: Briefcase, title: 'Income', detail: 'Mentorship plus curated job pipelines.' },
  { icon: FileText, title: 'Visa', detail: 'Guided paperwork with vetted partners.' },
  { icon: Home, title: 'Accommodation', detail: 'Short and long stay sourcing support.' },
  { icon: Users, title: 'Community', detail: 'Events, accountability, and peer network.' }
];

export const incomeProgram: ProgramSectionContent = {
  id: 'income',
  eyebrow: 'Stage 1 • Income',
  title: 'Income that travels with you',
  summary: 'Lock in reliable earnings before you depart.',
  items: [
    {
      icon: GraduationCap,
      title: 'Mentorship Track',
      description: 'Weekly coaching sprints to launch a remote-first income stream.'
    },
    {
      icon: Laptop,
      title: 'Remote Role Pipeline',
      description: 'Verified online roles and interview prep from partner companies.'
    },
    {
      icon: BookOpen,
      title: 'English Teaching Recruitment',
      description: 'Priority placement with schools plus onboarding templates.'
    },
    {
      icon: BadgeCheck,
      title: 'LeaveLab Job Board',
      description: 'Exclusive roles and first-look access to partner opportunities.'
    }
  ]
};

export const visaProgram: ProgramSectionContent = {
  id: 'visa',
  eyebrow: 'Stage 2 • Visa',
  title: 'Visa routes without guesswork',
  summary: 'Choose the right path for both short and long stays.',
  items: [
    {
      icon: Plane,
      title: 'Short-Stay Options',
      description: 'Tourist, education, and volunteer visas with exact document lists.'
    },
    {
      icon: ScrollText,
      title: 'Long-Term Strategies',
      description: 'Digital visa, non-B, and business structures compared side by side.'
    },
    {
      icon: Handshake,
      title: 'Partner Agents',
      description: 'Work directly with our vetted partners for submissions and renewals.'
    },
    {
      icon: ShieldCheck,
      title: 'Readiness Assessments',
      description: 'Quick filters to match timelines, budget, and eligibility.'
    }
  ]
};

export const housingProgram: ProgramSectionContent = {
  id: 'housing',
  eyebrow: 'Stage 3 • Accommodation',
  title: 'Settle in fast—short or long term',
  summary: 'Save weeks by using the same resources our alumni rely on.',
  items: [
    {
      icon: Hotel,
      title: 'Volunteer Exchanges',
      description: 'Early access to Worldpackers and partner placements across Thailand.'
    },
    {
      icon: MapPin,
      title: 'Short-Stay Playbook',
      description: 'Nomad-reviewed hostels, co-living spaces, and local contacts.'
    },
    {
      icon: Building2,
      title: 'Long-Term Leasing',
      description: 'Agent introductions with negotiation scripts and contract checklists.'
    },
    {
      icon: ClipboardList,
      title: 'Move-In Checklist',
      description: 'Utilities, banking, and SIM setup guides to finish in one weekend.'
    }
  ]
};

export const communityProgram: ProgramSectionContent = {
  id: 'community',
  eyebrow: 'Stage 4 • Community',
  title: 'Arrive with friends waiting',
  summary: 'Events, accountability, and shared milestones from day one.',
  items: [
    {
      icon: CalendarCheck,
      title: 'Weekly Meetups',
      description: 'Pop-up dinners, coworking days, and weekend trips led by hosts.'
    },
    {
      icon: MessagesSquare,
      title: 'City Channels',
      description: 'Private community groups segmented by city, visa type, and focus.'
    },
    {
      icon: UsersRound,
      title: 'Accountability Pods',
      description: 'Small group check-ins to keep permits, income, and housing on track.'
    },
    {
      icon: Sparkles,
      title: 'Member Marketplace',
      description: 'Swap services, find roommates, and launch collabs within the network.'
    }
  ]
};

export const partnershipDetails: PartnershipDetail[] = [
  {
    icon: Globe,
    name: 'Skyscanner',
    description: 'Flight search and fare monitoring built into LeaveLab.',
    support: 'Member-only fare alerts and guaranteed response from aviation team.'
  },
  {
    icon: Hotel,
    name: 'Worldpackers',
    description: 'Volunteer and cultural exchange housing across Thailand.',
    support: 'Priority review plus curated placements reserved for LeaveLab members.'
  },
  {
    icon: Compass,
    name: 'ISA Compass',
    description: 'Digital Nomad and DTV visa processing specialists.',
    support: 'Document prep, appointment booking, and compliance audits.'
  },
  {
    icon: Layers,
    name: 'ATA Thailand',
    description: 'Non-B visa and work permit partner firm.',
    support: 'Company sponsorship and in-country renewals handled end-to-end.'
  }
];

export const pressFeatures: string[] = ['Daily Mail', 'The Mirror', 'The Sun', 'Joe.co.uk'];

export const resultsStories: ResultStory[] = [
  {
    name: 'Sarah M.',
    role: 'Teacher to Amazon seller',
    journey: 'Joined with a 9-5 teaching job in Manchester and zero e-commerce experience.',
    outcome: '£8K/month Amazon FBA revenue and Chiang Mai residency in 6 months.'
  },
  {
    name: 'Marcus T.',
    role: 'Sales lead to AI operator',
    journey: 'Used LeaveLab to pivot into remote AI implementation while relocating to Bangkok.',
    outcome: '$15K/month retainers plus DTV visa secured with ISA Compass.'
  }
];

export const offeringSummary: ProgramItem[] = [
  {
    icon: GraduationCap,
    title: 'Launch-ready curriculum',
    description: 'Step-by-step courses and templates covering every stage of relocation.'
  },
  {
    icon: BadgeCheck,
    title: 'Verified partners',
    description: 'Trusted agencies, landlords, and employers vetted by LeaveLab.'
  },
  {
    icon: UsersRound,
    title: 'Community access',
    description: 'Full access to events, pods, and matching inside the LeaveLab network.'
  },
  {
    icon: ClipboardList,
    title: 'Execution playbooks',
    description: 'Checklists, scripts, and deadlines to keep the move on schedule.'
  }
];

// Legacy exports retained for alternate landing variants
export const stages = [
  {
    icon: Briefcase,
    title: 'Stage 1: Income',
    subtitle: 'Lock in £2K+/month before you fly',
    features: ['Mentorship sprints', 'Remote job matching', 'Teaching placements'],
    ctaText: 'Explore Income',
    ctaLink: '/income'
  },
  {
    icon: FileText,
    title: 'Stage 2: Visa',
    subtitle: '94% approval with guided filings',
    features: ['Visa quiz', 'Partner agents', 'Document reviews'],
    ctaText: 'Find My Visa',
    ctaLink: '/visa'
  },
  {
    icon: Home,
    title: 'Stage 3: Housing',
    subtitle: 'Apartments and stays in under two weeks',
    features: ['Volunteer paths', 'Long-term sourcing', 'Negotiation scripts'],
    ctaText: 'Find Housing',
    ctaLink: '/housing'
  },
  {
    icon: Users,
    title: 'Stage 4: Community',
    subtitle: '847 nomads ready to meet you',
    features: ['Weekly events', 'Accountability pods', 'Road trips'],
    ctaText: 'Join Community',
    ctaLink: '/community'
  }
];

export const testimonials = [
  {
    quote: "LeaveLab's mentorship helped me replace my UK salary and relocate without stress.",
    name: 'Sarah M.',
    title: 'Amazon FBA Entrepreneur',
    location: 'London to Chiang Mai',
    fromFlag: 'UK',
    toFlag: 'TH',
    date: 'Moved July 2024',
    badge: 'Income Stage',
    beforeIncome: '£45k office role',
    afterIncome: '£8k/month FBA',
    timeframe: '6 months'
  },
  {
    quote: 'The visa team and partner lawyers made relocating with my family completely manageable.',
    name: 'Marcus T.',
    title: 'AI Automation Specialist',
    location: 'Manchester to Bangkok',
    fromFlag: 'UK',
    toFlag: 'TH',
    date: 'Moved September 2024',
    badge: 'Visa Stage',
    beforeIncome: '$120k corporate',
    afterIncome: '$15k/month retainers',
    timeframe: '8 months'
  },
  {
    quote: 'I met my new roommates and secured housing before my flight touched down.',
    name: 'Priya K.',
    title: 'Content Creator',
    location: 'Birmingham to Chiang Mai',
    fromFlag: 'UK',
    toFlag: 'TH',
    date: 'Moved October 2024',
    badge: 'Community Stage',
    beforeIncome: '£3k freelance',
    afterIncome: '£5k/month + events',
    timeframe: '4 months'
  }
];

export const partners = [
  {
    name: 'Worldpackers',
    logoUrl: '/partners/worldpackers.svg',
    websiteUrl: 'https://www.worldpackers.com',
    description: 'Official accommodation partner'
  },
  {
    name: 'Skyscanner',
    logoUrl: '/logos/flight-partner.svg',
    websiteUrl: '#',
    description: 'Exclusive flight deals'
  },
  {
    name: 'ISA Compass',
    logoUrl: '/logos/isa-compass.svg',
    websiteUrl: 'https://www.isacompass.com',
    description: 'Digital visa support'
  },
  {
    name: 'ATA Thailand',
    logoUrl: '/logos/ata-thailand.svg',
    websiteUrl: '#',
    description: 'Non-B visa sponsorship'
  }
];

export const howItWorksSteps = [
  {
    number: '1',
    title: 'Create your plan',
    description: 'Sign up and get your staged checklist.'
  },
  {
    number: '2',
    title: 'Follow each milestone',
    description: 'Income → visa → housing → community.'
  },
  {
    number: '3',
    title: 'Land in Thailand',
    description: 'Hit the ground with support already in place.'
  }
];

export const freePlan = {
  price: '£0',
  period: 'forever',
  features: ['Tourist visa guide', 'Hostel directory', 'Job board (view only)', 'Discord sampler'],
  cta: 'Start Free',
  ctaLink: '/signup'
};

export const premiumPlan = {
  price: '£79',
  period: 'one-time',
  features: ['All visa courses', 'Mentor support', 'Housing introductions', 'Full community access'],
  cta: 'Unlock All',
  ctaLink: '/signup?plan=premium',
  valueCallout: 'Save £2,100 versus consultants'
};

// FAQ Data
export const faqs = [
  {
    question: 'Will I actually make money?',
    answer: 'Users earn their first £500 in 37 days (avg). We guide you step-by-step through income options like English teaching (£18-25/hour), Amazon FBA, or freelancing. Our job board connects you to 200+ schools, and mentorship courses are designed for complete beginners.'
  },
  {
    question: 'What if my visa gets rejected?',
    answer: '94% approval rate. We\'ve done this 1,247 times. Our 2-minute quiz matches you to the right visa type, and our courses walk you through every document requirement. We also partner with ISA Compass (DTV) and ATA Thailand (Non-B) for professional application help if needed.'
  },
  {
    question: 'Will I make friends?',
    answer: '87% attend their first event in 2 weeks. 847 nomads in Discord sorted by city, visa type, and income path. You can connect before you even land, join weekly boat parties, road trips, and coworking sessions. Zero loneliness.'
  },
  {
    question: 'How is this different from Facebook groups?',
    answer: 'One platform instead of 47 contradictory groups. Organized into 4 stages (Income → Visa → Housing → Community) with expert-created courses, verified job board, real estate agent matching, and moderated Discord. All for £79 vs. £1,500+ consultants.'
  }
];

// Progress icons for hero section
export const heroProgressStages = [
  { icon: '💰', label: 'Income' },
  { icon: '🛂', label: 'Visa' },
  { icon: '🏠', label: 'Housing' },
  { icon: '👥', label: 'Community' }
];

// Problem comparison data
export const problemComparison = {
  without: {
    emoji: '😰',
    title: 'Without LeaveLab',
    items: [
      '600 hours of Googling',
      '£2,000 on consultants',
      'Wrong visa = fly home',
      'Months of confusion'
    ]
  },
  with: {
    emoji: '🎉',
    title: 'With LeaveLab',
    items: [
      '90-day roadmap',
      '£79 all-in-one',
      '94% visa approval',
      'Community of 847'
    ]
  }
};

// Footer navigation
export const footerNavigation = {
  platform: [
    { label: 'Start Free Trial', href: '/signup' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Success Stories', href: '#testimonials' }
  ],
  resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Visa Guides', href: '/visa' },
    { label: 'Job Board', href: '/jobs' },
    { label: 'Hostel Directory', href: '/housing' }
  ],
  contact: [
    { label: 'hello@leavelab.com', href: 'mailto:hello@leavelab.com' },
    { label: 'Join Discord →', href: '#' },
    { label: 'For Investors →', href: '#' }
  ]
};

