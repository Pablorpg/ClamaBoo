(function applySavedTheme() {
  try {
    const companyKeys = ["empresaLogada", "companyToken", "companyId"];
    const userKeys = ["usuarioLogado", "userToken", "userData"];

    const hasCompany = companyKeys.some((k) => !!localStorage.getItem(k));
    const hasUser = userKeys.some((k) => !!localStorage.getItem(k));

    const temaEmpresa = localStorage.getItem("temaEmpresa");
    const temaUsuario = localStorage.getItem("temaUsuario");
    const temaFallback = localStorage.getItem("tema");

    let tema = null;

    if (hasCompany) {
      tema = temaEmpresa || temaFallback || "clamaboo";
    } else if (hasUser) {
      tema = temaUsuario || temaFallback || "clamaboo";
    } else {
      tema = temaUsuario || temaEmpresa || temaFallback || "clamaboo";
    }

    if (tema) {
      document.documentElement.className = `tema-${tema}`;

      console.info("[applySavedTheme] tema aplicado:", tema);
    }
  } catch (err) {
    console.warn("[applySavedTheme] falha:", err);
  }
})();

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
