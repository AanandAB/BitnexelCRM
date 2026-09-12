export type RouteType = 
  | 'home' 
  | 'services' 
  | 'services/website' 
  | 'services/software' 
  | 'services/web-app' 
  | 'services-website' 
  | 'services-software' 
  | 'services-webapp' 
  | 'work' 
  | 'shelf'
  | 'work-detail'
  | 'process' 
  | 'pricing' 
  | 'about' 
  | 'contact' 
  | 'start' 
  | 'login' 
  | 'portal'
  | 'legal-privacy'
  | 'legal-terms'
  | 'seo-sitemap';

export type CurrencyCode = 'INR' | 'AED' | 'USD';

export interface LocationInfo {
  country: string;
  currency: CurrencyCode;
  currencySymbol: string;
  currencyLabel: string;
  isUAE: boolean;
}

export type ServiceBranch = 'website' | 'software' | 'webapp';

export type ProjectLifecycleStage = 
  | 'discovery'
  | 'proposal'
  | 'agreement'
  | 'advance'
  | 'design'
  | 'development'
  | 'review'
  | 'qa'
  | 'launch'
  | 'handover'
  | 'support';

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  tagline?: string;
  shortDescription?: string;
  fullDescription?: string;
  challenge: string;
  solution: string;
  outcomes: any[];
  metrics?: { label: string; value: string }[];
  timeline: string;
  techStack: string[];
  image?: string;
  featured?: boolean;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface FeedbackItem {
  id: string;
  page: string;
  section: string;
  currentBehavior: string;
  requestedChange: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'under_review' | 'accepted' | 'in_progress' | 'resolved';
  submittedAt: string;
}

export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  impactHours: number;
  addedCost: number;
  status: 'requested' | 'reviewed' | 'quoted' | 'approved' | 'in_progress' | 'done';
  submittedAt: string;
}

export interface PendingClientItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'submitted' | 'approved';
  dueDate?: string;
  category: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  type: string;
  category: 'Contract' | 'Specification' | 'Design Asset' | 'Handover' | 'Invoice';
  date: string;
  downloadUrl?: string;
}

export interface ProjectMessage {
  id: string;
  sender: 'client' | 'bitnexel';
  text: string;
  timestamp: string;
}

export interface PortalProject {
  id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  category: string;
  currentStage: ProjectLifecycleStage;
  stageProgress: number; // 0 - 100
  statusSummary: string;
  nextMilestone: string;
  nextMilestoneDueDate: string;
  stagingUrl?: string;
  payment: {
    totalBudget: number;
    percentReceived: number;
    amountPaid: number;
    nextDueAmount: number;
    nextDueCondition: string;
    milestones: {
      name: string;
      percent: number;
      amount: number;
      status: 'paid' | 'current' | 'upcoming';
    }[];
  };
  pendingItems: PendingClientItem[];
  files: ProjectFile[];
  feedbackItems: FeedbackItem[];
  changeRequests: ChangeRequest[];
  messages: ProjectMessage[];
  activityLog: {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    author: string;
    stage: ProjectLifecycleStage;
  }[];
  retainerPlan?: {
    tier: string;
    uptime: string;
    lastBackup: string;
    responseGuarantee: string;
    monthlyHoursRemaining?: number;
  };
  /** Real milestones synced from the CRM (for the 2-way approve flow). */
  milestones?: { id: string; name: string; status?: string; due_date?: string }[];
}

export interface OnboardingState {
  branch: ServiceBranch | null;
  decideHelper: {
    active: boolean;
    answers: {
      hasAccounts?: boolean;
      primaryPurpose?: string;
      customLogic?: boolean;
    };
  };
  currentStep: number;
  answers: {
    projectName?: string;
    businessName?: string;
    mainGoal?: string;
    pageCount?: string;
    hasBranding?: string;
    features?: string[];
    contentProvider?: string;
    timeline?: string;
    budgetRange?: string;
    // Software
    processToImprove?: string;
    internalUsers?: string;
    integrations?: string[];
    dataPrivacyStrict?: string;
    accessType?: string;
    // Web App
    needAccounts?: string;
    coreUserAction?: string;
    needPayments?: string;
    paymentType?: string;
    targetPlatforms?: string[];
    existingDesigns?: string;
  };
  clientAccount: {
    name: string;
    email: string;
    password?: string;
  };
}
