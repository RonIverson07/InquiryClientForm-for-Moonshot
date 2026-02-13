import { ClientFormData } from '../types';
import { supabase } from '../lib/supabaseClient';

export const createIntakeSubmission = async (data: ClientFormData) => {
  const res = await fetch('http://localhost:3001/api/intake', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new Error(`Backend error (${res.status}): ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  }
};

export const listIntakeSubmissions = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch('http://localhost:3001/api/admin/submissions', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) {
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new Error(`Backend error (${res.status}): ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  }

  const json = (await res.json()) as { submissions: ClientFormData[] };
  return json.submissions;
};

export const deleteIntakeSubmission = async (id: string) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch(`http://localhost:3001/api/admin/submissions/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }
    throw new Error(`Backend error (${res.status}): ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  }
};
