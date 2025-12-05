import React, { useEffect, useState } from "react";
import NavbarCompany from "../../components/NavbarCompany";
import { safeGetItem, getEmpresaIdCorreto, STORAGE_UPDATED_EVENT } from "../../utils/storage";
import { toast } from "react-toastify";
import "./style.css";

export default function DoacoesEmpresa() {
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [chavePix, setChavePix] = useState("");
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [qrCodePreview, setQrCodePreview] = useState("");

  const empresaId = getEmpresaIdCorreto();

  useEffect(() => {
    const config = safeGetItem("empresaPixConfig", {});
    if (config[empresaId]) {
      setChavePix(config[empresaId].chave || "");
      setQrCodePreview(config[empresaId].qrcode || "");
    }
  }, [empresaId]);

  const carregar = () => {
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
  }, [empresaId]);

  const total = doacoes.reduce((acc, d) => acc + (Number(d.valor) || 0), 0).toFixed(2);

  const salvarConfigPix = () => {
    if (!chavePix.trim()) {
      toast.error("Preencha a chave PIX!");
      return;
    }

    if (qrCodeFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const qrcodeBase64 = reader.result;

        const configAtual = safeGetItem("empresaPixConfig", {});
        configAtual[empresaId] = {
          chave: chavePix.trim(),
          qrcode: qrcodeBase64
        };
        localStorage.setItem("empresaPixConfig", JSON.stringify(configAtual));

        const companyData = JSON.parse(localStorage.getItem("companyData") || "{}");
        companyData.pixKey = chavePix.trim();
        companyData.qrcode = qrcodeBase64;
        localStorage.setItem("companyData", JSON.stringify(companyData));

        toast.success("Configuração PIX salva com sucesso!", {
          position: "top-center",
          autoClose: 4000,
          icon: "Pix",
        });
        setModalAberto(false);
      };
      reader.readAsDataURL(qrCodeFile);
    } else {
      const configAtual = safeGetItem("empresaPixConfig", {});
      configAtual[empresaId] = {
        chave: chavePix.trim(),
        qrcode: qrCodePreview
      };
      localStorage.setItem("empresaPixConfig", JSON.stringify(configAtual));

      const companyData = JSON.parse(localStorage.getItem("companyData") || "{}");
      companyData.pixKey = chavePix.trim();
      companyData.qrcode = qrCodePreview;
      localStorage.setItem("companyData", JSON.stringify(companyData));

      toast.success("Configuração PIX salva com sucesso!");
      setModalAberto(false);
    }
  };

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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1 className="page-title">Doações Recebidas</h1>
            <button onClick={() => setModalAberto(true)} className="btn-config-pix">
              Configurar PIX
            </button>
          </div>

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

      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-pix" onClick={e => e.stopPropagation()}>
            <h2>Configurar Chave PIX e QR Code</h2>
            <p>Preencha para aparecer no card de doação do usuário</p>

            <input
              type="text"
              placeholder="Chave PIX (e-mail, CPF, telefone...)"
              value={chavePix}
              onChange={e => setChavePix(e.target.value)}
              className="input-pix"
            />

            <div className="qrcode-upload">
              {qrCodePreview ? (
                <img src={qrCodePreview} alt="QR Code atual" style={{ width: "200px", borderRadius: "12px", margin: "15px 0" }} />
              ) : (
                <div className="qrcode-vazio-modal">Nenhum QR Code cadastrado</div>
              )}
              <label className="btn-upload">
                Escolher novo QR Code
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files[0]) {
                      setQrCodeFile(e.target.files[0]);
                      setQrCodePreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <div style={{ display: "flex", gap: "15px", marginTop: "20px", justifyContent: "center" }}>
              <button onClick={salvarConfigPix} className="btn-salvar-pix">
                Salvar Configuração
              </button>
              <button onClick={() => setModalAberto(false)} className="btn-cancelar-pix">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}