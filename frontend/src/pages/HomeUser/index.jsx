import React from "react";
import "./style.css";
import dogImg from "../../assets/dog.png";
import catImg from "../../assets/cat.png";
import rabbitImg from "../../assets/rabbit.png";
import pomeranianImg from "../../assets/pomeranian.png";
import recadoImg from "../../assets/recado.png";
import LogoClamaBoo from "../../assets/ClamaBooLogo.png"

export default function HomePage() {
  const userEmail = localStorage.getItem("userEmail");

  return (
    <div className="home-body">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          <img className="logoClamaBoo" src={LogoClamaBoo} alt="Logo" />
        </div>
        <nav>
          <ul>
            <li className="active">Início</li>
            <li>Sobre nós</li>
            <li>Doações</li>
            <li>Denúncias</li>
            <li>Contato</li>
          </ul>
        </nav>
      </header>

      {/* Seção principal */}
      <section className="home-hero">
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

      {/* Dúvidas Frequentes */}
      <section className="home-faq">
        <div className="faq-text">
          <h2>Dúvidas Frequentes</h2>
          <p>Cada gesto de amor transforma uma vida. Ao doar, você alimenta a esperança!!</p>
          <button className="btn-search">Pesquisar</button>
        </div>
        <div className="faq-image">
          <img src={pomeranianImg} alt="Cachorro feliz" />
        </div>
      </section>

      {/* Recado / informação */}
      <section className="home-recado">
        <img src={recadoImg} alt="Recado" />
        <div className="recado-text">
          <h3>Um recado para vocês!</h3>
          <p>
            Com a sua doação e denúncia, você pode ajudar animais como cães abandonados, gatos 
            filhotes, aves silvestres e outros em situação de risco. Faça a diferença hoje!
          </p>
        </div>
      </section>
    </div>
  );
}
