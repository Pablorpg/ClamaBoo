import React, { useState } from "react";
import fundo from "../../assets/fundo.png";
import loginImg from "../../assets/login.png";
import registerImg from "../../assets/register.png";
import './style.css';
import { register, login, forgot, reset } from "../../services/auth";

export default function LoginRegister() {
  const [isActive, setIsActive] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ username: "", email: "", password: "" });

  const [emailForReset, setEmailForReset] = useState("");
  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showResetPanel, setShowResetPanel] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await register(regForm);
    if (res.token) {
      localStorage.setItem("token", res.token);
      alert("Registrado e logado!");
    } else {
      alert(res.message || "Erro no registro");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(loginForm);
    if (res.token) {
      localStorage.setItem("token", res.token);
      alert("Logado com sucesso!");
    } else {
      alert(res.message || "Credenciais inválidas");
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    const emailTrimmed = emailForReset?.trim();
    if (!emailTrimmed) return alert("Informe o e-mail para receber o código");

    const res = await forgot(emailTrimmed);
    console.log("Resposta forgot:", res);
    alert(res.message || "Verifique seu e-mail");

    if (res.message && !res.message.toLowerCase().includes("erro")) {
      setShowResetPanel(true);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const codeTrimmed = code?.trim();
    const newPassTrimmed = newPass?.trim();

    if (!codeTrimmed || !newPassTrimmed) return alert("Informe o código e a nova senha");

    const res = await reset({
      email: emailForReset?.trim(),
      code: codeTrimmed,
      newPassword: newPassTrimmed
    });
    console.log("Resposta reset:", res);
    alert(res.message || "Ocorreu um erro");

    if (res.message && res.message.toLowerCase().includes("sucesso")) {
      setShowResetPanel(false);
      setEmailForReset("");
      setCode("");
      setNewPass("");
    }
  };

  return (
    <div
      className={`container ${isActive ? "active" : ""}`}
      style={{ backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={loginForm.email}
              onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
            />
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={loginForm.password}
              onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
            />
            <i className="fa-solid fa-lock"></i>
          </div>
          <div className="forgot-link">
            <button
              type="button"
              onClick={() => setShowResetPanel(true)}
              style={{ background: "transparent", border: "none", color: "#333", cursor: "pointer" }}
            >
              Esqueceu a senha?
            </button>
          </div>
          <button type="submit" className="btn">Login</button>
         
        </form>
      </div>

      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>Cadastre-se</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              required
              value={regForm.username}
              onChange={e => setRegForm(prev => ({ ...prev, username: e.target.value }))}
            />
            <i className="fa-solid fa-user"></i>
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={regForm.email}
              onChange={e => setRegForm(prev => ({ ...prev, email: e.target.value }))}
            />
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={regForm.password}
              onChange={e => setRegForm(prev => ({ ...prev, password: e.target.value }))}
            />
            <i className="fa-solid fa-lock"></i>
          </div>
          <button type="submit" className="btn">Cadastro</button>
        </form>
      </div>

      <div className="toggle-box">
        <div className="toggle-panel toggle-left">
          <button type="button" className="btn register-btn" onClick={() => setIsActive(true)}>Cadastre-se</button>
        </div>
        <div className="toggle-panel toggle-right">
          <button type="button" className="btn login-btn" onClick={() => setIsActive(false)}>Login</button>
        </div>
      </div>

      <div className="toggle-bg" style={{ backgroundImage: `url(${isActive ? registerImg : loginImg})` }}></div>

      {showResetPanel && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: 10, width: 360 }}>
            <h3>Recuperar senha</h3>
            <p>1) Informe seu e-mail e clique em "Enviar código"</p>
            <input
              value={emailForReset}
              onChange={e => setEmailForReset(e.target.value)}
              placeholder="Seu email"
              style={{ width: "100%", padding: 8, marginBottom: 8 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleForgot} style={{ flex: 1 }} className="btn">Enviar código</button>
              <button onClick={() => { setShowResetPanel(false); setCode(""); setEmailForReset(""); setNewPass(""); }} style={{ flex: 1 }} className="btn">Fechar</button>
            </div>

            <hr style={{ margin: "12px 0" }} />

            <p>2) Digite o código recebido e a nova senha</p>
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Código"
              style={{ width: "100%", padding: 8, marginBottom: 8 }}
            />
            <input
              type="password"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              placeholder="Nova senha"
              style={{ width: "100%", padding: 8, marginBottom: 8 }}
            />
            <button onClick={handleReset} className="btn" style={{ width: "100%" }}>Redefinir senha</button>
          </div>
        </div>
      )}
    </div>
  );
}
