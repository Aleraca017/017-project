import { NextResponse } from "next/server";
import { doc, updateDoc } from "firebase/firestore";
import { dbSolicitacoes } from "@/lib/firebase-solicitacoes";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { id, novoStatus, emailAutor, cancelReason, atendidoPorUid, atendidoPorEmail, atendidoPorNome } = await req.json();
    console.log("Dados recebidos da requisição:", {
      id,
      novoStatus,
      emailAutor,
      cancelReason,
      atendidoPorUid,
      atendidoPorEmail,
      atendidoPorNome,
    });

    if (!id || !novoStatus) {
      return NextResponse.json(
        { success: false, error: "ID ou status ausente" },
        { status: 400 }
      );
    }

    const updateData = { status: novoStatus };
    if (novoStatus === "cancelado") {
      updateData.cancelReason = cancelReason || "";
    }

    // 🔹 Se for "em tratativa", define quem atendeu
    if (novoStatus === "em tratativa" && atendidoPorUid) {
      updateData.atendidoPorUid = atendidoPorUid;
      updateData.atendidoPorEmail = atendidoPorEmail || null;
      updateData.atendidoPorNome = atendidoPorNome || null;
    }

    // Atualiza Firestore
    await updateDoc(doc(dbSolicitacoes, "chamados", id), updateData);

    // 🔹 Envia e-mail
    if (emailAutor) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      let assunto = "";
      let mensagem = `Olá,\n\nSua solicitação de ID: ${id} foi atualizada para o status: "${novoStatus}".`;

      // Personaliza o assunto e mensagem de acordo com o status
      if (novoStatus === "em tratativa" && atendidoPorEmail) {
        assunto = "Sua solicitação está em tratativa";
        mensagem += `\n\nNosso atendente ${atendidoPorNome} (${atendidoPorEmail}) está analisando sua solicitação e entrará em contato em breve.`;
      } else if (novoStatus === "concluido") {
        assunto = "Sua solicitação foi concluída";
        mensagem += `\n\nO atendimento foi concluído com sucesso. Caso tenha dúvidas ou precise de mais informações, responda este e-mail.`;
      } else if (novoStatus === "cancelado") {
        assunto = "Sua solicitação foi cancelada";
        mensagem += `\n\nMotivo do cancelamento: ${cancelReason?.trim() ? cancelReason : "Não informado"}`;
        mensagem += `\n\nSe desejar, você pode abrir uma nova solicitação ou entrar em contato com nosso suporte.`;
      }

      // Finaliza a mensagem com assinatura
      mensagem += `\n\nAtenciosamente,\n${atendidoPorNome || "Equipe de Suporte"} | 017Tag.`;


      await transporter.sendMail({
        from: `"Suporte 017Tag" <${process.env.SMTP_USER}>`,
        to: emailAutor,
        subject: assunto,
        text: mensagem,
        html: `<p>${mensagem.replace(/\n/g, "<br>")}</p>`,
      });
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
