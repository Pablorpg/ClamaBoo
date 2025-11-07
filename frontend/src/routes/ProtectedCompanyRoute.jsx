import { Navigate } from "react-router-dom";

export default function ProtectedCompanyRoute({ children }) {
  const token = localStorage.getItem("companyToken");

  if (!token) {
    return <Navigate to="/empresa/login" replace />;
  }

  return children;
}
