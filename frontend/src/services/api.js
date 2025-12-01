
let API = import.meta.env.VITE_API_URL || "http://localhost:5000";
API = API.replace(/\/+$/, "");

if (!API.endsWith("/api")) {
  API += "/api";
}

export async function apiFetch(endpoint, method = "GET", body = null) {
  const userToken = localStorage.getItem("userToken");
  const companyToken = localStorage.getItem("companyToken");

  const headers = { "Content-Type": "application/json" };

  if (companyToken && companyToken !== "null" && companyToken !== "undefined") {
    headers.Authorization = `Bearer ${companyToken}`;
  }
  else if (userToken && userToken !== "null" && userToken !== "undefined") {
    headers.Authorization = `Bearer ${userToken}`;
  }

  const options = { method, headers };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(
    `${API}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`,
    options
  );

  if (response.status === 401) {
    return { error: true, message: "Unauthorized", status: 401 };
  }

  return response.json();
}

export async function followCompany(companyId) {
  return apiFetch(`/follow/follow/${companyId}`, "POST");
}

export async function unfollowCompany(companyId) {
  return apiFetch(`/follow/unfollow/${companyId}`, "DELETE");
}

export async function getFollowers() {
  return apiFetch(`/follow/followers`, "GET");
}
