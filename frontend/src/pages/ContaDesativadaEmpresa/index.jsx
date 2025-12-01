import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./style.css";

export default function ContaDesativadaEmpresa() {
  const navigate = useNavigate();
  const [tempo, setTempo] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("companyToken");
    if (!token) {
      navigate("/empresa/login");
      return;
    }

    const carregarStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/company/profile/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 410) {
          localStorage.clear();
          toast.error("Sua conta foi excluída permanentemente");
          navigate("/empresa/login");
          return;
        }

        const data = await res.json();

        if (!data.company?.deletionScheduledAt) {
          navigate("/empresa/dashboard", { replace: true });
          return;
        }

        const fim = new Date(data.company.deletionScheduledAt);
        fim.setHours(fim.getHours() + 24);

        const timer = setInterval(() => {
          const agora = new Date();
          const diff = fim - agora;

          if (diff <= 0) {
            setTempo("Excluindo agora…");
            setTimeout(() => {
              localStorage.clear();
              navigate("/empresa/login");
              toast.error("Sua conta foi excluída permanentemente");
            }, 3000);
          } else {
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            setTempo(`${h}h ${m}min ${s}s`);
          }
        }, 1000);

        return () => clearInterval(timer);
      } catch (err) {
        toast.error("Erro ao verificar status da conta");
        navigate("/empresa/login");
      }
    };

    carregarStatus();
  }, [navigate]);

  const cancelarExclusao = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/company/cancel-deletion", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("companyToken")}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        const erro = await res.json();
        throw new Error(erro.message || "Erro ao cancelar");
      }

      toast.success("Exclusão cancelada! Bem-vindo de volta");
      navigate("/empresa/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.message || "Erro ao cancelar exclusão");
    }
  };

  return (
    <>
      <div className="desativada-container">
        <div className="desativada-card">
          <h1>Sua conta está desativada</h1>
          <p>
            Você solicitou a exclusão da sua conta. Ela será excluída permanentemente em:
          </p>
          <div className="timer">{tempo || "Carregando…"}</div>

          <div className="botoes">
            <button className="btn-cancelar" onClick={cancelarExclusao}>
              Cancelar exclusão / Reativar conta
            </button>

            <button
              className="btn-sair"
              onClick={() => {
                localStorage.clear();
                navigate("/Inicio");
              }}
            >
              Voltar ao login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}