import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedUserRoute from "./routes/ProtectedUserRoute";
import ProtectedCompanyRoute from "./routes/ProtectedCompanyRoute";

import LoginRegister from "./pages/LoginRegister";
import HomeUser from "./pages/HomeUser";
import DashboardCompany from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Tela principal de Login/Cadastro */}
        <Route path="/" element={<LoginRegister />} />

        {/* Página do usuário logado */}
        <Route
          path="/usuario/HomeUser"
          element={
            <ProtectedUserRoute>
              <HomeUser />
            </ProtectedUserRoute>
          }
        />

        {/* Página da empresa logada */}
        <Route
          path="/empresa/dashboard"
          element={
            <ProtectedCompanyRoute>
              <DashboardCompany />
            </ProtectedCompanyRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
