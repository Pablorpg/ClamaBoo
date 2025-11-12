const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function searchCompanies(category) {
  const res = await fetch(`${API}/api/company/search?category=${encodeURIComponent(category)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}

export async function getCompanyById(id) {
  const res = await fetch(`${API}/api/company/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}
