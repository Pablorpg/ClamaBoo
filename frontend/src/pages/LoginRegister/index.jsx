import React, { useState } from "react";
import loginImg from "../../assets/login.png";
import registerImg from "../../assets/register.png";
import "./style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register, login, forgot, reset, registerCompany, loginCompany } from "../../services/auth";

export async function forgotCompany(email) {
  const res = await fetch("http://localhost:5000/api/company/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  return res.json();
}

export async function resetCompany(data) {
  const res = await fetch("http://localhost:5000/api/company/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}


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
    categories: "",
    cnpj: "",
  });

  const [emailForReset, setEmailForReset] = useState("");
  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showResetPanel, setShowResetPanel] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password } = regForm;

    try {
      const res = await register({ username, email, password });
      toast.success(res.message);
      setTimeout(() => (window.location.href = "/"), 1500);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRegisterCompany = async (e) => {
    e.preventDefault();

    const { companyName, responsibleName, email, password, phone, categories, cnpj } = companyForm;

    if (
      !companyName.trim() ||
      !responsibleName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !phone.trim() ||
      !categories.trim()
    ) {
      return toast.error("Preencha todos os campos obrigatórios!");
    }

    const body = {
      companyName: companyName.trim(),
      responsibleName: responsibleName.trim(),
      email: email.trim(),
      password: password.trim(),
      phone: phone.trim(),
      categories: [categories.trim()],
    };

    if (cnpj && cnpj.trim()) body.cnpj = cnpj.trim();

    try {
      const res = await registerCompany(body);

      if (res?.message && !res.message.toLowerCase().includes("sucesso")) {
        return toast.error(res.message);
      }

      toast.success("Empresa cadastrada com sucesso! 🎉");

      setCompanyForm({
        companyName: "",
        responsibleName: "",
        email: "",
        password: "",
        phone: "",
        categories: "",
        cnpj: "",
      });

      setTimeout(() => setIsActive(false), 1500);

    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar empresa. Tente novamente. Ou esse e-mail já está em uso.");
    }
  };


  const handleLoginCompany = async (e) => {
    e.preventDefault();
    const { email, password } = loginForm;

    if (!email?.trim() || !password?.trim()) {
      return toast.error("Preencha email e senha!");
    }

    try {
      const res = await loginCompany({ email: email.trim(), password: password.trim() });

      if (res.token && res.type === "company") {
        localStorage.setItem("companyToken", res.token);
        toast.success("Empresa logada com sucesso!");
        setTimeout(() => (window.location.href = "/empresa"), 1500);
      } else {
        toast.error(res.message || "Credenciais inválidas");
      }

    } catch (err) {
      console.error("Erro no login da empresa:", err);
      toast.error("Erro ao fazer login da empresa. Tente novamente.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginForm;

    if (!email.trim() || !password.trim()) {
      return toast.error("Preencha email e senha!");
    }

    try {
      const res = await login({ email: email.trim(), password: password.trim() });
      if (res.message?.toLowerCase().includes("sucesso")) {
        toast.success(res.message);
        setTimeout(() => (window.location.href = "/usuario/HomeUser"), 1500);
      } else {
        toast.error(res.message || "Credenciais inválidas");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleForgot = async () => {
    if (!emailForReset.trim()) return toast.warn("Informe o e-mail");

    const res = isCompany
      ? await forgotCompany(emailForReset.trim())
      : await forgot(emailForReset.trim());

    if (res.message?.toLowerCase().includes("enviado")) {
      toast.info("Código enviado ao e-mail.");
      setShowResetPanel(true);
    } else {
      toast.error(res.message);
    }
  };

  const handleReset = async () => {
    if (!code.trim() || !newPass.trim()) return toast.warn("Preencha todos os campos");

    const res = isCompany
      ? await resetCompany({ email: emailForReset.trim(), code, newPassword: newPass })
      : await reset({ email: emailForReset.trim(), code, newPassword: newPass });

    if (res.message?.toLowerCase().includes("sucesso")) {
      toast.success("Senha redefinida!");
      setShowResetPanel(false);
    } else {
      toast.error(res.message);
    }
  };


  return (
    <div className={`container ${isActive ? "active" : ""}`}>

      {/* LOGIN */}
      <div className="form-box login">
        <form onSubmit={isCompany ? handleLoginCompany : handleLogin}>
          <h1>Login</h1>

          <div className="toggle-register-type">
            <button
              type="button"
              id="btnUser"
              className={!isCompany ? "selected" : ""}
              onClick={() => setIsCompany(false)}
            >
              Usuário
            </button>

            <button
              type="button"
              id="btnCompany"
              className={isCompany ? "selected" : ""}
              onClick={() => setIsCompany(true)}
            >
              Empresa
            </button>
          </div>


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
            <button
              type="button"
              id="btnUser"
              className={!isCompany ? "selected" : ""}
              onClick={() => setIsCompany(false)}
            >
              Login Usuário
            </button>

            <button
              type="button"
              id="btnCompany"
              className={isCompany ? "selected" : ""}
              onClick={() => setIsCompany(true)}
            >
              Login Empresa
            </button>
          </div>

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
                id="select"
                className="input-box select"
                required
                value={companyForm.categories}
                onChange={(e) =>
                  setCompanyForm((prev) => ({ ...prev, categories: e.target.value }))
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

      <div
        className={`toggle-bg ${isActive ? "bg-register" : "bg-login"}`}
        style={{ backgroundImage: `url(${isActive ? registerImg : loginImg})` }}
      ></div>

      {/*RECUPERAÇÃO DE SENHA*/}
      {showResetPanel && (
        <div className="reset-overlay">
          <div className="reset-modal">
            <h2>Recuperar senha - {isCompany ? "Empresa" : "Usuário"}</h2>

            <label>Email</label>
            <input
              value={emailForReset}
              onChange={(e) => setEmailForReset(e.target.value)}
              placeholder="Seu e-mail"
            />

            <button className="btn" onClick={handleForgot}>Enviar código</button>

            <div className="divider"></div>

            <label>Código recebido</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Código"
            />

            <label>Nova senha</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Nova senha"
            />

            <button className="btn" onClick={handleReset}>Redefinir</button>

            <button
              className="btn-close"
              onClick={() => {
                setShowResetPanel(false);
                setCode("");
                setEmailForReset("");
                setNewPass("");
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </div>
  );
}
