import React, { useState } from "react";
import loginImg from "../../assets/login.png";
import registerImg from "../../assets/register.png";
import "./style.css";
import { register, login, forgot, reset } from "../../services/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginRegister() {
  const [isActive, setIsActive] = useState(false);
  const [isCompany, setIsCompany] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const [regForm, setRegForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    responsibleName: "",
    email: "",
    password: "",
    phone: "",
    area: "",
    cnpj: "",
  });

  const [emailForReset, setEmailForReset] = useState("");
  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showResetPanel, setShowResetPanel] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await register(regForm);

    if (res.token) {
      localStorage.setItem("token", res.token);
      toast.success("Registrado com sucesso!");
      setTimeout(() => (window.location.href = "/home"), 1500);
    } else {
      toast.error(res.message || "Erro ao registrar usuário");
    }
  };

  const handleRegisterCompany = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/company/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...companyForm,
        categories: [companyForm.area],
      }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      toast.success("Empresa cadastrada com sucesso!");
      setTimeout(() => (window.location.href = "/home"), 1500);
    } else {
      toast.error(data.message || "Erro ao registrar empresa");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(loginForm);

    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("userEmail", loginForm.email);
      toast.success("Logado com sucesso!");
      setTimeout(() => (window.location.href = "/home"), 1500);
    } else {
      toast.error(res.message || "Credenciais inválidas");
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!emailForReset.trim()) return toast.warn("Informe o e-mail");

    const res = await forgot(emailForReset.trim());
    if (res.message && !res.message.toLowerCase().includes("erro")) {
      toast.info("Código enviado ao e-mail.");
      setShowResetPanel(true);
    } else {
      toast.error(res.message || "Erro ao enviar código");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!code.trim() || !newPass.trim())
      return toast.warn("Preencha todos os campos");

    const res = await reset({
      email: emailForReset.trim(),
      code: code.trim(),
      newPassword: newPass.trim(),
    });

    if (res.message?.toLowerCase().includes("sucesso")) {
      toast.success("Senha redefinida!");
      setShowResetPanel(false);
      setEmailForReset("");
      setCode("");
      setNewPass("");
    } else {
      toast.error(res.message || "Código inválido");
    }
  };

  return (
    <div className={`container ${isActive ? "active" : ""}`}>

      {/* LOGIN */}
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <i className="fa-solid fa-user"></i>
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Senha"
              required
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <i className="fa-solid fa-lock"></i>
          </div>

          <button type="submit" className="btn">Login</button>

          <button type="button" className="btn-forgot" onClick={() => setShowResetPanel(true)}>
            Esqueceu a senha?
          </button>
        </form>
      </div>

      {/* CADASTRO */}
      <div className="form-box register">
        <form onSubmit={isCompany ? handleRegisterCompany : handleRegister}>
          <h1>Cadastre-se</h1>

          <div className="toggle-register-type">
            <button type="button" className={!isCompany ? "active" : ""} onClick={() => setIsCompany(false)}>
              Usuário
            </button>
            <button type="button" className={isCompany ? "active" : ""} onClick={() => setIsCompany(true)}>
              Empresa
            </button>
          </div>

          {/* Usuário */}
          {!isCompany && (
            <>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Nome de usuário"
                  required
                  value={regForm.username}
                  onChange={(e) =>
                    setRegForm((prev) => ({ ...prev, username: e.target.value }))
                  }
                />
                <i className="fa-solid fa-user"></i>
              </div>

              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={regForm.email}
                  onChange={(e) =>
                    setRegForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                <i className="fa-solid fa-envelope"></i>
              </div>

              <div className="input-box">
                <input
                  type="password"
                  placeholder="Senha"
                  required
                  value={regForm.password}
                  onChange={(e) =>
                    setRegForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
                <i className="fa-solid fa-lock"></i>
              </div>
            </>
          )}

          {/* Empresa */}
          {isCompany && (
            <>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Nome da Empresa"
                  required
                  value={companyForm.companyName}
                  onChange={(e) =>
                    setCompanyForm((prev) => ({ ...prev, companyName: e.target.value }))
                  }
                />
                <i className="fa-solid fa-building"></i>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  placeholder="Nome do responsável"
                  required
                  value={companyForm.responsibleName}
                  onChange={(e) =>
                    setCompanyForm((prev) => ({ ...prev, responsibleName: e.target.value }))
                  }
                />
                <i className="fa-solid fa-user"></i>
              </div>

              <div className="input-box">
                <input
                  type="email"
                  placeholder="Email Corporativo"
                  required
                  value={companyForm.email}
                  onChange={(e) =>
                    setCompanyForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                <i className="fa-solid fa-envelope"></i>
              </div>

              <div className="input-box">
                <input
                  type="text"
                  placeholder="Telefone"
                  required
                  value={companyForm.phone}
                  onChange={(e) =>
                    setCompanyForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
                <i className="fa-solid fa-phone"></i>
              </div>

              <div className="input-box">
                <input
                  type="password"
                  placeholder="Senha"
                  required
                  value={companyForm.password}
                  onChange={(e) =>
                    setCompanyForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
                <i className="fa-solid fa-lock"></i>
              </div>

              <select
                className="input-box select"
                required
                value={companyForm.area}
                onChange={(e) =>
                  setCompanyForm((prev) => ({ ...prev, area: e.target.value }))
                }
              >
                <option value="">Área de atuação</option>
                <option value="Resgate de animais">Resgate de animais</option>
                <option value="Adoção e cuidados">Adoção e cuidados</option>
                <option value="Tratamento veterinário">Tratamento veterinário</option>
                <option value="Fiscalização / Denúncias">Fiscalização / Denúncias</option>
              </select>

              <div className="input-box">
                <input
                  type="text"
                  placeholder="CNPJ"
                  value={companyForm.cnpj}
                  onChange={(e) =>
                    setCompanyForm((prev) => ({ ...prev, cnpj: e.target.value }))
                  }
                />
                <i className="fa-solid fa-id-card"></i>
              </div>
            </>
          )}

          <button type="submit" className="btn">Cadastrar</button>
        </form>
      </div>

      {/* Botões de Toggle */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <button type="button" className="btn register-btn" onClick={() => setIsActive(true)}>
            Cadastre-se
          </button>
        </div>
        <div className="toggle-panel toggle-right">
          <button type="button" className="btn login-btn" onClick={() => setIsActive(false)}>
            Login
          </button>
        </div>
      </div>

      {/* IMAGEM */}
      <div
        className={`toggle-bg ${isActive ? "bg-register" : "bg-login"}`}
        style={{ backgroundImage: `url(${isActive ? registerImg : loginImg})` }}
      ></div>

      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
}
