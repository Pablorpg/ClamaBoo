import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import NavbarUser from "../../components/NavbarUser";
import "./Doar.css";

export default function Doar() {
  const location = useLocation();
  const activeCompany = JSON.parse(localStorage.getItem("empresaAtivaParaDenuncia") || "{}");

  useEffect(() => {
    if (activeCompany?.id) {
      localStorage.setItem("empresaAtivaId", String(activeCompany.id));
    }
  }, [activeCompany?.id]);

  if (!activeCompany?.id) {
    return (
      <div className="doar-container">
        <h1>Você precisa escolher uma empresa ativa primeiro!</h1>
        <Link to="/minhas-empresas">Ir para Minhas Empresas</Link>
      </div>
    );
  }
  return (

    <>
      <NavbarUser />

      <div className="doar-container">
        <h1>Como você quer ajudar {activeCompany.companyName}?</h1>
        <div className="doar-options">
          <Link
            to="/doar-dinheiro"
            state={{ empresa: activeCompany }}
            className="doar-card"
          >
            <span className="emoji-icon">💵</span>
            <h2>Doar Dinheiro</h2>
            <p>Pix direto pra ONG</p>
          </Link>

          <Link
            to="/doar-pet"
            state={{ empresa: activeCompany }}
            className="doar-card pet"
          >
            <span className="emoji-icon">🐕</span>
            <h2>Doar um Pet</h2>
            <p>Encaminhar animal encontrado</p>
          </Link>
        </div>
      </div>
    </>
  );
}
