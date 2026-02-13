import { intakeSubmissionSchema } from '../server/validation.mjs';
import { supabaseAdmin } from './_supabaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }

  const parsed = intakeSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        message: 'Validation failed',
        issues: parsed.error.issues,
      })
    );
    return;
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
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Insert failed', error }));
    return;
  }

  res.statusCode = 201;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true }));
}
