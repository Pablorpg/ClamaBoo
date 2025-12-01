const API = import.meta.env.VITE_API_URL;

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ok: res.ok, text };
  }
}

export async function followCompany(companyId) {
  const res = await fetch(`${API}/follow/follow/${companyId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });

  return await safeJson(res);
}

export async function unfollowCompany(companyId) {
  const res = await fetch(`${API}/follow/unfollow/${companyId}`, {
    method: "DELETE",
    credentials: "include"
  });

  return await safeJson(res);
}
