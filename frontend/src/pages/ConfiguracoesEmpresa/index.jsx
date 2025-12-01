import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarCompany from "../../components/NavbarCompany";
import { toast } from "react-toastify";
import "./style.css";

export default function ConfiguracoesEmpresa() {
    const navigate = useNavigate();
    const [tema, setTema] = useState(null);
    const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);

    useEffect(() => {
        const temaSalvo = localStorage.getItem("temaEmpresa") || "clamaboo";
        setTema(temaSalvo);
    }, []);

    useEffect(() => {
        if (!tema) return;
        document.documentElement.className = `tema-${tema}`;
        localStorage.setItem("temaEmpresa", tema);
    }, [tema]);

    const mudarTema = (novoTema) => {
        setTema(novoTema);
        toast.success("Tema alterado!");
    };

    const excluirConta = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/company/delete-request", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("companyToken")}`
                }
            });

            if (!res.ok) {
                const erro = await res.json();
                throw new Error(erro.message || "Erro ao agendar exclusão");
            }

            toast.warning("Sua conta será excluída em 24 horas!", { autoClose: 5000 });
            setTimeout(() => navigate("/empresa/conta-desativada"), 1500);
        } catch (err) {
            toast.error(err.message || "Erro ao agendar exclusão");
        }
    };

    return (
        <>
            <NavbarCompany />
            <div className="config-pagina">
                <div className="config-card">
                    <h1>Configurações da Empresa</h1>
                    <p className="sub">Personalize a experiência do seu painel</p>

                    <div className="secao">
                        <h2>Aparência</h2>
                        <div className="botoes-tema">
                            <button className={tema === "clamaboo" ? "ativo" : ""} onClick={() => mudarTema("clamaboo")}>
                                ClamaBoo
                            </button>
                            <button className={tema === "escuro" ? "ativo" : ""} onClick={() => mudarTema("escuro")}>
                                Escuro
                            </button>
                        </div>
                    </div>

                    <div className="secao">
                        <h2>Ferramentas</h2>
                        <p className="msg-breve">Mais ferramentas disponíveis em breve!</p>
                    </div>

                    <div className="secao excluir-secao">
                        <button className="botao-excluir" onClick={() => setMostrarModalExcluir(true)}>
                            Excluir conta da empresa
                        </button>
                    </div>

                    <p className="creditos">ClamaBoo Empresas • Cuidando de quem cuida dos animais</p>
                </div>
            </div>

            {mostrarModalExcluir && (
                <div className="modal-fundo" onClick={() => setMostrarModalExcluir(false)}>
                    <div className="modal-excluir" onClick={(e) => e.stopPropagation()}>
                        <h2>Tem certeza?</h2>
                        <p>
                            Isso apagará permanentemente todos os dados da empresa.
                            <br /><br />
                            Sua conta ficará desativada por 24 horas antes da exclusão final!
                        </p>
                        <div className="botoes-modal">
                            <button className="botao-cancelar" onClick={() => setMostrarModalExcluir(false)}>
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