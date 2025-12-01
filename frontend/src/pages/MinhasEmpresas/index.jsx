import React, { useEffect, useState } from "react";
import "./style.css";
import CompanyLogoPlaceholder from "../../assets/ClamaBooLogo.png";
import { toast } from "react-toastify";
import NavbarUser from "../../components/NavbarUser";
import { notificarMudanca } from "../../utils/storage";

export default function MinhasEmpresas() {
  const [followed, setFollowed] = useState([]);
  const [loading, setLoading] = useState(true);

  const userToken = localStorage.getItem("userToken");
  const [empresaAtivaId, setEmpresaAtivaId] = useState(
    localStorage.getItem("empresaAtivaId") || null
  );

  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [companyToUnfollow, setCompanyToUnfollow] = useState(null);

  useEffect(() => {
    if (!userToken) {
      toast.error("Faça login para ver suas empresas seguidas.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/follow/following", {
      headers: { Authorization: `Bearer ${userToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setFollowed(Array.isArray(data.following) ? data.following : []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erro ao carregar empresas seguidas");
      })
      .finally(() => setLoading(false));
  }, [userToken]);

  const activateCompany = (company) => {
    if (!company || !company.id) {
      toast.error("Erro ao ativar empresa.");
      return;
    }

    const idStr = String(company.id);

    // ESTE É O *ÚNICO* ID OFICIAL
    localStorage.setItem("empresaAtivaId", idStr);

    // Mantemos somente como “extra” (não mais usado para salvar)
    localStorage.setItem("empresaAtivaParaDenuncia", JSON.stringify(company));

    setEmpresaAtivaId(idStr);

    toast.success(`${company.companyName} agora recebe suas doações e denúncias!`, {
      position: "top-center",
      autoClose: 5000,
    });

    notificarMudanca();
  };

  const openUnfollowModal = (companyId, companyName) => {
    setCompanyToUnfollow({ id: companyId, name: companyName });
    setShowUnfollowModal(true);
  };

  const confirmUnfollow = async () => {
    if (!companyToUnfollow) return;

    try {
      const response = await fetch(`http://localhost:5000/api/follow/${companyToUnfollow.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (response.ok) {
        setFollowed((prev) => prev.filter((c) => c.id !== companyToUnfollow.id));

        // SE DESSEGUIR A EMPRESA ATIVA → LIMPA TUDO
        if (empresaAtivaId === String(companyToUnfollow.id)) {
          localStorage.removeItem("empresaAtivaId");
          localStorage.removeItem("empresaAtivaParaDenuncia");
          setEmpresaAtivaId(null);
        }

        toast.success(`Você deixou de seguir ${companyToUnfollow.name}`);
        window.dispatchEvent(new Event("followChange"));
      } else {
        toast.error("Erro ao deixar de seguir");
      }
    } catch (err) {
      toast.error("Erro de conexão com o servidor");
    } finally {
      setShowUnfollowModal(false);
      setCompanyToUnfollow(null);
    }
  };

  if (loading) {
    return (
      <>
        <NavbarUser />
        <div className="followed-companies-body">
          <p style={{ textAlign: "center", padding: "100px", fontSize: "1.5rem" }}>
            Carregando suas empresas...
          </p>
        </div>
      </>
    );
  }

  if (followed.length === 0) {
    return (
      <>
        <NavbarUser />
        <div className="followed-companies-body">
          <h2>Minhas Empresas Seguidas</h2>
          <p style={{ textAlign: "center", fontSize: "1.5rem", color: "#7f8c8d", marginTop: "50px" }}>
            Você ainda não segue nenhuma empresa.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarUser />
      <div className="followed-companies-body">
        <h2>Minhas Empresas Seguidas</h2>
        <p className="txtEcolha">
          Escolha qual empresa vai receber suas doações e denúncias:
        </p>

        <div className="companies-list">
          {followed.map((company) => (
            <div key={company.id} className="company-card">
              <img
                src={company.profileImage ? `http://localhost:5000${company.profileImage}` : CompanyLogoPlaceholder}
                alt={company.companyName}
                className="company-img"
              />
              <h3>{company.companyName}</h3>
              <p>{company.about?.substring(0, 100)}...</p>

              <div className="botoes-acao">
                {empresaAtivaId === String(company.id) ? (
                  <button className="active-btn" disabled>
                    Ativa
                  </button>
                ) : (
                  <button className="activate-btn" onClick={() => activateCompany(company)}>
                    Ativar
                  </button>
                )}

                <button className="unfollow-btn" onClick={() => openUnfollowModal(company.id, company.companyName)}>
                  Deixar de seguir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showUnfollowModal && (
        <div className="modal-overlay" onClick={() => setShowUnfollowModal(false)}>
          <div className="modal-unfollow" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tem certeza?</h3>
            </div>
            <div className="modal-body">
              <p>
                Você realmente deseja <strong>deixar de seguir</strong> a empresa:
              </p>
              <h4>{companyToUnfollow?.name}</h4>
              <p style={{ color: "#e74c3c", fontSize: "1.1rem", marginTop: "15px" }}>
                Essa ação não pode ser desfeita.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowUnfollowModal(false)}>
                Cancelar
              </button>
              <button className="btn-confirm-unfollow" onClick={confirmUnfollow}>
                Sim, deixar de seguir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}