import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NavbarCompany from "../../components/NavbarCompany";
import CompanyLogoPlaceholder from "../../assets/ClamaBooLogo.png";
import "./style.css";

export default function EditarPerfilEmpresa() {
  const base = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "").replace(/\/api\/?$/, "");
  const API = base + "/api/company";

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [backup, setBackup] = useState(null);

  const companyToken = localStorage.getItem("companyToken");

  const loadMyCompany = async () => {
    if (!companyToken || companyToken === "null" || companyToken === "undefined") {
      toast.error("Você não está logado como empresa.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/profile/me`, {
        headers: { Authorization: `Bearer ${companyToken}` },
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      if (!data.company) throw new Error("Perfil não encontrado");

      const c = {
        ...data.company,
        about: data.company.about || "",
        objectives: data.company.objectives || "",
        phone: data.company.phone || "",
        categories: Array.isArray(data.company.categories) ? data.company.categories : [],
        certificates: Array.isArray(data.company.certificates)
          ? data.company.certificates
          : data.company.certificates?.split(",").map(s => s.trim()) || [],
      };

      setCompany(c);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar perfil: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyCompany();
  }, []);

  const startEditing = () => {
    setBackup(JSON.parse(JSON.stringify(company)));
    setEditing(true);
  };

  const cancelEditing = () => {
    setCompany(backup);
    setEditing(false);
    setBackup(null);
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const handlePhoneChange = (e) => {
    const masked = formatPhone(e.target.value);
    setCompany({ ...company, phone: masked });
  };

  const addCertificate = (text) => {
    if (!text.trim()) return;
    setCompany({ ...company, certificates: [...company.certificates, text.trim()] });
  };

  const removeCertificate = (idx) => {
    setCompany({
      ...company,
      certificates: company.certificates.filter((_, i) => i !== idx),
    });
  };

  const toggleCategory = (cat) => {
    if (!editing) return;
    const list = company.categories.includes(cat)
      ? company.categories.filter(c => c !== cat)
      : [...company.categories, cat];
    setCompany({ ...company, categories: list });
  };

  const uploadLogo = async (file) => {
    if (!file) return;
    try {
      const form = new FormData();
      form.append("logo", file);

      const res = await fetch(`${API}/profile/me/logo`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${companyToken}` },
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());

      await res.json();

      await loadMyCompany();

      toast.success("Logo atualizada com sucesso!");
    } catch (err) {
      toast.error("Erro ao enviar logo: " + err.message);
    }
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const payload = {
        companyName: company.companyName?.trim(),
        responsibleName: company.responsibleName?.trim() || null,
        phone: company.phone?.replace(/\D/g, "") || null,
        about: company.about?.trim() || "",
        objectives: company.objectives?.trim() || "",
        categories: company.categories || [],
        certificates: company.certificates || [],
      };

      const res = await fetch(`${API}/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${companyToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setCompany({
        ...data.company,
        categories: Array.isArray(data.company.categories) ? data.company.categories : [],
        certificates: Array.isArray(data.company.certificates) ? data.company.certificates : [],
      });

      toast.success("Perfil atualizado com sucesso!");
      setEditing(false);
    } catch (err) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Carregando perfil...</div>;
  if (!company) return <div className="loading">Perfil não encontrado.</div>;

  const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

  const logoUrl = company.profileImage
    ? `${baseURL}${company.profileImage}?v=${Date.now()}`
    : CompanyLogoPlaceholder;

  const categoryOptions = [
    "Resgate de animais",
    "Adoção e cuidados",
    "Tratamento veterinário",
    "Fiscalização / Denúncias",
  ];

  return (
    <>
      <NavbarCompany />

      <div className="editar-perfil-wrapper">
        <div className="editar-perfil-container">

          <div className="perfil-esquerdo">
            <div className="logo-box">
              <img
                key={company.profileImage}
                src={
                  company.profileImage
                    ? `http://localhost:5000${company.profileImage}`
                    : CompanyLogoPlaceholder
                }
                alt={company.companyName}
                className="company-logo"
                onError={(e) => {
                  e.target.src = CompanyLogoPlaceholder;
                }}
              />
            </div>

            <label className="file-label">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadLogo(e.target.files?.[0])}
              />
              <span>Trocar foto</span>
            </label>

            <div className="info-group">
              <strong>Telefone</strong>
              <p>{company.phone || "Não informado"}</p>
            </div>

            <div className="info-group">
              <strong>Email</strong>
              <p>{company.email || "Não informado"}</p>
            </div>

            <div className="acoes-perfil">
              {!editing ? (
                <>
                  <button className="btn-editar" onClick={startEditing}>
                    Editar perfil
                  </button>

                  <button
                    className="btn-editar"
                    onClick={() => (window.location.href = "/empresa/configuracoes")}
                  >
                    Configurações
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-salvar" onClick={saveChanges} disabled={saving}>
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </button>
                  <button className="btn-cancelar" onClick={cancelEditing}>
                    Cancelar
                  </button>
                </>
              )}
            </div>

          </div>

          <div className="perfil-direito">
            <div className="company-title">
              {editing ? (
                <input
                  value={company.companyName || ""}
                  onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                  className="input-nome-empresa"
                  placeholder="Nome da empresa"
                />
              ) : (
                <h2>{company.companyName}</h2>
              )}
            </div>

            <div className="info-section">
              <h3>Responsável</h3>
              {editing ? (
                <input
                  value={company.responsibleName || ""}
                  onChange={(e) => setCompany({ ...company, responsibleName: e.target.value })}
                  placeholder="Nome do responsável"
                />
              ) : (
                <p>{company.responsibleName || "Não informado"}</p>
              )}
            </div>

            <div className="info-section">
              <h3>Sobre nós</h3>
              {editing ? (
                <textarea
                  rows={5}
                  value={company.about}
                  onChange={(e) => setCompany({ ...company, about: e.target.value })}
                  placeholder="Fale sobre sua organização..."
                />
              ) : (
                <p>{company.about || "Não cadastrado"}</p>
              )}
            </div>

            <div className="info-section">
              <h3>Objetivos</h3>
              {editing ? (
                <textarea
                  rows={4}
                  value={company.objectives}
                  onChange={(e) => setCompany({ ...company, objectives: e.target.value })}
                  placeholder="Quais são seus principais objetivos?"
                />
              ) : (
                <p>{company.objectives || "Não cadastrado"}</p>
              )}
            </div>

            <div className="info-section">
              <h3>Categorias de atuação</h3>
              <div className="categories-grid">
                {categoryOptions.map((opt) => {
                  const selected = company.categories.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`chip ${selected ? "selected" : ""}`}
                      onClick={() => toggleCategory(opt)}
                      disabled={!editing}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="info-section">
              <h3>Certificados</h3>
              {editing ? (
                <CertificateEditor
                  certificates={company.certificates}
                  onAdd={addCertificate}
                  onRemove={removeCertificate}
                />
              ) : (
                <ul className="certificados-lista">
                  {company.certificates.length > 0 ? (
                    company.certificates.map((c, i) => <li key={i}>{c}</li>)
                  ) : (
                    <li>Nenhum certificado cadastrado</li>
                  )}
                </ul>
              )}
            </div>

            <div className="info-section">
              <h3>Telefone</h3>
              {editing ? (
                <input
                  value={company.phone || ""}
                  onChange={handlePhoneChange}
                  placeholder="(00) 90000-0000"
                />
              ) : (
                <p>{company.phone || "Não informado"}</p>
              )}
            </div>

            <div className="info-section">
              <h3>Criado em</h3>
              <p>
                {company.createdAt
                  ? new Date(company.createdAt).toLocaleDateString("pt-BR")
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CertificateEditor({ certificates, onAdd, onRemove }) {
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (text.trim()) {
      onAdd(text);
      setText("");
    }
  };

  return (
    <div className="cert-editor">
      <div className="cert-input-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Ex: ISO 9001, Certificado de Boas Práticas..."
        />
        <button type="button" onClick={handleAdd}>
          Adicionar
        </button>
      </div>

      <div className="cert-list">
        {certificates.length > 0 ? (
          certificates.map((c, i) => (
            <div key={i} className="cert-item">
              <span>{c}</span>
              <button type="button" onClick={() => onRemove(i)}>
                ×
              </button>
            </div>
          ))
        ) : (
          <p className="empty-cert">Nenhum certificado adicionado</p>
        )}
      </div>
    </div>
  );
}