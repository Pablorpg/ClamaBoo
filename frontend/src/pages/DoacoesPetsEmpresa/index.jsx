import React, { useEffect, useState } from "react";
import NavbarCompany from "../../components/NavbarCompany";
import "./style.css";

export default function DoacoesPetsEmpresa() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const empresaId = localStorage.getItem("empresaAtivaId");

    const todasPets = JSON.parse(localStorage.getItem("petsDoacao") || "[]");

    const filtradas = todasPets.filter(
      (p) => String(p.empresaId) === String(empresaId)
    );

    setPets(filtradas);
  }, []);

  return (
    <>
      <NavbarCompany />

      <div className="pets-container">
        <h1 className="titulo-pets">Adoção de Pets Recebidos</h1>

        {pets.length === 0 ? (
          <p className="nenhum-pet">Nenhum pet enviado para adoção ainda.</p>
        ) : (
          <div className="pets-grid">
            {pets.map((pet) => (
              <div key={pet.id} className="pet-card">
                <img src={pet.foto} alt={pet.nome} className="pet-foto" />

                <h3>{pet.nome}</h3>

                <p><strong>Espécie:</strong> {pet.especie}</p>
                <p><strong>Idade:</strong> {pet.idade}</p>
                <p><strong>Sexo:</strong> {pet.sexo}</p>
                <p><strong>Castrado:</strong> {pet.castrado}</p>

                <p className="temperamento"><em>{pet.temperamento}</em></p>

                <p><strong>Local:</strong> {pet.local}</p>

                <small className="data">
                  Recebido em: {new Date(pet.data).toLocaleDateString("pt-BR")}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
