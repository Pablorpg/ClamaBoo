export const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Erro ao salvar no localStorage", e);
  }
};

export const safeGetItem = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error("Erro ao ler localStorage", e);
    return defaultValue;
  }
};

const STORAGE_EVENT = "clamaboo-storage-changed";
export const notificarMudanca = () => window.dispatchEvent(new Event(STORAGE_EVENT));
export const STORAGE_UPDATED_EVENT = STORAGE_EVENT;

export function getEmpresaIdCorreto(context = "") {
  if (localStorage.getItem("companyToken")) {
    const cd = safeGetItem("companyData", {});
    if (cd?.id) return String(cd.id);
  }

  if (context === "doacao") {
    try {
      const raw = localStorage.getItem("empresaAtivaParaDoacao");
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj?.id) return String(obj.id);
      }
    } catch (e) { /* ignore */ }
  }

  if (context === "denuncia") {
    try {
      const raw = localStorage.getItem("empresaAtivaParaDenuncia");
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj?.id) return String(obj.id);
      }
    } catch (e) { /* ignore */ }
  }

  const empresaAtivaId = localStorage.getItem("empresaAtivaId");
  if (empresaAtivaId) return String(empresaAtivaId);

  return null;
}

export const salvarDoacao = (novaDoacao) => {
  const empresaIdFromObj = novaDoacao && novaDoacao.empresaId ? String(novaDoacao.empresaId) : null;
  const empresaId = empresaIdFromObj || getEmpresaIdCorreto("doacao");

  if (!empresaId) {
    console.error("Nenhuma empresa ativa definida para salvar doação.");
    return;
  }

  const toSave = {
    ...novaDoacao,
    empresaId: String(empresaId),
  };

  const atuais = safeGetItem("doacoes", []);
  atuais.push(toSave);
  safeSetItem("doacoes", atuais);
  notificarMudanca();
};

/**
 * salvarDenuncia: aceita novaDenuncia. Se novaDenuncia.empresaId estiver presente usa ele,
 * senão tenta pegar a seleção de denuncia (empresaAtivaParaDenuncia) ou companyData (se ONG logada).
 */
export const salvarDenuncia = (novaDenuncia) => {
  const empresaIdFromObj = novaDenuncia && novaDenuncia.empresaId ? String(novaDenuncia.empresaId) : null;
  const empresaId = empresaIdFromObj || getEmpresaIdCorreto("denuncia");

  if (!empresaId) {
    console.error("Nenhuma empresa ativa definida para salvar denúncia.");
    return;
  }

  const toSave = {
    ...novaDenuncia,
    empresaId: String(empresaId),
  };

  const atuais = safeGetItem("denuncias", []);
  atuais.push(toSave);
  safeSetItem("denuncias", atuais);
  notificarMudanca();
};
