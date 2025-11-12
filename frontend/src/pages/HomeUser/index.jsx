import React, { useEffect, useState } from "react";
import "./style.css";
import dogImg from "../../assets/dog.png";
import catImg from "../../assets/cat.png";
import rabbitImg from "../../assets/rabbit.png";
import pomeranianImg from "../../assets/pomeranian.png";
import recadoImg from "../../assets/recado.png";
import LogoClamaBoo from "../../assets/ClamaBooLogo.png";
import { useNavigate } from "react-router-dom";

export default function HomeUser() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Resgate de animais",
    "Adoção e cuidados",
    "Tratamento veterinário",
    "Fiscalização / Denúncias"
  ];

  async function handleCategoryClick(cat) {
    setLoading(true);
    setSearchResults([]);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/api/company/search?category=${encodeURIComponent(cat)}`);
      const data = await res.json();
      setSearchResults(data.companies || []);
    } catch (err) {
      console.log("Erro ao buscar empresas:", err);
      setSearchResults([]);
    }

    setLoading(false);
  }

  function openCompanyProfile(id) {
    navigate(`/company/${id}`);
  }

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <div className="home-body">
      <header className="navbar">
        <div className="logo">
          <img className="logoClamaBoo" src={LogoClamaBoo} alt="Logo" />
        </div>

        <nav>
          <ul>
            <li className="active">Início</li>
            <li>Perfil</li>
          </ul>
        </nav>
      </header>

      <section className="home-hero">
        <h1 className="welcome-text">
          Bem-vindo{userName ? `, ${userName}` : ""}! 👋
        </h1>

        <h2>Ajude cães, gatos e outros animais em risco com sua doação e denúncia.</h2>

        <div className="home-cards">
          <div className="card orange">
            <img src={dogImg} alt="Doações" />
            <p>Doações</p>
          </div>
          <div className="card blue">
            <img src={catImg} alt="Denúncias" />
            <p>Denúncias</p>
          </div>
          <div className="card pink">
            <img src={rabbitImg} alt="Contato" />
            <p>Contato</p>
          </div>
        </div>
      </section>

      <section className="home-faq">
        <div className="faq-text">
          <h2>Dúvidas Frequentes</h2>
          <p>Cada gesto de amor transforma uma vida. Ao doar, você alimenta a esperança!!</p>
          <button className="btn-search" onClick={() => setShowSearchModal(true)}>Pesquisar</button>
        </div>
        <div className="faq-image">
          <img src={pomeranianImg} alt="Cachorro feliz" />
        </div>
      </section>

      <section className="home-recado">
        <img src={recadoImg} alt="Recado" />
        <div className="recado-text">
          <h3>Um recado para vocês!</h3>
          <p>
            Com a sua doação e denúncia, você pode ajudar animais em risco. Faça a diferença hoje!
          </p>
        </div>
      </section>
      {showSearchModal && (
        <div className="modal-bg">
          <div className="modal-box">
            <h2>Escolha uma categoria</h2>

            <div className="category-list">
              {categories.map((cat, index) => (
                <button key={index} className="category-btn" onClick={() => handleCategoryClick(cat)}>
                  {cat}
                </button>
              ))}
            </div>

            {loading && <p>🔎 Buscando...</p>}

            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(company => (
                  <div className="company-card" key={company.id}>
                    <div className="company-img-container">
                      <img
                        src={company.profileImage || ""}
                        alt={company.companyName}
                        className="company-img"
                      />
                    </div>

                    <div className="company-info">
                      <h3>{company.companyName}</h3>
                      <p><strong>Email:</strong> {company.email}</p>
                      <p><strong>Telefone:</strong> {company.phone}</p>
                      <p><strong>Categorias:</strong> {Array.isArray(company.categories) ? company.categories.join(", ") : "Não informadas"}</p>
                    </div>

                    <button className="company-btn" onClick={() => openCompanyProfile(company.id)}>
                      Acessar perfil
                    </button>
                  </div>


                ))}
              </div>
            )}


            {!loading && searchResults.length === 0 && <p>Nenhuma empresa encontrada.</p>}

            <button className="close-modal" onClick={() => setShowSearchModal(false)}>Fechar</button>
          </div>
        </div>
      )}

    </div>
  );
}
