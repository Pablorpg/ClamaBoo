// src/utils/storage.js
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

// Evento global para notificações internas
const STORAGE_EVENT = "clamaboo-storage-changed";
export const notificarMudanca = () => window.dispatchEvent(new Event(STORAGE_EVENT));
export const STORAGE_UPDATED_EVENT = STORAGE_EVENT;

/**
 * Retorna o ID da empresa "correta" dependendo do contexto.
 * - Se o usuário estiver logado como empresa (companyToken) retorna companyData.id
 * - Se context === 'doacao' tenta empresaAtivaParaDoacao
 * - Se context === 'denuncia' tenta empresaAtivaParaDenuncia
 * - Senão, tenta empresaAtivaId (compatibilidade)
 *
 * Uso:
 *  getEmpresaIdCorreto() -> para páginas da empresa (usa companyData se existir)
 *  getEmpresaIdCorreto('doacao') -> tenta seleção doação
 *  getEmpresaIdCorreto('denuncia') -> tenta seleção denúncia
 */
export function getEmpresaIdCorreto(context = "") {
  // Se empresa (painel da ONG) está logada, prefere companyData
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

  // Compatibilidade com chave antiga / global
  const empresaAtivaId = localStorage.getItem("empresaAtivaId");
  if (empresaAtivaId) return String(empresaAtivaId);

  return null;
}

/**
 * salvarDoacao: aceita novaDoacao. Se novaDoacao.empresaId estiver presente usa ele,
 * senão tenta pegar a seleção de doação (empresaAtivaParaDoacao) ou companyData (se ONG logada).
 */
export const salvarDoacao = (novaDoacao) => {
  // prefer empresaId embutido no objeto (ex: DoarParaEmpresa já passou)
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
