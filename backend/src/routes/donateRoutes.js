import express from "express";
import multer from "multer";
import path from "path";
import PetDonation from "../models/PetDonation.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/pets/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `pet-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

router.post("/pet", verifyToken, upload.single("foto"), async (req, res) => {
  try {
    const { companyId, nome, especie, idade, sexo, castrado, temperamento, local, mensagem, contato } = req.body;

    if (!companyId || !local || !contato) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }

    await PetDonation.create({
      foto: `/uploads/pets/${req.file.filename}`,
      nome: nome || "Sem nome",
      especie,
      idade,
      sexo,
      castrado,
      temperamento,
      local,
      mensagem,
      contato,
      companyId,
      userId: req.userId,
      status: "pendente"
    });

    res.status(201).json({ message: "Animal encaminhado com sucesso! A ONG já foi notificada" });
  } catch (err) {
    console.error("Erro ao salvar doação de pet:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

export default router;