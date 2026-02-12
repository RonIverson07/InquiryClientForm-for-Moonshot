
export interface ClientFormData {
  id?: string;
  submittedAt?: string;
  // Contact Information
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName?: string;
  rolePosition?: string;

  // Services
  services: {
    aiWorkflowAutomation: boolean;
    websiteDesignDevelopment: boolean;
    softwareDevelopment: boolean;
    digitalMarketingGrowth: boolean;
    bookkeepingAccounting: boolean;
    hrPayrollManagement: boolean;
    businessMentorshipConsultation: boolean;
  };
  selectedPackage: string;
  needsAndGoals?: string;

  // Specific Details
  officeDuration: string;
  teamSize?: string;
  eventType?: string;
  expectedAttendees?: string;
  preferredDate?: string;
  currentlyUsingTools: 'yes' | 'no' | '';
  mainChallenge?: string;

  // Referral
  referralSource: string[];
  otherReferralSource?: string;
  preferredContact: 'Email' | 'Phone' | 'Messenger' | '';
  bestTimeToReach: string;
}

export enum FormStatus {
  IDLE = 'IDLE',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export enum AppView {
  INTAKE_FORM = 'INTAKE_FORM',
  LOGIN = 'LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export const MOCK_SUBMISSIONS: ClientFormData[] = [
  {
    id: '1',
    submittedAt: '2024-10-24 09:15 AM',
    fullName: 'Lauris Bawar',
    email: 'lauris.b@example.com',
    phoneNumber: '0912 345 6789',
    companyName: 'Studio Amihan',
    rolePosition: 'Founder',
    services: {
      aiWorkflowAutomation: true,
      websiteDesignDevelopment: false,
      softwareDevelopment: false,
      digitalMarketingGrowth: true,
      bookkeepingAccounting: false,
      hrPayrollManagement: false,
      businessMentorshipConsultation: true,
    },
    selectedPackage: 'StartupLab Pro — ₱9,999 / month',
    needsAndGoals: 'Looking for a premium workflow automation setup.',
    officeDuration: '6+ months',
    teamSize: '5',
    eventType: 'Tech Meetup',
    expectedAttendees: '30',
    preferredDate: '2024-11-15',
    currentlyUsingTools: 'yes',
    mainChallenge: 'Inefficient manual processes.',
    referralSource: ['Social Media', 'Website'],
    preferredContact: 'Email',
    bestTimeToReach: 'Afternoon'
  },
  {
    id: '2',
    submittedAt: '2024-10-23 02:45 PM',
    fullName: 'Maria Santos',
    email: 'maria.s@business.ph',
    phoneNumber: '0917 111 2222',
    companyName: 'Santos Logistics',
    rolePosition: 'Operations Manager',
    services: {
      aiWorkflowAutomation: true,
      websiteDesignDevelopment: true,
      softwareDevelopment: true,
      digitalMarketingGrowth: false,
      bookkeepingAccounting: false,
      hrPayrollManagement: true,
      businessMentorshipConsultation: false,
    },
    selectedPackage: 'Virtual Office Package — ₱1,999 / month',
    needsAndGoals: 'Interested in a virtual office for our main registration.',
    officeDuration: '1-3 months',
    teamSize: '1',
    currentlyUsingTools: 'no',
    mainChallenge: 'Scaling software for inventory tracking.',
    referralSource: ['Friend/Referral'],
    preferredContact: 'Phone',
    bestTimeToReach: 'Morning'
  }
];
