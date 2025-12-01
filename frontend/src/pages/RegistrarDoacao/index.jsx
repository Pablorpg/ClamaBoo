import React, { useState } from "react";
import NavbarCompany from "../../components/NavbarCompany";
import { toast } from "react-toastify";
import "./style.css";

export default function RegistrarDoacao() {
  const [valor, setValor] = useState("");
  const [nome, setNome] = useState("");

  const registrarDoacao = (e) => {
    e.preventDefault();

    if (!valor || valor <= 0) {
      toast.error("Digite um valor válido!");
      return;
    }

    const companyData = JSON.parse(localStorage.getItem("companyData") || "{}");

    const novaDoacao = {
      id: Date.now(),
      valor: parseFloat(valor),
      data: new Date().toLocaleDateString("pt-BR"),
      nome: nome.trim() || "Anônimo",
      anonimo: !nome.trim(),
      empresaId: String(companyData.id), 
      empresaNome: companyData.companyName, 
    };


    const doacoes = JSON.parse(localStorage.getItem("doacoes") || "[]");
    doacoes.push(novaDoacao);
    localStorage.setItem("doacoes", JSON.stringify(doacoes));

    toast.success(`Doação de R$ ${valor} registrada com sucesso!`, {
      position: "top-center",
    });

    setValor("");
    setNome("");
  };

  return (
    <>
      <NavbarCompany />

      <div className="register-donation-page">
        <div className="register-card">
          <h1>Registrar Doação Recebida</h1>
          <p>Use este formulário quando uma doação chegar no extrato do PIX</p>

          <form onSubmit={registrarDoacao}>
            <div className="input-group">
              <label>Valor recebido (R$)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="50.00"
                required
              />
            </div>

            <div className="input-group">
              <label>Nome do doador (opcional)</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Deixe em branco para anônimo"
              />
            </div>

            <button type="submit" className="register-btn">
              Registrar Doação
            </button>
          </form>

          <div className="tip">
            <strong>Dica:</strong> Toda vez que cair um PIX na conta da ONG, venha aqui e registre!
          </div>
        </div>
      </div>
    </>
  );
}