const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function register(data) {
  const payload = {
    username: data.username?.trim(),
    email: data.email?.trim(),
    password: data.password
  };
  console.log("Payload de registro:", payload);

  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function login(data) {
  const payload = {
    email: data.email?.trim(),
    password: data.password
  };
  console.log("Payload de login:", payload);

  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function forgot(email) {
  const payload = { email: email?.trim() };
  console.log("Payload forgot:", payload);

  const res = await fetch(`${API}/api/auth/forgot-password`, {
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
  console.log("Payload reset:", payload);

  const res = await fetch(`${API}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}
