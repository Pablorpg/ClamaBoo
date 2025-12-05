import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarUser from "../../components/NavbarUser";
import { toast } from "react-toastify";
import { salvarDoacao, safeGetItem } from "../../utils/storage";
import "./style.css";

export default function DoarParaEmpresa() {
  const location = useLocation();
  const navigate = useNavigate();

  const empresaFromState = location.state?.empresa;
  const empresaFromStorageRaw = localStorage.getItem("empresaAtivaParaDoacao");
  const empresaFromStorage = empresaFromStorageRaw
    ? JSON.parse(empresaFromStorageRaw)
    : null;

  const empresa = empresaFromState?.id ? empresaFromState : empresaFromStorage;

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userEmail = userData.email || "anonimo@clamaboo.com";

  const [valor, setValor] = useState("");
  const [nome, setNome] = useState("");
  const [chavePix, setChavePix] = useState("Carregando...");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (!empresa?.id) return;

    const config = safeGetItem("empresaPixConfig", {});
    const dadosSalvos = config[empresa.id];

    if (dadosSalvos?.chave) {
      setChavePix(dadosSalvos.chave);
      setQrCodeUrl(dadosSalvos.qrcode || "");
    } else {
      setChavePix(empresa.pixKey || "Não informada");
      setQrCodeUrl(empresa.qrcode || "");
    }
  }, [empresa]);

  if (!empresa?.id) {
    return (
      <>
        <NavbarUser />
        <div className="error-container">
          <h1>Nenhuma empresa selecionada</h1>
          <button onClick={() => navigate("/minhas-empresas")}>
            Escolher empresa
          </button>
        </div>
      </>
    );
  }

  const simularDoacao = (e) => {
    e.preventDefault();

    if (!valor || Number(valor) <= 0) {
      return toast.error("Valor inválido!");
    }

    const novaDoacao = {
      id: Date.now(),
      valor: parseFloat(Number(valor).toFixed(2)),
      data: new Date().toISOString(),
      nome: nome.trim() || "Anônimo",
      anonimo: !nome.trim(),
      empresaId: String(empresa.id),
      empresaNome: empresa.companyName,
      userEmail,
      tipo: "dinheiro",
    };

    salvarDoacao(novaDoacao);
    toast.success(`Doação de R$ ${valor} registrada com sucesso!`);

    setValor("");
    setNome("");
  };

  return (
    <>
      <NavbarUser />

      <div className="doar-wrapper">
        <div className="doar-card">
          <h1 className="doar-title">Doar para {empresa.companyName}</h1>

          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="QR Code PIX" className="qrcode-imagem" />
          ) : (
            <div className="qrcode-placeholder">QR Code não cadastrado</div>
          )}

          <p className="pix-key">
            <strong>Chave PIX:</strong> {chavePix}
          </p>

          <form onSubmit={simularDoacao} className="doar-form">
            <input
              type="number"
              step="0.01"
              placeholder="Valor da doação (ex: 50.00)"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Seu nome (opcional)"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <button type="submit" className="btn-doar">
              Doar Agora
            </button>
          </form>

          <p className="info-real">
            No mundo real você faria o PIX pelo seu banco.
            <br />
            Aqui estamos simulando para o projeto ficar completo!
          </p>
        </div>
      </div>
    </>
  );
}
