import { Navigate } from "react-router-dom";

export default function ProtectedCompanyRoute({ children }) {
  const token = localStorage.getItem("companyToken");
  return token ? children : <Navigate to="/" />;
}