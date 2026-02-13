import { z } from 'zod';

const servicesSchema = z.object({
  aiWorkflowAutomation: z.boolean(),
  websiteDesignDevelopment: z.boolean(),
  softwareDevelopment: z.boolean(),
  digitalMarketingGrowth: z.boolean(),
  bookkeepingAccounting: z.boolean(),
  hrPayrollManagement: z.boolean(),
  businessMentorshipConsultation: z.boolean(),
});

export const intakeSubmissionSchema = z
  .object({
    fullName: z.string().trim().min(1, 'Full Name is required'),
    email: z.string().trim().email('Enter a valid email address'),
    phoneNumber: z
      .string()
      .trim()
      .min(1, 'Phone Number is required')
      .refine((val) => val.replace(/\D/g, '').length >= 10, 'Enter a valid phone number'),

    companyName: z.string().optional().nullable(),
    rolePosition: z.string().optional().nullable(),

    services: servicesSchema,
    selectedPackage: z.string().optional().nullable(),
    needsAndGoals: z.string().optional().nullable(),

    officeDuration: z.string().optional().nullable(),
    teamSize: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || /^(\d+|\d+-\d+|\d+\+)$/.test(val), 'Team Size must be numbers only'),

    eventType: z.string().optional().nullable(),
    expectedAttendees: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || /^\d+$/.test(val), 'Expected Attendees must be numbers only'),
    preferredDate: z.string().optional().nullable(),

    currentlyUsingTools: z.enum(['yes', 'no', '']).optional(),
    mainChallenge: z.string().optional().nullable(),

    referralSource: z.array(z.string()),
    otherReferralSource: z.string().optional().nullable(),

    preferredContact: z.enum(['Email', 'Phone', 'Messenger', '']),
    bestTimeToReach: z.string().trim().min(1, 'Best Time to Reach You is required'),
  })
  .superRefine((data, ctx) => {
    const selectedServices = Object.values(data.services).some(Boolean);
    if (!selectedServices) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['services'], message: 'Please select at least one service.' });
    }

    if (data.referralSource.includes('Other') && !data.otherReferralSource?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['otherReferralSource'], message: 'Please specify the referral source.' });
    }
  });
