import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoClamaBoo from "../../assets/ClamaBooLogo.png";
import "./style.css";

export default function NavbarCompany() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const companyData = JSON.parse(localStorage.getItem("companyData") || "{}");

    if (companyData?.id) {
      localStorage.setItem("empresaAtivaId", String(companyData.id));
    }
  }, []);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="navbar-company">
      <div className="navbar-company-container">

        <div
          className="logo-company"
          onClick={() => goTo("/empresa/dashboard")}
          style={{ cursor: "pointer" }}
        >
          <img src={LogoClamaBoo} alt="ClamaBoo" />
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          ☰
        </div>

        <nav>
          <ul className={menuOpen ? "show" : ""}>
            <li
              className={isActive("/empresa/dashboard") ? "active" : ""}
              onClick={() => goTo("/empresa/dashboard")}
            >
              Dashboard
            </li>

            <li
              className={isActive("/empresa/doacoes") ? "active" : ""}
              onClick={() => goTo("/empresa/doacoes")}
            >
              Doações
            </li>

            <li
              className={isActive("/empresa/pets") ? "active" : ""}
              onClick={() => goTo("/empresa/pets")}
            >
              Adoção de Pets
            </li>

            <li
              className={isActive("/empresa/denuncias") ? "active" : ""}
              onClick={() => goTo("/empresa/denuncias")}
            >
              Denúncias
            </li>

            <li
              className={isActive("/empresa/editar-perfil") ? "active" : ""}
              onClick={() => goTo("/empresa/editar-perfil")}
            >
              Perfil
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}
