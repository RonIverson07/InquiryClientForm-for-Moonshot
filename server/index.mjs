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
