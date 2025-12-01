import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarUser from "../../components/NavbarUser";
import "./style.css";

export default function PerfilUsuario() {
  const navigate = useNavigate();

  const rawUser = JSON.parse(localStorage.getItem("userData") || "{}");

  const user = {
    name: rawUser.name || rawUser.nome || rawUser.username || rawUser.fullName || "Usuário Anônimo",
    email: rawUser.email || rawUser.emailUser || "email não informado",
    phone: rawUser.phone || rawUser.telefone || rawUser.celular || "telefone não informado",
    photo: rawUser.photo || rawUser.foto || rawUser.profileImage || null,
  };

  const primeiraLetra = user.name.charAt(0).toUpperCase();

  return (
    <>
      <NavbarUser />

      <div className="perfil-container">
        <div className="perfil-content">
          <div className="perfil-info">
            <div className="perfil-avatar">
              {user.photo ? (
                <img src={user.photo} alt="Foto do perfil" />
              ) : (
                <div className="avatar-placeholder">
                  <span>{primeiraLetra}</span>
                </div>
              )}
            </div>

            <h1 className="perfil-nome">{user.name}</h1>

            <div className="perfil-dados">
              <div className="dado">
                <strong>E-mail</strong>
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          <div className="perfil-menu">
            <div className="menu-item" onClick={() => navigate("/minhas-empresas")}>
              Empresas seguidas
            </div>
            <div className="menu-item" onClick={() => navigate("/minhas-doacoes")}>
              Minhas doações
            </div>
            <div className="menu-item" onClick={() => navigate("/minhas-denuncias")}>
              Minhas denúncias
            </div>
            <div className="menu-item" onClick={() => navigate("/configuracoes")}>
              Configurações
            </div>
          </div>
        </div>
      </div>
    </>
  );
}