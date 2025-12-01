import React, { useEffect, useState } from "react";
import "./style.css";
import dogImg from "../../assets/dog.png";
import catImg from "../../assets/cat.png";
import rabbitImg from "../../assets/rabbit.png";
import pomeranianImg from "../../assets/pomeranian.png";
import recadoImg from "../../assets/recado.png";
import LogoClamaBoo from "../../assets/ClamaBooLogo.png";
import element1 from "../../assets/elemento1.png";
import element2 from "../../assets/elemento2.png";
import element3 from "../../assets/elemento3.png";
import element4 from "../../assets/elemento4.png";
import element5 from "../../assets/elemento5.png";

import NavbarUser from "../../components/NavbarUser";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function InicioUsuario() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userToken = localStorage.getItem("userToken");
  const [userName, setUserName] = useState("");

  const categories = [
    "Resgate de animais",
    "Adoção e cuidados",
    "Tratamento veterinário",
    "Fiscalização / Denúncias"
  ];

  async function handleCategoryClick(cat) {
    if (!userToken) {
      toast.error("Você precisa fazer login para pesquisar empresas.");
      return;
    }

    setLoading(true);
    setSearchResults([]);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/company/search?category=${encodeURIComponent(cat)}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const data = await res.json();
      setSearchResults(data.companies || []);
    } catch (err) {
      console.log("Erro ao buscar empresas:", err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }

  const doarParaEmpresa = (empresa) => {
    if (!userToken) {
      toast.error("Faça login para doar");
      return;
    }
    navigate("/doar-empresa", { state: { empresa } });
  };

  const openCompanyProfile = (id) => {
    if (!userToken) {
      toast.error("Faça login para acessar o perfil");
      return;
    }
    navigate(`/empresa/perfil/${id}`);
  };

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <>
      <NavbarUser />

      <div className="home-body">
        <section className="home-hero">
          <h1 className="welcome-text">
            Bem-vindo{userName ? `, ${userName}` : ""}!
          </h1>
          <h2>Ajude cães, gatos e outros animais em risco com sua doação e denúncia.</h2>

          <div className="home-cards">
            <div className="card orange">
              <div className="carddog">
                <img src={dogImg} className="imgdog" alt="Doações" />
              </div>
              <p className="txtDoacoes">Doações</p>
            </div>

            <div className="card blue">
              <div className="cardcat">
                <img src={catImg} className="imgcat" alt="Denúncias" />
              </div>
              <p className="txtDenuncias">Denúncias</p>
            </div>

            <div className="card pink">
              <div className="cardrabbit">
                <img src={rabbitImg} className="imgrabbit" alt="Contato" />
              </div>
              <p className="txtDuvidas">Dúvidas</p>
            </div>
          </div>
        </section>

        <section className="home-faq">
          <div className="faq-text">
            <h2 className="txtEmpresas">Procurar empresas</h2>
            <p className="txtEmpresa">
              Cada gesto de amor transforma uma vida. Ao doar, você alimenta a esperança!!
            </p>
            <button className="btn-search" onClick={() => setShowSearchModal(true)}>
              Pesquisar
            </button>
          </div>
          <div className="faq-image">
            <img src={pomeranianImg} className="imgdog2" alt="Cachorro feliz" />
          </div>

          <div className="elementsDesing">
            <img src={element1} className="element1" alt="" />
            <img src={element2} className="element2" alt="" />
            <img src={element3} className="element3" alt="" />
            <img src={element4} className="element4" alt="" />
            <img src={element5} className="element5" alt="" />
          </div>
        </section>

        <section className="home-recado">
          <img src={recadoImg} className="imgrecado" alt="Recado" />
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
                  <button
                    key={index}
                    className="category-btn"
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {loading && <p>Buscando empresas...</p>}

              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((company) => (
                    <div className="company-card" key={company.id}>
                      <div className="company-img-container">
                        <img
                          src={
                            company.profileImage
                              ? `http://localhost:5000${company.profileImage}`
                              : LogoClamaBoo
                          }
                          alt={company.companyName}
                          className="company-img"
                          onError={(e) => (e.target.src = LogoClamaBoo)}
                        />
                      </div>

                      <div className="company-info">
                        <h3>{company.companyName}</h3>
                        <p><strong>Email:</strong> {company.email}</p>
                        <p><strong>Telefone:</strong> {company.phone || "Não informado"}</p>
                      </div>

                      <div className="company-actions">
                        <button
                          className="btn-perfil"
                          onClick={() => openCompanyProfile(company.id)}
                        >
                          Ver Perfil
                        </button>
                        <button
                          className="btn-doar"
                          onClick={() => doarParaEmpresa(company)}
                        >
                          Doar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && searchResults.length === 0 && <p>Nenhuma empresa encontrada.</p>}

              <button className="close-modal" onClick={() => setShowSearchModal(false)}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}