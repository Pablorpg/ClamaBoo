const API = import.meta.env.VITE_API_URL;

export async function forgotCompany(email) {
  const res = await fetch(`${API}/company/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  return res.json();
}

export async function resetCompany(data) {
  const res = await fetch(`${API}/company/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}
