/**
 * LeaveLab Landing Page Static Data
 * All content for the landing page sections
 */

// Stage Journey Data
export const stages = [
  {
    icon: '💰',
    title: 'STAGE 1: INCOME',
    subtitle: 'Lock in £2K+/month before you fly',
    features: [
      'Amazon FBA Course',
      '200+ Teaching Jobs',
      'Mentor Matching'
    ],
    ctaText: 'Explore Income →',
    ctaLink: '/income'
  },
  {
    icon: '🛂',
    title: 'STAGE 2: VISA',
    subtitle: '94% approval rate with our guides',
    features: [
      '2-Min Quiz',
      '9 Visa Types',
      'Partner Agents'
    ],
    ctaText: 'Find My Visa →',
    ctaLink: '/visa'
  },
  {
    icon: '🏠',
    title: 'STAGE 3: HOUSING',
    subtitle: 'From hostels to apartments in 11 days',
    features: [
      '50+ Hostel Guide',
      'Real Estate Matching',
      'Negotiation Tips'
    ],
    ctaText: 'Find Housing →',
    ctaLink: '/housing'
  },
  {
    icon: '👥',
    title: 'STAGE 4: COMMUNITY',
    subtitle: '847 nomads waiting to meet you',
    features: [
      'Discord Server',
      'Weekly Events',
      'Road Trips'
    ],
    ctaText: 'Join Community →',
    ctaLink: '/community'
  }
];

// Testimonials Data
export const testimonials = [
  {
    quote: "I landed 3 teaching interviews in 2 weeks. The job board alone is worth 10x the price.",
    name: "Sarah Mitchell",
    title: "Freelance English Teacher",
    location: "London → Bangkok",
    date: "Moved July 2024",
    badge: "Income Stage"
  },
  {
    quote: "The visa quiz saved me £1,200. I was about to apply for the wrong visa type.",
    name: "Marcus Thompson",
    title: "Software Developer",
    location: "Manchester → Chiang Mai",
    date: "Moved September 2024",
    badge: "Visa Stage"
  },
  {
    quote: "I met my 4 roommates before I even landed. Zero loneliness.",
    name: "Priya Kumar",
    title: "Content Creator & Videographer",
    location: "Birmingham → Chiang Mai",
    date: "Moved October 2024",
    badge: "Community Stage"
  }
];

// Partners Data
export const partners = [
  {
    name: 'Worldpackers',
    logoUrl: '/partners/worldpackers.svg',
    websiteUrl: 'https://www.worldpackers.com',
    description: 'Official Accommodation Partner'
  },
  {
    name: 'Flight Partner',
    logoUrl: '/logos/flight-partner.svg',
    websiteUrl: '#',
    description: 'Exclusive Flight Deals'
  },
  {
    name: 'ISA Compass',
    logoUrl: '/logos/isa-compass.svg',
    websiteUrl: 'https://www.isacompass.com',
    description: 'DTV Visa Service'
  },
  {
    name: 'ATA Thailand',
    logoUrl: '/logos/ata-thailand.svg',
    websiteUrl: '#',
    description: 'Non-B Visa Service'
  },
  {
    name: 'Revolutions Hostel',
    logoUrl: '/logos/revolutions-hostel.svg',
    websiteUrl: '#',
    description: 'Employer Sponsor Partner'
  }
];

// How It Works Steps
export const howItWorksSteps = [
  {
    number: '1',
    title: 'Sign Up Free',
    description: 'No credit card needed'
  },
  {
    number: '2',
    title: 'Follow Your Roadmap',
    description: 'Income → Visa → Housing → Community'
  },
  {
    number: '3',
    title: 'Live in Thailand',
    description: 'Join 1,247 nomads in 90 days'
  }
];

// Pricing Plans
export const freePlan = {
  price: '£0',
  period: 'forever',
  features: [
    'Tourist Visa Guide',
    'Hostel Directory',
    'Job Board (view only)',
    'Discord (limited)'
  ],
  cta: 'Start Free',
  ctaLink: '/signup'
};

export const premiumPlan = {
  price: '£79',
  period: 'one-time',
  features: [
    'Everything in Free +',
    'All 9 Visa Courses',
    'Full Job Applications',
    'Mentorship Courses',
    'Real Estate Matching',
    'Full Discord + Events',
    'Affiliate Dashboard',
    'Priority Support'
  ],
  cta: 'Unlock All',
  ctaLink: '/signup?plan=premium',
  valueCallout: 'Save £2,100 vs consultants'
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

