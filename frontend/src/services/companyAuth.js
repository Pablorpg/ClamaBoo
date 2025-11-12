const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function forgotCompany(email) {
  const res = await fetch(`${API}/api/company/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  return res.json();
}

export async function resetCompany(data) {
  const res = await fetch(`${API}/api/company/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

