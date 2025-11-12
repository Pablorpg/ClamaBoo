import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedUserRoute from "./routes/ProtectedUserRoute";
import ProtectedCompanyRoute from "./routes/ProtectedCompanyRoute";

import LoginRegister from "./pages/LoginRegister";
import HomeUser from "./pages/HomeUser";
import DashboardCompany from "./pages/Dashboard";
import CompanyProfile from "./pages/CompanyProfile";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route
          path="/Inicio"
          element={
            <ProtectedUserRoute>
              <HomeUser />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/empresa/dashboard"
          element={
            <ProtectedCompanyRoute>
              <DashboardCompany />
            </ProtectedCompanyRoute>
          }
        />
        <Route path="/company/:id" element={<CompanyProfile />} />

      </Routes>
    </BrowserRouter>
  );
}
