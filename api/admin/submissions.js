import { supabaseAdmin } from '../_supabaseAdmin.js';
import { requireAdmin } from '../_requireAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }

  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;

  const { data, error } = await supabaseAdmin
    .from('intake_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Fetch failed', error }));
    return;
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
    preferredContact: normalizePreferredContact(row.preferred_contact),
    bestTimeToReach: row.best_time_to_reach ?? '',
    bestTimeFrom: row.best_time_from ?? '',
    bestTimeTo: row.best_time_to ?? '',
  }));

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ submissions }));
}
