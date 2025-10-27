import React, { useState } from "react";
import loginImg from "../../assets/login.png";
import registerImg from "../../assets/register.png";
import "./style.css";
import { register, login, forgot, reset } from "../../services/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginRegister() {
  const [isActive, setIsActive] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({
    username: "",
    email: "",
    password: "",
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
      toast.success("Registrado e logado com sucesso!");
      setTimeout(() => (window.location.href = "/home"), 1500);
    } else {
      toast.error(res.message || "Erro no registro");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(loginForm);

    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("userEmail", loginForm.email);
      toast.success("Logado com sucesso! Redirecionando...");
      setTimeout(() => (window.location.href = "/home"), 1500);
    } else {
      toast.error(res.message || "Credenciais inválidas");
    }
  };

 
  const handleForgot = async (e) => {
    e.preventDefault();
    const emailTrimmed = emailForReset?.trim();
    if (!emailTrimmed) {
      toast.warn("Informe o e-mail para receber o código");
      return;
    }

    const res = await forgot(emailTrimmed);
    console.log("Resposta forgot:", res);

    if (res.message && !res.message.toLowerCase().includes("erro")) {
      toast.info("Código enviado! Verifique seu e-mail.");
      setShowResetPanel(true);
    } else {
      toast.error(res.message || "Erro ao enviar código");
    }
  };

  // REDEFINIR SENHA
  const handleReset = async (e) => {
    e.preventDefault();
    const codeTrimmed = code?.trim();
    const newPassTrimmed = newPass?.trim();

    if (!codeTrimmed || !newPassTrimmed) {
      toast.warn("Informe o código e a nova senha");
      return;
    }

    const res = await reset({
      email: emailForReset?.trim(),
      code: codeTrimmed,
      newPassword: newPassTrimmed,
    });

    console.log("Resposta reset:", res);

    if (res.message && res.message.toLowerCase().includes("sucesso")) {
      toast.success("Senha redefinida com sucesso!");
      setShowResetPanel(false);
      setEmailForReset("");
      setCode("");
      setNewPass("");
    } else {
      toast.error(res.message || "Código inválido ou expirado");
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

          <div className="forgot-link">
            <button
              type="button"
              onClick={() => setShowResetPanel(true)}
              className="btn-forgot"
            >
              Esqueceu a senha?
            </button>
          </div>

          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>

      {/* CADASTRO */}
      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>Cadastre-se</h1>
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

          <button type="submit" className="btn">
            Cadastrar
          </button>
        </form>
      </div>

      {/* ALTERNAR ENTRE LOGIN E CADASTRO */}
      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <button
            type="button"
            className="btn register-btn"
            onClick={() => setIsActive(true)}
          >
            Cadastre-se
          </button>
        </div>
        <div className="toggle-panel toggle-right">
          <button
            type="button"
            className="btn login-btn"
            onClick={() => setIsActive(false)}
          >
            Login
          </button>
        </div>
      </div>

      {/* IMAGEM DE FUNDO */}
      <div
        className={`toggle-bg ${isActive ? "bg-register" : "bg-login"}`}
        style={{ backgroundImage: `url(${isActive ? registerImg : loginImg})` }}
      ></div>

      {/* PAINEL DE REDEFINIÇÃO */}
      {showResetPanel && (
        <div className="reset-overlay">
          <div className="reset-box">
            <h3>Recuperar senha</h3>
            <p>1) Informe seu e-mail e clique em "Enviar código"</p>
            <input
              value={emailForReset}
              onChange={(e) => setEmailForReset(e.target.value)}
              placeholder="Seu email"
              className="reset-input"
            />
            <div className="reset-btn-group">
              <button onClick={handleForgot} className="btn flex-1">
                Enviar código
              </button>
              <button
                onClick={() => {
                  setShowResetPanel(false);
                  setCode("");
                  setEmailForReset("");
                  setNewPass("");
                }}
                className="btn flex-1"
              >
                Fechar
              </button>
            </div>

            <hr className="reset-divider" />

            <p>2) Digite o código recebido e a nova senha</p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Código"
              className="reset-input"
            />
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Nova senha"
              className="reset-input"
            />
            <button onClick={handleReset} className="btn full">
              Redefinir senha
            </button>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}
