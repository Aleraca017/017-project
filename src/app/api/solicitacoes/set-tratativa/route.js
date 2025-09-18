import { NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { dbSolicitacoes } from "@/lib/firebase-solicitacoes";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Body recebido:", body);

    const { id, novoStatus, status, emailAutor, cancelReason } = body;
    const finalStatus = novoStatus || status;

    if (!id || !finalStatus) {
      return NextResponse.json(
        { success: false, error: "ID ou status não informado" },
        { status: 400 }
      );
    }

    // Atualiza status e motivo no Firestore
    const updateData = { status: finalStatus };
    if (finalStatus === "cancelado") {
      updateData.cancelReason = cancelReason || "";
    }
    const ref = doc(dbSolicitacoes, "chamados", id);
    await updateDoc(ref, updateData);

    // Envia e-mail
    if (emailAutor) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      let assunto = "";
      let mensagem = `Olá,\n\nSua solicitação (${id}) foi atualizada para o status: ${finalStatus}.`;

      if (finalStatus === "em tratativa") {
        assunto = "Sua solicitação está em tratativa";
      } else if (finalStatus === "concluido") {
        assunto = "Sua solicitação foi concluída";
      } else if (finalStatus === "cancelado") {
        assunto = "Sua solicitação foi cancelada";
        mensagem += `\n\nMotivo do cancelamento: ${cancelReason && cancelReason.trim() !== ""
            ? cancelReason
            : "Não informado"
          }`;
      }

      mensagem += `\n\nAtenciosamente,\nEquipe de Suporte 017Tag.`;

      console.log("Assunto:", assunto);
      console.log("Mensagem final:", mensagem);

      if (assunto) {
        await transporter.sendMail({
          from: `"Suporte" <${process.env.SMTP_USER}>`,
          to: emailAutor,
          subject: assunto,
          text: mensagem,
          html: `<p>${mensagem.replace(/\n/g, "<br>")}</p>`,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
