import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "../pages/LoginRegister";
import HomeUser from "../pages/HomeUser";
import Dashboard from "../pages/Dashboard";
import CompanyProfile from "../pages/CompanyProfile";
import AuthSuccess from "../pages/AuthSuccess";

function ProtectedRoute({ children, type }) {
    const userToken = localStorage.getItem("userToken");
    const companyToken = localStorage.getItem("companyToken");

    if (type === "user" && !userToken) {
        return <Navigate to="/" />;
    }

    if (type === "company" && !companyToken) {
        return <Navigate to="/" />;
    }

    return children;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginRegister />} />

                <Route
                    path="/Inicio"
                    element={
                        <ProtectedRoute type="user">
                            <HomeUser />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/empresa/dashboard"
                    element={
                        <ProtectedRoute type="company">
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route path="/company/:id" element={<CompanyProfile />} />

                <Route path="/auth/success" element={<AuthSuccess />} />

                <Route path="*" element={<Navigate to="/" />} />

                <Route path="/minhas-empresas" element={<FollowedCompanies />} />
                <Route path="/doacao" element={<ProtectedUserRoute><DonationPage /></ProtectedUserRoute>} />
                <Route path="/denuncia" element={<ProtectedUserRoute><ComplaintPage /></ProtectedUserRoute>} />
            </Routes>
        </BrowserRouter>
    );
}
