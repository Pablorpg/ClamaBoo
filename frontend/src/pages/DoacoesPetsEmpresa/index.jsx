import React, { useEffect, useState } from "react";
import NavbarCompany from "../../components/NavbarCompany";
import "./style.css";

export default function DoacoesPetsEmpresa() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const empresaId = localStorage.getItem("empresaAtivaId");
    const token = localStorage.getItem("companyToken");

    async function carregarPets() {
      try {
        const res = await fetch(`http://localhost:5000/api/donate/pets/${empresaId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setPets(data);
      } catch (error) {
        console.error("Erro ao carregar pets:", error);
      }
    }

    carregarPets();
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
                <img src={`http://localhost:5000${pet.foto}`} alt={pet.nome} className="pet-foto" />

                <h3>{pet.nome}</h3>

                <p><strong>Espécie:</strong> {pet.especie}</p>
                <p><strong>Idade:</strong> {pet.idade}</p>
                <p><strong>Sexo:</strong> {pet.sexo}</p>
                <p><strong>Castrado:</strong> {pet.castrado}</p>

                <p className="temperamento"><em>{pet.temperamento}</em></p>

                <p><strong>Local:</strong> {pet.local}</p>

                <small className="data">
                  Recebido em: {new Date(pet.createdAt).toLocaleDateString("pt-BR")}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
