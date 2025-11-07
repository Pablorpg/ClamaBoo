const API_BASE_URL = "http://localhost:5000";

export async function apiFetch(endpoint, method = "GET", body = null) {
  const userToken = localStorage.getItem("userToken");
  const companyToken = localStorage.getItem("companyToken");

  const headers = { "Content-Type": "application/json" };

  if (companyToken) {
    headers.Authorization = `Bearer ${companyToken}`;
  } else if (userToken) {
    headers.Authorization = `Bearer ${userToken}`;
  }

  const options = { method, headers };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  return response.json();
}
