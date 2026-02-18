import express from 'express';
import cors from 'cors';

import { intakeSubmissionSchema } from './validation.mjs';
import { supabaseAdmin } from './supabaseAdmin.mjs';

const app = express();

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const requireAdmin = async (req, res, next) => {
  const adminToken = process.env.ADMIN_TOKEN;
  if (adminToken && req.header('x-admin-token') === adminToken) {
    return next();
  }

  const authHeader = req.header('authorization') || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  const jwt = match?.[1];
  if (!jwt) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(jwt);
  if (error || !data?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = data.user;
  return next();
};

app.get('/api/admin/submissions', requireAdmin, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('intake_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return res.status(500).json({ message: 'Fetch failed', error });
  }

  const normalizePreferredContact = (val) => {
    if (Array.isArray(val)) return val.filter(Boolean);
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return [];
      if (trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch {
          // ignore
        }
      }
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        const inner = trimmed.slice(1, -1).trim();
        if (!inner) return [];
        return inner
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [trimmed];
    }
    return [];
  };

  const submissions = (data ?? []).map((row) => ({
    id: row.id,
    submittedAt: row.created_at,

    fullName: row.full_name ?? '',
    email: row.email ?? '',
    phoneNumber: row.phone_number ?? '',
    companyName: row.company_name ?? '',
    rolePosition: row.role_position ?? '',

    services: row.services ?? {
      aiWorkflowAutomation: false,
      websiteDesignDevelopment: false,
      softwareDevelopment: false,
      digitalMarketingGrowth: false,
      bookkeepingAccounting: false,
      hrPayrollManagement: false,
      businessMentorshipConsultation: false,
    },
    selectedPackage: row.selected_package ?? '',
    needsAndGoals: row.needs_and_goals ?? '',

    officeDuration: row.office_duration ?? '',
    teamSize: row.team_size ?? '',
    eventType: row.event_type ?? '',
    expectedAttendees: row.expected_attendees ?? '',
    preferredDate: row.preferred_date ?? '',
    currentlyUsingTools: row.currently_using_tools ?? '',
    mainChallenge: row.main_challenge ?? '',

    referralSource: row.referral_source ?? [],
    otherReferralSource: row.other_referral_source ?? '',
    preferredContact: normalizePreferredContact(row.preferred_contact),
    bestTimeToReach: row.best_time_to_reach ?? '',
    bestTimeFrom: row.best_time_from ?? '',
    bestTimeTo: row.best_time_to ?? '',
  }));

  return res.json({ submissions });
});

app.delete('/api/admin/submissions/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Missing id' });
  }

  const { error } = await supabaseAdmin.from('intake_submissions').delete().eq('id', id);
  if (error) {
    return res.status(500).json({ message: 'Delete failed', error });
  }

  return res.json({ ok: true });
});

app.post('/api/intake', async (req, res) => {
  const parsed = intakeSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Validation failed',
      issues: parsed.error.issues,
    });
  }

  const data = parsed.data;

  const payload = {
    full_name: data.fullName,
    email: data.email,
    phone_number: data.phoneNumber,
    company_name: data.companyName || null,
    role_position: data.rolePosition || null,

    services: data.services,
    selected_package: data.selectedPackage || null,
    needs_and_goals: data.needsAndGoals || null,

    office_duration: data.officeDuration || null,
    team_size: data.teamSize || null,

    event_type: data.eventType || null,
    expected_attendees: data.expectedAttendees || null,
    preferred_date: data.preferredDate || null,

    currently_using_tools: data.currentlyUsingTools || null,
    main_challenge: data.mainChallenge || null,

    referral_source: data.referralSource,
    other_referral_source: data.otherReferralSource || null,

    preferred_contact: data.preferredContact,
    best_time_to_reach: data.bestTimeToReach,
    best_time_from: data.bestTimeFrom || null,
    best_time_to: data.bestTimeTo || null,
  };

  const { error } = await supabaseAdmin.from('intake_submissions').insert(payload);
  if (error) {
    return res.status(500).json({ message: 'Insert failed', error });
  }

  return res.status(201).json({ ok: true });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
