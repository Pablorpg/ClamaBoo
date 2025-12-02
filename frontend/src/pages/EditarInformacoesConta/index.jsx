import React, { useEffect, useState } from "react";
import NavbarUser from "../../components/NavbarUser";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function EditarInformacoesConta() {
    const navigate = useNavigate();
    const token = localStorage.getItem("userToken");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            setUsername(data.user.username);
            setEmail(data.user.email);
        } catch {
            toast.error("Erro ao carregar dados.");
        }
    };

    const salvar = async () => {
        try {
            const body = {
                username,
                email,
                senhaAtual,
                novaSenha
            };

            if (senhaAtual && novaSenha) {
                body.senhaAtual = senhaAtual;
                body.novaSenha = novaSenha;
            }

            const res = await fetch("http://localhost:5000/api/auth/profile/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) return toast.error(data.message);

            toast.success("Alterações salvas com sucesso!");

            const stored = JSON.parse(localStorage.getItem("userData") || "{}");
            stored.name = username;
            stored.email = email;
            localStorage.setItem("userData", JSON.stringify(stored));

            navigate("/configuracoes");

        } catch {
            toast.error("Erro ao salvar alterações.");
        }
    };

    return (
        <>
            <NavbarUser />

            <div className="config-pagina">
                <div className="config-card">
                    <h1>Editar Informações</h1>

                    <label>Nome de usuário</label>
                    <input
                        className="config-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Email</label>
                    <input
                        className="config-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Senha atual</label>
                    <input
                        type="password"
                        className="config-input"
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                    />

                    <label>Nova senha</label>
                    <input
                        type="password"
                        className="config-input"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                    />

                    <button className="btn-salvar-dados" onClick={salvar}>
                        Salvar alterações
                    </button>

                    <button className="btn-voltar" onClick={() => navigate("/configuracoes")}>
                        Voltar
                    </button>
                </div>
            </div>
        </>
    );
}
