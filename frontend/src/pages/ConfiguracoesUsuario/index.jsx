import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarUser from "../../components/NavbarUser";
import { toast } from "react-toastify";
import "./style.css";

export default function ConfiguracoesUsuario() {
  const navigate = useNavigate();

  const [tema, setTema] = useState("clamaboo");
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const temaSalvo = localStorage.getItem("temaUsuario") || "clamaboo";
    setTema(temaSalvo);
    document.documentElement.className = `tema-${temaSalvo}`;

    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      toast.error("Erro ao carregar dados.");
    } finally {
      setCarregando(false);
    }
  };

  const mudarTema = (novoTema) => {
    setTema(novoTema);
    localStorage.setItem("temaUsuario", novoTema);
    document.documentElement.className = `tema-${novoTema}`;
    toast.success("Tema alterado!");
  };

  const excluirConta = () => {
    localStorage.removeItem("usuarioLogado");
    toast.success("Conta excluída.");
    setTimeout(() => navigate("/"), 3000);
  };

  if (carregando) return <div className="loading">Carregando...</div>;

  return (
    <>
      <NavbarUser />

      <div className="config-pagina">
        <div className="config-card">
          <h1>Configurações da Conta</h1>
          <p className="sub">Personalize sua experiência</p>

          {/* APARÊNCIA */}
          <div className="secao">
            <h2>Aparência</h2>
            <div className="botoes-tema">
              <button
                className={tema === "clamaboo" ? "ativo" : ""}
                onClick={() => mudarTema("clamaboo")}
              >
                ClamaBoo
              </button>

              <button
                className={tema === "escuro" ? "ativo" : ""}
                onClick={() => mudarTema("escuro")}
              >
                Escuro
              </button>
            </div>
            <span>Não será aplicado na página inicial.</span>
          </div>

          <div className="secao">
            <h2>Conta</h2>

            <button
              className="btn-editar-info"
              onClick={() => navigate("/config/editar-conta")}
            >
              Alterar informações da conta
            </button>
          </div>

          <div className="secao">
            <h2>Ferramentas</h2>
            <p className="msg-breve">🔧 Mais ferramentas em breve!</p>
          </div>

          <div className="secao excluir-secao">
            <button
              className="botao-excluir"
              onClick={() => setMostrarModalExcluir(true)}
            >
              Excluir conta
            </button>
          </div>

          <p className="creditos">ClamaBoo • Seu perfil, suas escolhas 🐾</p>
        </div>
      </div>

      {mostrarModalExcluir && (
        <div className="modal-fundo" onClick={() => setMostrarModalExcluir(false)}>
          <div className="modal-excluir" onClick={(e) => e.stopPropagation()}>
            <h2>Tem certeza?</h2>
            <p>
              Isso apagará permanentemente sua conta.
              {"\n\n"} Obrigado por fazer parte.
            </p>

            <div className="botoes-modal">
              <button
                className="botao-cancelar"
                onClick={() => setMostrarModalExcluir(false)}
              >
                Cancelar
              </button>

              <button className="botao-confirmar" onClick={excluirConta}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
