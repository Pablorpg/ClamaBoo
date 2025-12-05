import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style.css";
import LogoPadrao from "../../assets/ClamaBooLogo.png";
import { toast } from "react-toastify";

export default function PerfilPublicoEmpresa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [seguindo, setSeguindo] = useState(false);
  const [carregandoSeguidores, setCarregandoSeguidores] = useState(false);
  const [quantidadeSeguidores, setQuantidadeSeguidores] = useState(0);

  const userToken = localStorage.getItem("userToken");
  const ehUsuario = !!userToken;

  useEffect(() => {
    fetch(`http://localhost:5000/api/company/profile/${id}`, {
      headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Empresa não encontrada");
        return res.json();
      })
      .then((dados) => setEmpresa(dados.company || dados))
      .catch(() => navigate("/"))
      .finally(() => setCarregando(false));
  }, [id, userToken, navigate]);

  useEffect(() => {
    if (!ehUsuario) return;

    fetch(`http://localhost:5000/api/follow/check/${id}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((r) => r.json())
      .then((dados) => setSeguindo(dados.following === true))
      .catch(() => setSeguindo(false));
  }, [id, ehUsuario, userToken]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/follow/count/${id}`)
      .then((r) => r.json())
      .then((dados) => setQuantidadeSeguidores(dados.followersCount || 0))
      .catch(() => setQuantidadeSeguidores(0));
  }, [id]);

  const alternarSeguir = async () => {
    if (!ehUsuario) {
      toast.error("Faça login como usuário para seguir");
      return;
    }

    setCarregandoSeguidores(true);
    try {
      const metodo = seguindo ? "DELETE" : "POST";
      const resposta = await fetch(`http://localhost:5000/api/follow/${id}`, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!resposta.ok) {
        const erro = await resposta.text();
        throw new Error(erro || "Erro na requisição");
      }

      setSeguindo(!seguindo);
      setQuantidadeSeguidores(prev => seguindo ? prev - 1 : prev + 1);
      toast.success(seguindo ? "Deixou de seguir" : "Agora você está seguindo!");

      window.dispatchEvent(new Event("followChange"));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao seguir/deixar de seguir");
    } finally {
      setCarregandoSeguidores(false);
    }
  };

  if (carregando) return <div className="carregando">Carregando perfil...</div>;
  if (!empresa) return <div className="nao-encontrado">Empresa não encontrada</div>;

  const urlLogo = empresa.profileImage
    ? `http://localhost:5000${empresa.profileImage}`
    : LogoPadrao;

  return (
    <>

      <button className="botao-voltar" onClick={() => navigate("/Inicio")}>
        <p className="btnVoltar">Voltar ao início</p>
      </button>
      <div>

        <div className="container-perfil">
          <div className="lado-esquerdo">
            <img
              className="logo-empresa"
              src={urlLogo}
              alt={empresa.companyName}
              onError={(e) => (e.target.src = LogoPadrao)}
            />
            <div className="info-contato"><strong>Email:</strong> {empresa.email}</div>
            <div className="info-contato"><strong>Telefone:</strong> {empresa.phone || "Não informado"}</div>
            <div className="info-contato"><strong className="seguidor">Seguidores: </strong> {quantidadeSeguidores}</div>

            {ehUsuario && (
              <button
                className={`botao-seguir ${seguindo ? "ja-seguindo" : ""}`}
                onClick={alternarSeguir}
                disabled={carregandoSeguidores}
              >
                {carregandoSeguidores ? "..." : seguindo ? "Seguindo" : "Seguir"}
              </button>
            )}
          </div>

          <div className="lado-direito">
            <h2 className="nome-empresa">{empresa.companyName}</h2>
            <section className="secao-info">
              <h3>Sobre nós</h3>
              <p>{empresa.about || "Não informado"}</p>
            </section>
            <section className="secao-info">
              <h3>Objetivos</h3>
              <p>{empresa.objectives || "Não informado"}</p>
            </section>
            <section className="secao-info">
              <h3>Categorias</h3>
              <div className="categorias">
                {empresa.categories?.length > 0 ? (
                  empresa.categories.map((cat, i) => (
                    <span key={i} className="etiqueta-categoria">{cat}</span>
                  ))
                ) : (
                  <span>Nenhuma categoria</span>
                )}
              </div>
            </section>
            <section className="secao-info">
              <h3>Certificados</h3>
              {empresa.certificates?.length > 0 ? (
                <ul className="lista-certificados">
                  {empresa.certificates.map((cert, i) => (
                    <li key={i}>{cert}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum certificado cadastrado</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </>

  );
}