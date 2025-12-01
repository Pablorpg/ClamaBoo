import { useState } from "react";
import { toast } from "react-toastify";
import NavbarUser from "../../components/NavbarUser";
import "./DoarPet.css";

export default function DoarPet() {
  const [form, setForm] = useState({
    nome: "",
    especie: "Cachorro",
    idade: "",
    sexo: "Macho",
    castrado: "Não sei",
    temperamento: "",
    local: "",
    mensagem: "",
    contato: "",
    foto: null,
  });

  const [loading, setLoading] = useState(false);

  const empresaAtiva = JSON.parse(localStorage.getItem("empresaAtivaParaDenuncia") || "{}");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.foto) return toast.error("A foto do animal é obrigatória!");

    setLoading(true);
    const data = new FormData();
    data.append("foto", form.foto);
    data.append("companyId", empresaAtiva.id);
    Object.keys(form).forEach(key => {
      if (key !== "foto") data.append(key, form[key]);
    });

    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch("http://localhost:5000/api/donate/pet", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (res.ok) {
        toast.success("Pet encaminhado com sucesso! A ONG já foi notificada.");
        setForm({ ...form, nome: "", idade: "", temperamento: "", local: "", mensagem: "", contato: "", foto: null });
        document.getElementById("foto").value = "";
      } else {
        toast.error("Erro ao enviar. Tente novamente.");
      }
    } catch (err) {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarUser />
      <div className="doar-pet-container">
        <h1>Encaminhar Animal para {empresaAtiva.companyName}</h1>
        <p className="subtitle">Preencha os dados do bichinho que você encontrou</p>

        <form onSubmit={handleSubmit} className="doar-pet-form">
          <div className="foto-preview" onClick={() => document.getElementById("foto").click()}>
            {form.foto ? (
              <img src={URL.createObjectURL(form.foto)} alt="Preview" />
            ) : (
              <div className="placeholder">Clique para adicionar foto</div>
            )}
            <input
              type="file"
              id="foto"
              name="foto"
              accept="image/*"
              onChange={(e) => setForm({ ...form, foto: e.target.files[0] })}
            />
          </div>



          <input placeholder="Nome (ou 'sem nome')" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />

          <select value={form.especie} onChange={(e) => setForm({ ...form, especie: e.target.value })}>
            <option>Cachorro</option><option>Gato</option><option>Outro</option>
          </select>

          <input placeholder="Idade aproximada (ex: 2 anos)" value={form.idade} onChange={(e) => setForm({ ...form, idade: e.target.value })} />

          <select value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })}>
            <option>Macho</option><option>Fêmea</option><option>Não sei</option>
          </select>

          <select value={form.castrado} onChange={(e) => setForm({ ...form, castrado: e.target.value })}>
            <option>Não sei</option><option>Sim</option><option>Não</option>
          </select>

          <input placeholder="Temperamento (dócil, medroso, brincalhão...)" value={form.temperamento} onChange={(e) => setForm({ ...form, temperamento: e.target.value })} />

          <input placeholder="Local encontrado (cidade/bairro)" required value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} />

          <textarea placeholder="Mensagem adicional (ex: está machucado, precisa de banho...)" value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} />

          <input placeholder="Seu WhatsApp ou telefone (pra ONG te contactar)" required value={form.contato} onChange={(e) => setForm({ ...form, contato: e.target.value })} />

          <button type="submit" disabled={loading} className="btn-doar-pet">
            {loading ? "Enviando..." : "ENCAMINHAR ANIMAL PARA RESGATE"}
          </button>
        </form>
      </div>
    </>
  );
}