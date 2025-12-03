import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoClamaBoo from "../../assets/ClamaBooLogo.png";
import "./style.css";

export default function NavbarUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const [podeInteragir, setPodeInteragir] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const verificarPermissao = useCallback(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setPodeInteragir(false);
      return;
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

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo-company" onClick={() => goTo("/Inicio")}>
          <img className="logo" src={LogoClamaBoo} alt="ClamaBoo" />
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          ☰
        </div>

        <nav className="navUser">
          <ul className={menuOpen ? "show" : ""}>
            <li className={isActive("/Inicio") ? "active" : ""} onClick={() => goTo("/Inicio")}>
              Início
            </li>

            {podeInteragir && (
              <>
                <li
                  className={
                    location.pathname.includes("/doar") ? "active" : ""
                  }
                  onClick={() => goTo("/doar")}
                >
                  Doação
                </li>

                <li id="fD" className={isActive("/denuncia") ? "active" : ""} onClick={() => goTo("/denuncia")}>
                  Fazer Denúncia
                </li>
              </>
            )}

            <li id="mE" className={isActive("/minhas-empresas") ? "active" : ""} onClick={() => goTo("/minhas-empresas")}>
              Minhas Empresas
            </li>

            <li className={isActive("/perfil") ? "active" : ""} onClick={() => goTo("/perfil")}>
              Perfil
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}