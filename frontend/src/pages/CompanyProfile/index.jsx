import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompanyById } from "../../services/companyService";

export default function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getCompanyById(id);
      if (res.company) setCompany(res.company);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (!company) return <div>Empresa não encontrada</div>;

  return (
    <div style={{padding:20}}>
      <h1>{company.companyName}</h1>
      <p><strong>Responsável:</strong> {company.responsibleName}</p>
      <p><strong>Telefone:</strong> {company.phone}</p>
      <p><strong>Email:</strong> {company.email}</p>
      <p><strong>Áreas:</strong> {Array.isArray(company.categories) ? company.categories.join(", ") : company.categories}</p>
      <p><strong>CNPJ:</strong> {company.cnpj || "-"}</p>
    </div>
  );
}
