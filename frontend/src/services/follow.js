const RAW_API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = RAW_API.replace(/\/+$/, "");

function buildUrl(path) {
  const base = API.endsWith("/api") ? API : API + "/api";
  return base + (path.startsWith("/") ? path : "/" + path);
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ok: res.ok, text };
  }
}

function getAuthHeaderForFollow() {
  const userToken = localStorage.getItem("userToken");
  if (userToken && userToken !== "null" && userToken !== "undefined") {
    return { Authorization: `Bearer ${userToken}` };
  }
  const companyToken = localStorage.getItem("companyToken");
  if (companyToken && companyToken !== "null" && companyToken !== "undefined") {
    return { Authorization: `Bearer ${companyToken}` };
  }
  return {};
}

export async function followCompany(companyId) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaderForFollow(),
  };

  const res = await fetch(buildUrl(`/follow/follow/${companyId}`), {
    method: "POST",
    headers,
    body: JSON.stringify({}),
  });
  return await safeJson(res);
}

export async function unfollowCompany(companyId) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaderForFollow(),
  };

  const res = await fetch(buildUrl(`/follow/unfollow/${companyId}`), {
    method: "DELETE",
    headers,
  });
  return await safeJson(res);
}

export async function checkFollowing(companyId) {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaderForFollow(),
  };

  const res = await fetch(buildUrl(`/follow/check/${companyId}`), {
    method: "GET",
    headers,
  });
  return await safeJson(res);
}
