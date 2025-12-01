import React, { useEffect, useState } from "react";
import NavbarUser from "../../components/NavbarUser";
import { toast } from "react-toastify";
import "./style.css";

export default function MinhasDenuncias() {
  const [denuncias, setDenuncias] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [denunciaParaExcluir, setDenunciaParaExcluir] = useState(null);

  useEffect(() => {
    const todasDenuncias = JSON.parse(localStorage.getItem("denuncias") || "[]");
    const dadosUsuario = JSON.parse(localStorage.getItem("userData") || "{}");

    const minhasDenuncias = todasDenuncias.filter(denuncia =>
      denuncia.detalhes?.email === dadosUsuario.email ||
      denuncia.detalhes?.telefone === dadosUsuario.phone
    );

    setDenuncias(minhasDenuncias);
  }, []);

  const abrirModalExclusao = (denuncia) => {
    setDenunciaParaExcluir(denuncia);
    setModalAberto(true);
  };

  const confirmarExclusao = () => {
    if (!denunciaParaExcluir) return;

    const todasDenuncias = JSON.parse(localStorage.getItem("denuncias") || "[]");
    const novasDenuncias = todasDenuncias.filter(d => d.id !== denunciaParaExcluir.id);

    localStorage.setItem("denuncias", JSON.stringify(novasDenuncias));
    setDenuncias(prev => prev.filter(d => d.id !== denunciaParaExcluir.id));

    setModalAberto(false);
    setDenunciaParaExcluir(null);

    toast.success("Denúncia excluída!", {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "colored",
    });
  };

  const obterCorStatus = (status) => {
    if (status === "nova") return "status-nova";
    if (status === "em-analise") return "status-analise";
    return "status-resolvida";
  };

  const formatarStatus = (status) => {
    if (status === "nova") return "Nova";
    if (status === "em-analise") return "Em análise";
    return "Resolvida";
  };

  return (
    <>
      <NavbarUser />

      <div className="container-denuncias">
        <h1 className="titulo-pagina">Minhas Denúncias</h1>

        {denuncias.length === 0 ? (
          <p className="mensagem-vazia">
            Você ainda não fez nenhuma denúncia.
          </p>
        ) : (
          <div className="lista-denuncias">
            {denuncias.map((denuncia) => (
              <div key={denuncia.id} className="card-denuncia">
                <div className="conteudo-denuncia">
                  <strong className="nome-empresa">{denuncia.empresaNome}</strong>
                  <p className="mensagem-denuncia">{denuncia.mensagem}</p>
                  <small className="data-denuncia">
                    {new Date(denuncia.data).toLocaleDateString("pt-BR")}
                  </small>
                </div>

                <div className="acoes-denuncia">
                  <span className={`status-denuncia ${obterCorStatus(denuncia.status)}`}>
                    {formatarStatus(denuncia.status)}
                  </span>

                  <button
                    className="botao-excluir-denuncia"
                    onClick={() => abrirModalExclusao(denuncia)}
                    title="Excluir denúncia"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalAberto && (
        <div className="modal-excluir-denuncia-fundo" onClick={() => setModalAberto(false)}>
          <div className="modal-excluir-denuncia" onClick={(e) => e.stopPropagation()}>
            <h3>Tem certeza?</h3>
            <p>
              Você está prestes a <strong>excluir permanentemente</strong> esta denúncia.
            </p>
            <p style={{ fontStyle: "italic", color: "#e74c3c", margin: "15px 0" }}>
              Essa ação <strong>não pode ser desfeita</strong>.
            </p>

            <div className="botoes-modal">
              <button className="btn-cancelar" onClick={() => setModalAberto(false)}>
                Cancelar
              </button>
              <button className="btn-confirmar-exclusao" onClick={confirmarExclusao}>
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}