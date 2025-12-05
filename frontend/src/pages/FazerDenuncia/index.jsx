import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NavbarUser from "../../components/NavbarUser";
import { toast } from "react-toastify";
import { salvarDenuncia } from "../../utils/storage";
import "./style.css";

export default function FazerDenuncia() {
  const location = useLocation();
  const empresaDoState = location.state?.empresa;
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

  useEffect(() => {
    if (empresaDoState?.id) {
      setEmpresaSelecionada(empresaDoState);
      localStorage.setItem("empresaAtivaParaDenuncia", JSON.stringify(empresaDoState));
    } else {
      const salva = localStorage.getItem("empresaAtivaParaDenuncia");
      if (salva) {
        const emp = JSON.parse(salva);
        setEmpresaSelecionada(emp);
      }
    }
  }, [empresaDoState]);

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    mensagem: "",
    endereco: "",
    bairro: "",
    cidade: "",
    estado: "",
    pontoReferencia: "",
    arquivo: null,
    termos: false,
  });

  const [arquivoNome, setArquivoNome] = useState("Nenhum arquivo escolhido");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, arquivo: files[0] });
      setArquivoNome(files[0] ? files[0].name : "Nenhum arquivo escolhido");
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!empresaSelecionada?.id) {
      return toast.error("Nenhuma empresa selecionada!");
    }

    const camposObrigatorios = [
      { campo: "nome", label: "Nome completo" },
      { campo: "telefone", label: "Telefone" },
      { campo: "mensagem", label: "Mensagem" },
      { campo: "endereco", label: "Endereço" },
      { campo: "bairro", label: "Bairro" },
      { campo: "cidade", label: "Cidade" },
      { campo: "estado", label: "Estado" },
    ];

    for (let item of camposObrigatorios) {
      if (!formData[item.campo].trim()) {
        return toast.error(`Preencha o campo: ${item.label}`);
      }
    }

    if (!formData.termos) {
      return toast.error("Você deve aceitar os termos para enviar a denúncia.");
    }

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const novaDenuncia = {
      id: Date.now(),
      data: new Date().toLocaleDateString("pt-BR"),
      mensagem: formData.mensagem || "Sem mensagem",
      foto: !!formData.arquivo,
      status: "nova",
      empresaId: String(empresaSelecionada.id),
      empresaNome: empresaSelecionada.companyName,
      detalhes: {
        nome: formData.nome || "Anônimo",
        telefone: formData.telefone || "Não informado",
        email: userData.email || "desconhecido",

        endereco: formData.endereco,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        pontoReferencia: formData.pontoReferencia || "Sem referência",
      },
    };

    salvarDenuncia(novaDenuncia);

    toast.success(`Denúncia enviada para ${empresaSelecionada.companyName}!`);

    setFormData({
      nome: "",
      telefone: "",
      mensagem: "",
      endereco: "",
      bairro: "",
      cidade: "",
      estado: "",
      pontoReferencia: "",
      arquivo: null,
      termos: false,
    });

    setArquivoNome("Nenhum arquivo escolhido");
  };

  return (
    <>
      <NavbarUser />

      <div className="complaint-container">
        <div className="complaint-card">
          <h1>Formulário de Denúncia de Maus-Tratos a Animais</h1>
          <p className="subtitle">
            Preencha os campos com o máximo de detalhes possível.<br />
            As informações serão tratadas como confidenciais.
          </p>

          {empresaSelecionada ? (
            <div className="empresa-ativa">
              Denúncia será enviada para:<br />
              <span className="empresa-nome">{empresaSelecionada.companyName}</span>
            </div>
          ) : (
            <div className="empresa-inativa">
              Nenhuma empresa ativada!<br />
              <span className="empresa-alerta">
                Vá em "Minhas Empresas" → clique em "Ativar para denúncias"
              </span>
            </div>
          )}

          <div className="section">
            <h2>Informações do Denunciante</h2>
            <div className="row">
              <input type="text" name="nome" placeholder="Nome completo" value={formData.nome} onChange={handleChange} />
              <input type="tel" name="telefone" placeholder="Telefone para contato" value={formData.telefone} onChange={handleChange} />
            </div>
            <textarea
              name="mensagem"
              placeholder="Mensagem (descreva o que está acontecendo)"
              rows="5"
              value={formData.mensagem}
              onChange={handleChange}
            />
          </div>

          <div className="section">
            <h2>Local da Ocorrência</h2>
            <div className="row">
              <input type="text" name="endereco" placeholder="Endereço completo" value={formData.endereco} onChange={handleChange} />
              <input type="text" name="bairro" placeholder="Bairro" value={formData.bairro} onChange={handleChange} />
            </div>
            <div className="row">
              <input type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} />
              <select name="estado" value={formData.estado} onChange={handleChange}>
                <option value="">Estado</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
            </div>

            <input
              type="text"
              name="pontoReferencia"
              placeholder="Ponto de referência"
              value={formData.pontoReferencia}
              onChange={handleChange}
              className="full-width"
            />
          </div>

          <div className="section">
            <h2>Evidências (se houver)</h2>
            <div className="file-upload">
              <label htmlFor="arquivo" id="file-label" className="file-label">Escolher arquivo</label>
              <input type="file" id="arquivo" accept="image/*,video/*" onChange={handleChange} />
              <span className="file-name">{arquivoNome}</span>
            </div>
          </div>

          <div className="section termos">
            <label className="checkbox-container">
              <input className="checkmark" type="checkbox" name="termos" checked={formData.termos} onChange={handleChange} />
              Declaro que as informações fornecidas são verdadeiras...
            </label>
          </div>

          <button
            type="submit"
            className={`submit-btn ${!empresaSelecionada ? "disabled" : ""}`}
            onClick={handleSubmit}
            disabled={!empresaSelecionada}
          >
            Enviar Denúncia
          </button>
        </div>
      </div>
    </>
  );
}
