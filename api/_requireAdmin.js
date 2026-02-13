import { supabaseAdmin } from './_supabaseAdmin.js';

const ADMIN_EMAIL = 'roniversonroguel.startuplab@gmail.com';

export const requireAdmin = async (req, res) => {
  const adminToken = process.env.ADMIN_TOKEN;
  if (adminToken && req.headers['x-admin-token'] === adminToken) {
    return { ok: true, user: { email: ADMIN_EMAIL }, jwt: null };
  }

  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  const jwt = match?.[1];
  if (!jwt) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Unauthorized' }));
    return { ok: false };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(jwt);
  const user = data?.user;

  if (error || !user) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Unauthorized' }));
    return { ok: false };
  }

  const email = (user.email || '').toLowerCase();
  if (email !== ADMIN_EMAIL.toLowerCase()) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Forbidden' }));
    return { ok: false };
  }

  return { ok: true, user, jwt };
};
