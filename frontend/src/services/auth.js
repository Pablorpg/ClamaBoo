const API = import.meta.env.VITE_API_URL;

export async function register(data) {
  const payload = {
    username: data.username?.trim(),
    email: data.email?.trim(),
    password: data.password
  };

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return res.json();
}

export async function login(body) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw data;

  return data;
}


export async function registerCompany(body) {
  const res = await fetch(`${API}/company/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);

  return data;
}

export async function loginCompany(body) {
  const res = await fetch(`${API}/company/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw data;

  return data;
}


export async function forgot(email) {
  const payload = { email: email?.trim() };

  const res = await fetch(`${API}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return res.json();
}

export async function reset({ email, code, newPassword }) {
  const payload = {
    email: email?.trim(),
    code: code?.trim(),
    newPassword
  };

  const res = await fetch(`${API}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return res.json();
}
