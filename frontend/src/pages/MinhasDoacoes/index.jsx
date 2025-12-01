import React, { useEffect, useState } from "react";
import NavbarUser from "../../components/NavbarUser";
import "./style.css";

export default function MinhasDoacoes() {
  const [doacoes, setDoacoes] = useState([]);

  useEffect(() => {
    const todasDoacoes = JSON.parse(localStorage.getItem("doacoes") || "[]");
    const dadosUsuario = JSON.parse(localStorage.getItem("userData") || "{}");

    const minhasDoacoes = todasDoacoes.filter(
      (doacao) => doacao.userEmail === dadosUsuario.email
    );

    setDoacoes(minhasDoacoes);
  }, []);

  return (
    <>
      <NavbarUser />

      <div className="container-doacoes">
        <h1 className="titulo-pagina">Minhas Doações</h1>

        {doacoes.length === 0 ? (
          <p className="mensagem-vazia">
            Você ainda não fez nenhuma doação.
          </p>
        ) : (
          <div className="lista-doacoes">
            {doacoes.map((doacao) => (
              <div key={doacao.id} className="card-doacao">
                <div className="info-doacao">
                  <strong className="nome-empresa">{doacao.empresaNome}</strong>
                  <p className="valor-data">
                    R$ {doacao.valor} em{" "}
                    {new Date(doacao.data).toLocaleDateString("pt-BR")}
                  </p>
                  {doacao.mensagem && (
                    <small className="mensagem-personalizada">
                      "{doacao.mensagem}"
                    </small>
                  )}
                </div>

                <span className="status-doacao">Concluída</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}