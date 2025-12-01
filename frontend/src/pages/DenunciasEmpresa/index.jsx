import React, { useState, useEffect } from "react";
import NavbarCompany from "../../components/NavbarCompany";
import { safeGetItem, getEmpresaIdCorreto, STORAGE_UPDATED_EVENT } from "../../utils/storage";
import { toast } from "react-toastify";
import "./style.css";

export default function DenunciasEmpresa() {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = () => {
    const empresaId = getEmpresaIdCorreto();
    if (!empresaId) {
      setDenuncias([]);
      setLoading(false);
      return;
    }

    const todas = safeGetItem("denuncias", []);
    const minhas = todas
      .filter(d => d && String(d.empresaId) === empresaId)
      .sort((a, b) => b.id - a.id);

    setDenuncias(minhas);
    setLoading(false);
  };

  useEffect(() => {
    carregar();
    window.addEventListener(STORAGE_UPDATED_EVENT, carregar);
    const interval = setInterval(carregar, 5000);
    return () => {
      window.removeEventListener(STORAGE_UPDATED_EVENT, carregar);
      clearInterval(interval);
    };
  }, []);

  const mudarStatus = (id, novoStatus) => {
    const todas = safeGetItem("denuncias", []);
    const atualizadas = todas.map(d => d.id === id ? { ...d, status: novoStatus } : d);
    localStorage.setItem("denuncias", JSON.stringify(atualizadas));
    carregar();
    toast.success("Status atualizado com sucesso!");
  };

  if (loading) {
    return (
      <>
        <NavbarCompany />
        <div className="loading-container">
          <p>Carregando denúncias...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarCompany />
      <div className="denuncias-wrapper">
        <div className="denuncias-container">
          <h1 className="page-title">Minhas Denúncias Recebidas</h1>

          {denuncias.length === 0 ? (
            <div className="empty-state">
              <h2>Nenhuma denúncia ainda</h2>
            </div>
          ) : (
            <div className="denuncias-grid">
              {denuncias.map((d) => (
                <div key={d.id} className={`denuncia-card status-${d.status}`}>
                  <div className="denuncia-header">
                    <h3 className="denuncia-title">
                      {d.detalhes.nome !== "Anônimo" ? `Denúncia de ${d.detalhes.nome}` : "Denúncia Anônima"}
                    </h3>
                    <div className="denuncia-meta">
                      <span><strong>Data:</strong> {d.data}</span>
                      <span className="status-badge">
                        {d.status === "nova" ? "Nova" : d.status === "em-analise" ? "Em Análise" : "Resolvida"}
                      </span>
                    </div>
                  </div>

                  <div className="denuncia-content">
                    <p><strong>Mensagem:</strong> {d.mensagem}</p>
                    <p><strong>Endereço:</strong> {d.detalhes.endereco}, {d.detalhes.bairro} - {d.detalhes.cidade}/{d.detalhes.estado}</p>
                    {d.detalhes.pontoReferencia !== "Sem referência" && (
                      <p><strong>Ponto de referência:</strong> {d.detalhes.pontoReferencia}</p>
                    )}
                    {d.detalhes.telefone !== "Não informado" && (
                      <p><strong>Telefone:</strong> {d.detalhes.telefone}</p>
                    )}
                  </div>

                  {d.foto && (
                    <div className="foto-placeholder">
                      <div className="foto-box">Foto anexada (em breve com upload real)</div>
                    </div>
                  )}

                  {d.status !== "resolvido" && (
                    <div className="denuncia-actions">
                      {d.status === "nova" && (
                        <button onClick={() => mudarStatus(d.id, "em-analise")} className="btn-analise">
                          Marcar como Em Análise
                        </button>
                      )}
                      {d.status === "em-analise" && (
                        <button onClick={() => mudarStatus(d.id, "resolvido")} className="btn-resolvido">
                          Marcar como Resolvida
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}