import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import NavbarCompany from "../../components/NavbarCompany";
import { safeGetItem, getEmpresaIdCorreto, STORAGE_UPDATED_EVENT } from "../../utils/storage";
import "./style.css";

export default function DashboardEmpresa() {
  const navigate = useNavigate();

  const [totalDoacoes, setTotalDoacoes] = useState("0.00");
  const [denunciasNovas, setDenunciasNovas] = useState(0);
  const [denunciasEmAnalise, setDenunciasEmAnalise] = useState(0);
  const [denunciasResolvidas, setDenunciasResolvidas] = useState(0);

  const carregarDados = () => {
    const empresaId = getEmpresaIdCorreto();
    if (!empresaId) return;

    const todasDoacoes = safeGetItem("doacoes", []);
    const minhasDoacoes = todasDoacoes.filter(d => d && String(d.empresaId) === empresaId);
    const total = minhasDoacoes.reduce((acc, d) => acc + (Number(d.valor) || 0), 0).toFixed(2);
    setTotalDoacoes(total);

    const todasDenuncias = safeGetItem("denuncias", []);
    const minhasDenuncias = todasDenuncias.filter(d => d && String(d.empresaId) === empresaId);

    setDenunciasNovas(minhasDenuncias.filter(d => d.status === "nova").length);
    setDenunciasEmAnalise(minhasDenuncias.filter(d => d.status === "em-analise").length);
    setDenunciasResolvidas(minhasDenuncias.filter(d => d.status === "resolvido").length);
  };

  useEffect(() => {
    carregarDados();
    window.addEventListener(STORAGE_UPDATED_EVENT, carregarDados);
    const interval = setInterval(carregarDados, 5000);
    return () => {
      window.removeEventListener(STORAGE_UPDATED_EVENT, carregarDados);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("companyToken")) {
      navigate("/empresa/login");
    }
  }, [navigate]);

  return (
    <>
      <NavbarCompany />
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <h1 className="dashboard-title">Bem-vindo ao seu Dashboard</h1>

          <div className="stats-grid">
            <div className="stat-card card-recebido">
              <h2>Total em Doações</h2>
              <p className="big-number">R$ {totalDoacoes}</p>
              <p className="card-subtitle">Gratidão eterna!</p>
            </div>

            <div className="stat-card card-novas">
              <h2>Denúncias Novas</h2>
              <p className="big-number">{denunciasNovas}</p>
              <p className="card-subtitle urgent">Precisam de atenção urgente</p>
            </div>

            <div className="stat-card card-analise">
              <h2>Em Análise</h2>
              <p className="big-number">{denunciasEmAnalise}</p>
            </div>

            <div className="stat-card card-resolvidas">
              <h2>Resolvidas</h2>
              <p className="big-number">{denunciasResolvidas}</p>
              <p className="card-subtitle">Vidas salvas!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
