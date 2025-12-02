import express from "express";
import multer from "multer";
import path from "path";
import PetDonation from "../models/PetDonation.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads/pets");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `pet-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

router.post("/pet", verifyToken, upload.single("foto"), async (req, res) => {
  try {
    console.log("req.file:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Arquivo de foto não enviado." });
    }

    const { companyId, nome, especie, idade, sexo, castrado, temperamento, local, mensagem, contato } = req.body;

    if (!companyId || !local || !contato) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }

    const fotoPath = `/uploads/pets/${req.file.filename}`;

    await PetDonation.create({
      foto: fotoPath,
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

    res.status(201).json({ message: "Animal encaminhado com sucesso! A ONG já foi notificada", fotoPath });
  } catch (err) {
    console.error("Erro ao salvar doação de pet:", err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

router.get("/pets/:companyId", verifyToken, async (req, res) => {
  try {
    const { companyId } = req.params;

    const pets = await PetDonation.findAll({
      where: { companyId },
      order: [["createdAt", "DESC"]],
    });

    res.json(pets);
  } catch (err) {
    console.error("Erro ao buscar pets:", err);
    res.status(500).json({ message: "Erro ao buscar pets" });
  }
});


export default router;
