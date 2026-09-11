import { CaseStudy, PortalProject } from '../types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'theyyam-trails',
    slug: 'theyyam-trails',
    title: 'Theyyam Trails — Theyyam Field Guide & Calendar',
    client: 'Theyyam Trails',
    category: 'Custom Software',
    shortDescription: "Offline-first Flutter field guide to Kerala's Theyyam tradition — 973 sacred venues mapped, cached locally, and synced from a Cloudflare D1 backend.",
    fullDescription: "A Flutter mobile field guide to Kerala's Theyyam calendar. It maps 973 sacred venues, caches the entire calendar on-device for patchy rural connectivity, and syncs fresh venue data from a Cloudflare Workers + D1 backend.",
    challenge: "Theyyam devotees and travellers across rural Kerala had no single reliable, offline-accessible source for the 973 venues and the seasonal performance calendar — and connectivity drops frequently away from towns.",
    solution: "Built a Flutter app that bundles the calendar locally, caches venue data on first fetch, and pulls updates from a Cloudflare D1/Worker API so the guide stays accurate between visits.",
    outcomes: [
      '973 Theyyam venues mapped and searchable offline',
      'Full seasonal calendar available without a network connection',
      'Live venue sync via Cloudflare Workers + D1'
    ],
    metrics: [
      { label: 'Venues Mapped', value: '973' },
      { label: 'Connectivity', value: 'Offline-first' },
      { label: 'Backend', value: 'CF D1' }
    ],
    timeline: 'Live · seasonally updated',
    techStack: ['Flutter', 'Dart', 'Cloudflare Workers', 'Cloudflare D1', 'SQLite'],
    image: '/images/theyyam.jpeg',
    featured: true
  },
  {
    id: 'onapookkal',
    slug: 'onapookkal-onam-marketplace',
    title: 'Onapookkal — Bilingual Onam Flower Shop',
    client: 'Onapookkal',
    category: 'Web App',
    shortDescription: 'Bilingual (English + Malayalam) seasonal Onam flower shop with a full admin/CRM backend and a live countdown to Thiruvonam.',
    fullDescription: 'A seasonal e-commerce site for selling pookalam flowers across Kannur, Kerala during Onam. Bilingual by default, with a Malayalam toggle, a full admin/CRM backend for day-to-day shop management, and an animated hero with a live countdown to Thiruvonam.',
    challenge: 'Serving a seasonal rush of Onam flower orders in Kannur meant supporting two languages and giving the shop owner a simple way to manage the catalogue, orders, and announcements.',
    solution: 'Built a bilingual Next.js storefront with a persisted Malayalam toggle, a full admin/CRM backend, an animated pookalam hero, and an admin-editable announcement bar.',
    outcomes: [
      'English + Malayalam UI with a persisted language toggle',
      'Full admin/CRM backend for daily shop management',
      'Animated pookalam hero with a live Thiruvonam countdown'
    ],
    metrics: [
      { label: 'Languages', value: 'EN + Malayalam' },
      { label: 'Store', value: 'onapookkal.store' },
      { label: 'Backend', value: 'Admin + CRM' }
    ],
    timeline: 'Live · seasonal',
    techStack: ['Next.js', 'TypeScript', 'Cloudflare', 'Tailwind CSS'],
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
    featured: true
  },
  {
    id: 'onam-delivery',
    slug: 'onam-delivery-flowers',
    title: "OnamDelivery — 'Swiggy for Flowers'",
    client: 'OnamDelivery',
    category: 'Web App',
    shortDescription: 'Flower-delivery marketplace for Kannur — customer storefront, Flutter delivery-partner app, and a Cloudflare D1 backend.',
    fullDescription: 'A flower-delivery marketplace connecting Kannur flower vendors to customers through a delivery-partner fleet. Four coordinated surfaces: a Next.js customer storefront, a Flutter delivery-partner Android app, a Cloudflare Workers + D1 API, and an owner/vendor admin with live maps.',
    challenge: 'Matching Onam flower demand to the nearest vendor and routing it through a delivery fleet required four surfaces with real-time order flow.',
    solution: 'Engineered a multi-surface platform — Next.js storefront, Flutter delivery app, Cloudflare Worker + D1 backend, and an owner/vendor admin with Leaflet maps.',
    outcomes: [
      'Customer storefront + Flutter delivery-partner fleet',
      'Cloudflare Workers + D1 backend for live orders',
      'Owner + vendor admin with Leaflet maps'
    ],
    metrics: [
      { label: 'Surfaces', value: '4' },
      { label: 'Delivery app', value: 'Flutter' },
      { label: 'Backend', value: 'CF D1' }
    ],
    timeline: 'Live',
    techStack: ['Next.js', 'Flutter', 'Cloudflare Workers', 'Cloudflare D1', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1469259943454-aa100abba749?auto=format&fit=crop&w=1200&q=80',
    featured: false
  },
  {
    id: 'cafeflutter',
    slug: 'cafemaster-restaurant-pos',
    title: 'CafeMaster — Restaurant Management App',
    client: 'CafeMaster',
    category: 'Custom Software',
    shortDescription: 'Flutter restaurant POS with table management, a kitchen display, and multi-device sync over local WiFi — no cloud required.',
    fullDescription: 'A Flutter restaurant-management app for Android. It includes a full point-of-sale with KOT generation, visual table management with reservations, a real-time kitchen display, and free multi-device sync where one device hosts the server and others connect over local WiFi.',
    challenge: 'Small cafes needed a capable POS and kitchen-order workflow without paying for cloud services or depending on an internet connection.',
    solution: 'Built a Flutter Android app that hosts its own local server, so the POS, table grid, kitchen display, and other devices all sync over WiFi with zero cloud dependency.',
    outcomes: [
      'Full POS with KOT generation and multiple payment methods',
      'Visual table grid with a reservation workflow',
      'Free multi-device sync over local WiFi'
    ],
    metrics: [
      { label: 'Platform', value: 'Android' },
      { label: 'Sync', value: 'Local WiFi' },
      { label: 'Cloud', value: 'None' }
    ],
    timeline: 'Shipped',
    techStack: ['Flutter', 'Dart', 'Android', 'Local network'],
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    featured: false
  },
  {
    id: 'happy-aquarium',
    slug: 'happy-aquarium-store',
    title: 'Happy Aquarium — Immersive Store & CMS',
    client: 'Happy Aquarium',
    category: 'Website',
    shortDescription: 'Cloudflare-native aquarium storefront with a custom CMS, a 35+ species catalogue, and a fish compatibility checker.',
    fullDescription: 'A premium, immersive website and custom CMS for an aquarium and imported-fish store in Kuthuparamba, Kerala. Cloudflare-native: Next.js on Workers via OpenNext, D1 for data, and R2 for media. Editorial "nature-documentary" design with a warm paper canvas, Fraunces serif, and pine-teal + terracotta.',
    challenge: 'The store needed an online presence that matched the immersive feel of a real aquarium, plus a way to manage a 35+ species fish catalogue without a developer.',
    solution: 'Built a cinematic editorial storefront with GSAP scroll and Lenis smooth scroll, a live fish catalogue with care attributes and filters, a custom CMS, and interactive tools like a fish compatibility checker.',
    outcomes: [
      '35+ species catalogue with full care attributes',
      'Custom CMS on Cloudflare D1 + R2',
      'Fish Compatibility Checker and interactive tools'
    ],
    metrics: [
      { label: 'Species', value: '35+' },
      { label: 'Stack', value: 'Next.js + D1' },
      { label: 'Design', value: 'Editorial' }
    ],
    timeline: 'Live',
    techStack: ['Next.js', 'Cloudflare Workers', 'Cloudflare D1', 'R2', 'GSAP'],
    image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80',
    featured: false
  },
  {
    id: 'glucotrack',
    slug: 'glucotrack-diabetes-companion',
    title: 'GlucoTrack — Diabetes Monitoring Companion',
    client: 'GlucoTrack',
    category: 'Custom Software',
    shortDescription: 'Flutter diabetes companion with Drift SQLite, Riverpod, and fl_chart — 120 Kerala recipes plus a daily meal-plan shuffle.',
    fullDescription: 'A Flutter diabetes-monitoring app with local-first storage via Drift SQLite, state managed with Riverpod, and charts rendered with fl_chart. It ships 120 Kerala recipes and a daily meal-plan shuffle to keep meals varied.',
    challenge: 'Tracking glucose, meals, and medication across devices was fragmented, and meal planning for a Kerala diet was a manual, repetitive chore.',
    solution: 'Built a Flutter app that stores everything in a local Drift SQLite database, charts trends with fl_chart, and auto-shuffles daily meal plans from a library of 120 Kerala recipes.',
    outcomes: [
      '120 Kerala recipes with automated daily meal-plan shuffling',
      'Local-first Drift SQLite storage with Riverpod state',
      'Clean trend charts via fl_chart'
    ],
    metrics: [
      { label: 'Recipes', value: '120' },
      { label: 'Meal plan', value: 'Daily shuffle' },
      { label: 'Storage', value: 'Drift SQLite' }
    ],
    timeline: 'Shipped',
    techStack: ['Flutter', 'Dart', 'Drift', 'Riverpod', 'fl_chart'],
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1200&q=80',
    featured: true
  },
  {
    id: 'cp-analyzer',
    slug: 'cp-analyzer-pipeline-dashboard',
    title: 'CP Analyzer — Cathodic Protection Survey Dashboard',
    client: 'CP Analyzer',
    category: 'Web App',
    shortDescription: 'Pipeline survey dashboard for cathodic-protection engineers — turning field readings into actionable corrosion insight.',
    fullDescription: 'A survey dashboard for cathodic-protection pipeline engineers. It turns field potential readings into clear corrosion insight, so teams can spot at-risk pipeline sections before they fail.',
    challenge: 'Cathodic-protection field readings were scattered across spreadsheets and reports, making it hard to see which pipeline sections were drifting out of safe range.',
    solution: 'Built a dashboard that ingests survey data and surfaces corrosion risk at a glance, with pipeline maps and reports for CP engineers.',
    outcomes: [
      'Survey data centralised into one readable dashboard',
      'Pipeline maps and risk reporting for CP engineers',
      'Field readings turned into actionable insight'
    ],
    metrics: [
      { label: 'Domain', value: 'Pipeline CP' },
      { label: 'Type', value: 'Survey dashboard' },
      { label: 'Stack', value: 'React' }
    ],
    timeline: 'Shipped',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=1200&q=80',
    featured: false
  },
  {
    id: 'jah-mess',
    slug: 'jah-mess-management-system',
    title: 'JAH Mess — Offline Mess Management System',
    client: 'JAH Mess',
    category: 'Custom Software',
    shortDescription: 'Windows desktop mess-management system with bundled runtime DLLs and SHA-256 machine-bound license enforcement.',
    fullDescription: 'A Windows desktop mess-management system shipped as a self-contained installer that bundles the MSVC runtime and camera DLLs, with offline license enforcement keyed to the machine and a rolling licence window.',
    challenge: 'Running a desktop system across varied Windows PCs meant missing runtime DLLs and fragile licensing that was easy to bypass or break.',
    solution: 'Bundled msvcp140/vcruntime140/camera DLLs into the installer and enforced licences with a SHA-256 hash of machine + days + salt, so the app runs and stays locked offline.',
    outcomes: [
      'Self-contained installer with bundled runtime + camera DLLs',
      'SHA-256 machine-bound offline licence enforcement',
      'Rolling licence window derived from the hash'
    ],
    metrics: [
      { label: 'License', value: 'SHA-256' },
      { label: 'Platform', value: 'Windows desktop' },
      { label: 'Mode', value: 'Offline-bound' }
    ],
    timeline: 'Shipped',
    techStack: ['C++', 'Windows', 'MSVC runtime', 'Camera SDK'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    featured: false
  },
  {
    id: 'johns-bakery',
    slug: 'johns-bakery-website',
    title: "John's Bakery — Warm Online Storefront",
    client: "John's Bakery",
    category: 'Website',
    shortDescription: 'A warm, appetizing Kerala bakery website — menus, ordering, and that first-bite feeling.',
    fullDescription: "A Kerala bakery website built to feel as warm as the storefront itself — clear menus, easy ordering, and an appetizing brand that turns casual visitors into regulars.",
    challenge: 'The bakery had no real online presence, and customers had no way to browse the menu or place an order without calling in.',
    solution: 'Designed and built a fast static bakery site with a warm brand, browsable menu, and frictionless ordering paths.',
    outcomes: [
      'Warm, appetizing brand that mirrors the storefront',
      'Clear menus with easy ordering paths',
      'Fast, static, and mobile-first'
    ],
    metrics: [
      { label: 'Type', value: 'Static site' },
      { label: 'Focus', value: 'Menu & ordering' },
      { label: 'Stack', value: 'Tailwind CSS' }
    ],
    timeline: 'Live',
    techStack: ['HTML', 'CSS', 'Tailwind CSS', 'JavaScript'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    featured: false
  }
];

export const LIFECYCLE_STEPS = [
  {
    stage: 'discovery',
    name: '1. Discovery & Alignment',
    summary: 'We diagnose your product goals, technical constraints, user needs, and exact success metrics.',
    whatWeDo: 'Deep architectural audit, competitor teardown, user journey mapping, and scope definition.',
    clientAction: 'Participate in a 60-minute kick-off session and share brand/domain assets.',
    deliverable: 'Product Specification Blueprint & Milestone Roadmap'
  },
  {
    stage: 'proposal',
    name: '2. Scoped Architecture & Proposal',
    summary: 'A clear, fixed-price proposal with no hidden change fees or ambiguous deliverables.',
    whatWeDo: 'Itemized feature breakdowns, technology recommendations, fixed timeline commitments.',
    clientAction: 'Review timeline, technical approach, and sign off on deliverables.',
    deliverable: 'Fixed-Price Statement of Work (SOW)'
  },
  {
    stage: 'agreement',
    name: '3. Legal Agreement & SOW',
    summary: 'Clean, plain-language contract with complete IP transfer, confidentiality, and warranty clauses.',
    whatWeDo: 'Send mutual NDA, IP assignment agreements, and digital signing packet.',
    clientAction: 'Review and execute digital contract (takes <5 minutes).',
    deliverable: 'Executed Studio Agreement'
  },
  {
    stage: 'advance',
    name: '4. Advance Milestone Payment',
    summary: 'Standard 50% kick-off deposit securely escrowed to initiate dedicated sprint allocation.',
    whatWeDo: 'Initialize your private Git repo, private Client Portal account, and staging infrastructure.',
    clientAction: 'Process invoice via wire, ACH, or secure card link.',
    deliverable: 'Client Portal Credentials & Production Sprint Lock'
  },
  {
    stage: 'design',
    name: '5. UI/UX Systems & High-Fidelity Design',
    summary: 'Figma prototypes crafted down to the pixel, micro-interactions, and component design tokens.',
    whatWeDo: 'Interactive wireframes, custom typography pairings, responsive layouts, and motion guidelines.',
    clientAction: 'Review live interactive prototype in your portal and approve design sign-off.',
    deliverable: 'Approved Figma Design System & Prototype'
  },
  {
    stage: 'development',
    name: '6. Engineering & Full-Stack Development',
    summary: 'Clean TypeScript codebase built with production architecture, security best practices, and zero bloat.',
    whatWeDo: 'Frontend component library, database schemas, API integrations, and continuous deployments.',
    clientAction: 'Track real-time progress via your live Client Portal timeline.',
    deliverable: 'Live Staging Environment on Private URL'
  },
  {
    stage: 'review',
    name: '7. Collaborative Review & Refinement',
    summary: 'Interactive testing where you click through the live staging link and submit trackable feedback.',
    whatWeDo: 'Provide live staging access, triage comments, and execute requested refinements.',
    clientAction: 'Submit structured feedback items through your dedicated portal feedback tool.',
    deliverable: 'Refined Staging Candidate & Feedback Sign-Off'
  },
  {
    stage: 'qa',
    name: '8. Rigorous QA & Security Audit',
    summary: 'Cross-browser testing, mobile device lab validation, WCAG AA accessibility, and security checks.',
    whatWeDo: 'Core Web Vitals profiling, SSL/DNS configuration, responsive stress testing, and edge caching.',
    clientAction: 'Conduct final user acceptance validation.',
    deliverable: 'Audit & Performance Scorecard (95+ score target)'
  },
  {
    stage: 'launch',
    name: '9. Production Launch & DNS Deployment',
    summary: 'Zero-downtime cutover to your production domain with automated backups and monitoring.',
    whatWeDo: 'Point production DNS, provision edge SSL, configure CDN, submit Google Search Console sitemap.',
    clientAction: 'Provide domain registrar access or configure designated A/CNAME records.',
    deliverable: 'Public Production Release & Live Site Verification'
  },
  {
    stage: 'handover',
    name: '10. Handover & Full IP Transfer',
    summary: 'All repository access, credentials, documentation, and video walkthroughs transferred to you.',
    whatWeDo: 'Invite your team to GitHub repository, export all design assets, and host recorded walkthrough.',
    clientAction: 'Confirm receipt of all administrative keys and documentation.',
    deliverable: 'Complete Handover Package & 100% IP Assignment'
  },
  {
    stage: 'support',
    name: '11. 30-Day Warranty & Retainer Support',
    summary: 'Complimentary 30-day bug-free warranty plus ongoing monthly maintenance and feature expansion.',
    whatWeDo: '24/7 uptime monitoring, automated weekly cloud backups, and prompt response SLA.',
    clientAction: 'Choose optional ongoing maintenance plan to keep systems hardened and evolving.',
    deliverable: 'Warranty Coverage & Monthly Studio SLA'
  }
];

export const INITIAL_PORTAL_PROJECT: PortalProject = {
  id: 'proj-apex-702',
  name: 'Apex Institutional Investor Portal',
  clientName: 'Julian Vance',
  clientEmail: 'julian@apexinvest.com',
  clientCompany: 'Apex Asset Management LLC',
  category: 'Web App',
  currentStage: 'development',
  stageProgress: 68,
  statusSummary: 'Sprint 3 complete: Core authentication and dynamic capital call dashboards deployed to staging. QA test suite passing on all target tablet & desktop viewports.',
  nextMilestone: 'Investor KYC & Plaid Bank Link Integration',
  nextMilestoneDueDate: 'March 18, 2026',
  stagingUrl: 'https://staging-apex.bitnexel.dev',
  payment: {
    totalBudget: 24000,
    percentReceived: 70,
    amountPaid: 16800,
    nextDueAmount: 7200,
    nextDueCondition: 'Final 30% balance due upon QA acceptance and before production DNS launch',
    milestones: [
      { name: 'Kick-off Advance (50%)', percent: 50, amount: 12000, status: 'paid' },
      { name: 'Design Sign-Off & Architecture (20%)', percent: 20, amount: 4800, status: 'paid' },
      { name: 'Final Staging Review & Launch Handover (30%)', percent: 30, amount: 7200, status: 'current' }
    ]
  },
  pendingItems: [
    {
      id: 'item-1',
      title: 'Plaid Production Sandbox API Keys',
      description: 'Needed to authenticate live ACH banking routes in the capital calls module.',
      status: 'pending',
      dueDate: 'March 15, 2026',
      category: 'API Credentials'
    },
    {
      id: 'item-2',
      title: 'Legal Disclaimer Copy for Accredited Investors',
      description: 'Required on Step 4 of the onboarding wizard before the user accepts terms.',
      status: 'submitted',
      category: 'Legal Copy'
    }
  ],
  files: [
    {
      id: 'file-1',
      name: 'Bitnexel_Apex_Master_SOW_Signed.pdf',
      size: '2.4 MB',
      type: 'PDF',
      category: 'Contract',
      date: 'Feb 02, 2026'
    },
    {
      id: 'file-2',
      name: 'System_Architecture_and_Security_Spec_v2.pdf',
      size: '4.8 MB',
      type: 'PDF',
      category: 'Specification',
      date: 'Feb 10, 2026'
    },
    {
      id: 'file-3',
      name: 'Apex_UI_Design_Tokens_and_Assets.zip',
      size: '24.1 MB',
      type: 'ZIP',
      category: 'Design Asset',
      date: 'Feb 22, 2026'
    },
    {
      id: 'file-4',
      name: 'Invoice_001_Advance_Paid.pdf',
      size: '420 KB',
      type: 'PDF',
      category: 'Invoice',
      date: 'Feb 03, 2026'
    }
  ],
  feedbackItems: [
    {
      id: 'fb-1',
      page: '/investor/dashboard',
      section: 'Capital Call Table',
      currentBehavior: 'Shows dollar amounts with 4 decimals instead of standard currency rounding.',
      requestedChange: 'Format as rounded whole currency (e.g. $250,000) with hover tooltip for exact cents.',
      priority: 'low',
      status: 'resolved',
      submittedAt: 'Yesterday at 3:45 PM'
    },
    {
      id: 'fb-2',
      page: '/investor/documents',
      section: 'Bulk PDF Export',
      currentBehavior: 'Downloads each tax schedule as a separate individual file.',
      requestedChange: 'Add a single "Download All Tax Packets (ZIP)" button for annual filings.',
      priority: 'medium',
      status: 'in_progress',
      submittedAt: 'Today at 10:15 AM'
    }
  ],
  changeRequests: [
    {
      id: 'cr-101',
      title: 'Add Multi-Currency Support (EUR & GBP)',
      description: 'Allow European LP family offices to view capital calls and balance sheets denominated in Euros.',
      impactHours: 18,
      addedCost: 2400,
      status: 'quoted',
      submittedAt: 'March 06, 2026'
    }
  ],
  messages: [
    {
      id: 'msg-1',
      sender: 'bitnexel',
      text: 'Good morning Julian! Sprint 3 build is pushed to your private staging link. Take a look at the portfolio analytics chart when you have a moment.',
      timestamp: 'Yesterday at 9:00 AM'
    },
    {
      id: 'msg-2',
      sender: 'client',
      text: 'Looks exceptionally slick. Tested on my iPad Pro and the responsiveness is razor sharp. I left two structured feedback notes in the portal tab.',
      timestamp: 'Yesterday at 4:10 PM'
    },
    {
      id: 'msg-3',
      sender: 'bitnexel',
      text: 'Already reviewed! The currency rounding fix is deployed to staging. The bulk ZIP export is being implemented in today\'s sprint.',
      timestamp: 'Today at 11:30 AM'
    }
  ],
  activityLog: [
    {
      id: 'act-1',
      title: 'Sprint 3 Staging Deployed',
      description: 'Interactive capital call tables and portfolio charts pushed to staging.',
      timestamp: 'Yesterday at 8:45 AM',
      author: 'Bitnexel Lead Engineer',
      stage: 'development'
    },
    {
      id: 'act-2',
      title: 'Milestone 2 Sign-Off Accepted',
      description: 'High-fidelity Figma prototypes and user flows approved by client.',
      timestamp: 'Feb 24, 2026',
      author: 'Julian Vance',
      stage: 'design'
    },
    {
      id: 'act-3',
      title: 'Project Kickoff & Git Repo Initialized',
      description: 'CI/CD pipeline and Cloudflare worker endpoints established.',
      timestamp: 'Feb 03, 2026',
      author: 'Bitnexel Studio',
      stage: 'advance'
    }
  ],
  retainerPlan: {
    tier: 'Growth',
    uptime: '99.99%',
    lastBackup: 'Today at 04:00 AM UTC (Automated)',
    responseGuarantee: '< 2 Hours Priority SLA',
    monthlyHoursRemaining: 8
  }
};

export const mockCaseStudies = CASE_STUDIES;
export const mockClientProject = INITIAL_PORTAL_PROJECT;

