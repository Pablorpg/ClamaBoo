import React, { useEffect, useState } from "react";
import NavbarCompany from "../../components/NavbarCompany";
import { safeGetItem, getEmpresaIdCorreto, STORAGE_UPDATED_EVENT } from "../../utils/storage";
import "./style.css";

export default function DoacoesEmpresa() {
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = () => {
    const empresaId = getEmpresaIdCorreto();
    if (!empresaId) {
      setDoacoes([]);
      setLoading(false);
      return;
    }

    const todas = safeGetItem("doacoes", []);
    const minhas = todas
      .filter(d => d && String(d.empresaId) === empresaId)
      .sort((a, b) => b.id - a.id);

    setDoacoes(minhas);
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

  const total = doacoes.reduce((acc, d) => acc + (Number(d.valor) || 0), 0).toFixed(2);

  if (loading) {
    return (
      <>
        <NavbarCompany />
        <div style={{ padding: "100px", textAlign: "center", fontSize: "1.5rem" }}>
          Carregando doações...
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarCompany />
      <div className="doacoes-wrapper">
        <div className="doacoes-container">
          <h1 className="page-title">Doações Recebidas</h1>

          <div className="total-card">
            <h2>Total Recebido</h2>
            <p className="total-value">R$ {total}</p>
            <p className="total-info">Obrigado por salvar tantas vidas!</p>
          </div>

          <div className="doacoes-list">
            <h2 className="list-title">Últimas Doações ({doacoes.length})</h2>

            {doacoes.length === 0 ? (
              <div className="empty-state">
                Nenhuma doação recebida ainda...<br />Mas a primeira está a caminho!
              </div>
            ) : (
              <div className="donations-grid">
                {doacoes.map(d => (
                  <div key={d.id} className="donation-item">
                    <div className="donation-info">
                      <strong className="donation-value">
                        R$ {Number(d.valor).toFixed(2)}
                      </strong>
                      <span className="donor-name">
                        {d.anonimo ? "Anônimo" : `por ${d.nome}`}
                      </span>
                    </div>
                    <div className="donation-date">
                      {new Date(d.data).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}