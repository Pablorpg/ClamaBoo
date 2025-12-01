import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoClamaBoo from "../../assets/ClamaBooLogo.png";
import "./style.css";

export default function NavbarCompany() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const companyData = JSON.parse(localStorage.getItem("companyData") || "{}");

    if (companyData?.id) {
      localStorage.setItem("empresaAtivaId", String(companyData.id));
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-company">
      <div className="navbar-company-container">
        <div
          className="logo-company"
          onClick={() => navigate("/empresa/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <img src={LogoClamaBoo} alt="ClamaBoo" />
        </div>

        <nav>
          <ul>
            <li
              className={isActive("/empresa/dashboard") ? "active" : ""}
              onClick={() => navigate("/empresa/dashboard")}
            >
              Dashboard
            </li>
            <li
              className={isActive("/empresa/doacoes") ? "active" : ""}
              onClick={() => navigate("/empresa/doacoes")}
            >
              Doações
            </li>
            <li
              className={isActive("/empresa/denuncias") ? "active" : ""}
              onClick={() => navigate("/empresa/denuncias")}
            >
              Denúncias
            </li>
            <li
              className={isActive("/empresa/editar-perfil") ? "active" : ""}
              onClick={() => navigate("/empresa/editar-perfil")} 
            >
              Perfil
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
