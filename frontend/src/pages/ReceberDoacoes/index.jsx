import React, { useEffect, useState } from "react";
import NavbarCompany from "../../components/NavbarCompany";
import { toast } from "react-toastify";
import "./style.css";

export default function ReceberDoacoes() {
  const [empresa, setEmpresa] = useState(null);

  useEffect(() => {
    const dadosEmpresa = JSON.parse(localStorage.getItem("companyData") || "{}");
    if (dadosEmpresa.companyName) {
      setEmpresa(dadosEmpresa);
    }
  }, []);

  const chavePix = empresa?.pixKey || "Não cadastrada";
  const linkDoacao = `https://clamaboo.com/doar/${empresa?.id || "sua-empresa"}`;
  const urlQrCode = empresa?.qrcode || null;

  const copiarPix = () => {
    navigator.clipboard.writeText(chavePix);
    toast.success("Chave PIX copiada com sucesso!");
  };

  const copiarLink = () => {
    navigator.clipboard.writeText(linkDoacao);
    toast.success("Link copiado! Agora é só compartilhar!");
  };

  if (!empresa) {
    return <div className="carregando-empresa">Carregando dados da empresa...</div>;
  }

  return (
    <>
      <NavbarCompany />

      <div className="pagina-receber-doacoes">
        <div className="container-doacoes">

          <h1 className="titulo-principal">
            Receba Doações Fácil
          </h1>
          <p className="subtitulo">
            Compartilhe seu QR Code e link com quem quiser ajudar os animais!
          </p>

          <h2 className="nome-empresa">{empresa.companyName}</h2>

          <div className="container-qrcode">
            {urlQrCode ? (
              <img src={urlQrCode} alt="QR Code PIX" className="qrcode-imagem" />
            ) : (
              <div className="qrcode-vazio">
                <p>QR Code do PIX</p>
                <small>Cadastre no seu perfil para aparecer aqui</small>
              </div>
            )}
          </div>

          <section className="secao-pix">
            <h3>Chave PIX</h3>
            <div className="caixa-texto">
              <code className="chave-pix">{chavePix}</code>
            </div>
            <button onClick={copiarPix} className="botao-copiar botao-verde">
              Copiar Chave PIX
            </button>
          </section>

          <section className="secao-link">
            <h3>Link Direto para Doação</h3>
            <div className="caixa-texto caixa-link">
              <span className="link-doacao">{linkDoacao}</span>
            </div>
            <button onClick={copiarLink} className="botao-copiar botao-azul">
              Copiar Link
            </button>
          </section>

          <p className="mensagem-final">
            Compartilhe no WhatsApp, Instagram, Stories, Facebook...<br />
            <strong>Quanto mais divulgar, mais animais você salva!</strong>
          </p>

        </div>
      </div>
    </>
  );
}