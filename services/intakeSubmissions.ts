import { ClientFormData } from '../types';

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
