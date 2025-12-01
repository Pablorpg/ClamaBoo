import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoClamaBoo from "../../assets/ClamaBooLogo.png";
import "./style.css";

export default function NavbarUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const [podeInteragir, setPodeInteragir] = useState(false);

  const isActive = (path) => location.pathname === path;

  const verificarPermissao = useCallback(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setPodeInteragir(false);
      return;
    }

    const activeCompanyId = localStorage.getItem("activeCompanyId");
    if (!activeCompanyId || activeCompanyId === "null") {
      localStorage.removeItem("activeCompanyId");
    }

    fetch("http://localhost:5000/api/follow/following", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const following = Array.isArray(data.following) ? data.following : [];
        setPodeInteragir(following.length > 0);
      })
      .catch(() => setPodeInteragir(false));
  }, []);

  useEffect(() => {
    verificarPermissao();
  }, [location.pathname, verificarPermissao]);

  useEffect(() => {
    const handleFollowChange = () => verificarPermissao();
    window.addEventListener("followChange", handleFollowChange);
    return () => window.removeEventListener("followChange", handleFollowChange);
  }, [verificarPermissao]);

  return (
    <header className="navbar">
      <div className="navbar-container">

        <div
          className="logo-company"
          onClick={() => navigate("/Inicio")}
        >
          <img src={LogoClamaBoo} alt="ClamaBoo" />
        </div>

        <nav className="navbar-menu">
          <ul>
            <li
              className={isActive("/Inicio") ? "active" : ""}
              onClick={() => navigate("/Inicio")}
            >
              Início
            </li>

            {podeInteragir && (
              <>
                <li
                  className={
                    isActive("/doar") ||
                      isActive("/doar-pet") ||
                      isActive("/doar-dinheiro")
                      ? "active"
                      : ""
                  }
                  onClick={() => navigate("/doar")}
                >
                  Doação
                </li>

                <li
                  className={isActive("/denuncia") ? "active" : ""}
                  onClick={() => navigate("/denuncia")}
                >
                  Fazer Denúncia
                </li>
              </>
            )}

            <li
              className={isActive("/minhas-empresas") ? "active" : ""}
              onClick={() => navigate("/minhas-empresas")}
            >
              Minhas Empresas
            </li>

            <li
              className={isActive("/perfil") ? "active" : ""}
              onClick={() => navigate("/perfil")}
            >
              Perfil
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );

}
