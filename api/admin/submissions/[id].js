import { supabaseAdmin } from '../../_supabaseAdmin.js';
import { requireAdmin } from '../../_requireAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.statusCode = 405;
    res.setHeader('Allow', 'DELETE');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Method not allowed' }));
    return;
  }

  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;

  const id = req.query?.id;
  if (!id || typeof id !== 'string') {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Missing id' }));
    return;
  }

  const { error } = await supabaseAdmin.from('intake_submissions').delete().eq('id', id);
  if (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Delete failed', error }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true }));
}
