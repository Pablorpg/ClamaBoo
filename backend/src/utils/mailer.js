import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function sendResetEmail(to, code) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Clamaboo" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Código de recuperação de senha",
      html: `
        <p>Você solicitou a redefinição de senha.</p>
        <p>Use este código para redefinir sua senha:</p>
        <h2>${code}</h2>
        <p>Se você não solicitou, ignore este e-mail.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Código de redefinição enviado para ${to}`);
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err.message);
    throw new Error("Não foi possível enviar o e-mail de redefinição.");
  }
}
