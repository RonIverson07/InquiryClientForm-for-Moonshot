import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { intakeSubmissionSchema } from './validation.mjs';
import { supabaseAdmin } from './supabaseAdmin.mjs';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173'], // Vite default
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

/* ===============================
   EMAIL VALIDATION HELPER
================================= */
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/* ===============================
   HEALTH CHECK
================================= */
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

/* ===============================
   ADMIN LOGIN
================================= */
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ message: error.message });
  }

  return res.json({
    message: 'Login successful',
    user: data.user,
    session: data.session,
  });
});

/* ===============================
   ADMIN FORGOT PASSWORD
================================= */
app.post('/api/admin/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:5173/password-reset',
  });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  return res.json({ message: 'Password reset email sent' });
});

/* ===============================
   ADMIN FETCH SUBMISSIONS
================================= */
app.get('/api/admin/submissions', async (req, res) => {
  const adminToken = process.env.ADMIN_TOKEN;

  if (adminToken && req.header('x-admin-token') !== adminToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { data, error } = await supabaseAdmin
    .from('intake_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return res.status(500).json({ message: 'Fetch failed', error });
  }

  const submissions = (data ?? []).map((row) => ({
    id: row.id,
    submittedAt: row.created_at,

    fullName: row.full_name ?? '',
    email: row.email ?? '',
    phoneNumber: row.phone_number ?? '',
    companyName: row.company_name ?? '',
    rolePosition: row.role_position ?? '',

    services: row.services ?? {},
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
    preferredContact: row.preferred_contact ?? '',
    bestTimeToReach: row.best_time_to_reach ?? '',
  }));

  return res.json({ submissions });
});

/* ===============================
   ADMIN DELETE SUBMISSION
================================= */
app.delete('/api/admin/submissions/:id', async (req, res) => {
  const adminToken = process.env.ADMIN_TOKEN;

  if (adminToken && req.header('x-admin-token') !== adminToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Missing id' });
  }

  const { error } = await supabaseAdmin
    .from('intake_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ message: 'Delete failed', error });
  }

  return res.json({ ok: true });
});

/* ===============================
   INTAKE SUBMISSION
================================= */
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

    preferred_contact: data.preferredContact || null,
    best_time_to_reach: data.bestTimeToReach,
  };

  const { error } = await supabaseAdmin
    .from('intake_submissions')
    .insert(payload);

  if (error) {
    return res.status(500).json({ message: 'Insert failed', error });
  }

  return res.status(201).json({ ok: true });
});

/* ===============================
   SERVER START
================================= */
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
