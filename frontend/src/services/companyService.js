const API = import.meta.env.VITE_API_URL;

export async function searchCompanies(category) {
  const res = await fetch(`${API}/company/search?category=${encodeURIComponent(category)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}

export async function getCompanyById(id) {
  const res = await fetch(`${API}/company/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}
