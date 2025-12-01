import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import ProtectedUserRoute from "./routes/ProtectedUserRoute";
import ProtectedCompanyRoute from "./routes/ProtectedCompanyRoute";

import LoginCadastro from "./pages/LoginCadastro";
import InicioUsuario from "./pages/InicioUsuario";
import MinhasEmpresas from "./pages/MinhasEmpresas";
import FazerDenuncia from "./pages/FazerDenuncia";
import DoarEmpresa from "./pages/DoarParaEmpresa";
import PerfilUsuario from "./pages/PerfilUsuario";
import MinhasDoacoes from "./pages/MinhasDoacoes";
import MinhasDenuncias from "./pages/MinhasDenuncias";
import ConfiguracoesUsuario from "./pages/ConfiguracoesUsuario";
import ContaDesativadaEmpresa from "./pages/ContaDesativadaEmpresa";
import EditarInformacoesConta from "./pages/EditarInformacoesConta";


import Doar from "./pages/Doar/Doar";
import DoarPet from "./pages/Doar/DoarPet";

import DashboardEmpresa from "./pages/DashboardEmpresa";
import EditarPerfilEmpresa from "./pages/EditarPerfilEmpresa";
import DoacoesEmpresa from "./pages/DoacoesEmpresa";
import DenunciasEmpresa from "./pages/DenunciasEmpresa";
import PerfilPublicoEmpresa from "./pages/PerfilPublicoEmpresa";
import ReceberDoacoes from "./pages/ReceberDoacoes";
import DoacoesPetsEmpresa from "./pages/DoacoesPetsEmpresa";
import ConfiguracoesEmpresa from "./pages/ConfiguracoesEmpresa";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<LoginCadastro />} />

        {/*usuario */}
        <Route
          path="/Inicio"
          element={
            <ProtectedUserRoute>
              <InicioUsuario />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/minhas-empresas"
          element={
            <ProtectedUserRoute>
              <MinhasEmpresas />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/denuncia"
          element={
            <ProtectedUserRoute>
              <FazerDenuncia />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/doar"
          element={
            <ProtectedUserRoute>
              <Doar />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/doar-dinheiro"
          element={
            <ProtectedUserRoute>
              <DoarEmpresa />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/doar-pet"
          element={
            <ProtectedUserRoute>
              <DoarPet />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/minhas-doacoes"
          element={
            <ProtectedUserRoute>
              <MinhasDoacoes />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/minhas-denuncias"
          element={
            <ProtectedUserRoute>
              <MinhasDenuncias />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedUserRoute>
              <PerfilUsuario />
            </ProtectedUserRoute>
          }
        />

        <Route
          path="/config/editar-conta"
          element={
            <ProtectedUserRoute>
              <EditarInformacoesConta />
            </ProtectedUserRoute>
          }
        />


        <Route
          path="/configuracoes"
          element={
            <ProtectedUserRoute>
              <ConfiguracoesUsuario />
            </ProtectedUserRoute>
          }
        />

        {/* empresa*/}
        <Route
          path="/empresa/dashboard"
          element={
            <ProtectedCompanyRoute>
              <DashboardEmpresa />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="/empresa/editar-perfil"
          element={
            <ProtectedCompanyRoute>
              <EditarPerfilEmpresa />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="/empresa/doacoes"
          element={
            <ProtectedCompanyRoute>
              <DoacoesEmpresa />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="/empresa/denuncias"
          element={
            <ProtectedCompanyRoute>
              <DenunciasEmpresa />
            </ProtectedCompanyRoute>
          }
        />

        <Route
          path="/empresa/receber-doacoes"
          element={
            <ProtectedCompanyRoute>
              <ReceberDoacoes />
            </ProtectedCompanyRoute>
          }
        />

        <Route path="/empresa/pets" element={<DoacoesPetsEmpresa />} />

        <Route path="/empresa/perfil/:id" element={<PerfilPublicoEmpresa />} />
        <Route path="/empresa/conta-desativada" element={<ContaDesativadaEmpresa />} />

        <Route
          path="/empresa/configuracoes"
          element={
            <ProtectedCompanyRoute>
              <ConfiguracoesEmpresa />
            </ProtectedCompanyRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="container-nao-encontrado" style={{ textAlign: "center", paddingTop: "100px", fontSize: "2rem" }}>
              404 - Página não encontrada
              <p>
                <a href="/" style={{ color: "#27ae60", textDecoration: "underline" }}>
                  Voltar ao início
                </a>
              </p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}