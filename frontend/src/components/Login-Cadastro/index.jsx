import React, { useState } from "react";
import fundo from "../../assets/fundo.png";
import loginImg from "../../assets/login.png";
import registerImg from "../../assets/register.png";
import './style.css'

export default function LoginRegister() {
    const [isActive, setIsActive] = useState(false);

    return (
        <div
            className={`container ${isActive ? "active" : ""}`}
            style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >

            <div className="form-box login">
                <form onSubmit={(e) => e.preventDefault()}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required />
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" required />
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div className="forgot-link">
                        <a href="#">Esqueceu a senha?</a>
                    </div>
                    <button type="submit" className="btn">
                        Login
                    </button>
                    <p>Ou faça login com plataformas sociais</p>
                    <div className="social-icons">
                        <a href="#">
                            <i className="fa-brands fa-google"></i>
                        </a>
                        <a href="#">
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                    </div>
                </form>
            </div>

            <div className="form-box register">
                <form onSubmit={(e) => e.preventDefault()}>
                    <h1>Cadastre-se</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required />
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder="Email" required />
                        <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" required />
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <button type="submit" className="btn">
                        Cadastro
                    </button>
                    <p>Ou registre-se com plataformas sociais</p>
                    <div className="social-icons">
                        <a href="#">
                            <i className="fa-brands fa-google"></i>
                        </a>
                        <a href="#">
                            <i className="fa-brands fa-facebook-f"></i>
                        </a>
                    </div>
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
                className="toggle-bg"
                style={{
                    backgroundImage: `url(${isActive ? registerImg : loginImg})`,
                }}
            ></div>

        </div>

    );
}