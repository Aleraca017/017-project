import { NextResponse } from "next/server";
import { doc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { dbSolicitacoes } from "@/lib/firebase-solicitacoes";
import { db } from "@/lib/firebase";
import nodemailer from "nodemailer";

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("📩 Dados recebidos na rota /concluir:", body);

        const { id, atendidoPorEmail, atendidoPorNome } = body;

        // 🔹 Fallback se o email vier vazio
        if (!id) {
            return NextResponse.json({ success: false, error: "ID da solicitação não informado." });
        }
        if (!atendidoPorEmail) {
            console.error("❌ Campo atendidoPorEmail está indefinido!");
            return NextResponse.json({ success: false, error: "E-mail do atendente não informado." });
        }

        // 🔹 Atualiza status e registra conclusão
        const solRef = doc(dbSolicitacoes, "chamados", id);
        await updateDoc(solRef, {
            status: "concluido",
            concluidoEm: serverTimestamp(),
            concluidoPor: atendidoPorNome || atendidoPorEmail,
            concluidoPorEmail: atendidoPorEmail,
        });

        // 🔹 Cria documento no financeiro
        await addDoc(collection(db, "financeiro"), {
            solicitacaoId: id,
            concluidoPor: atendidoPorNome || atendidoPorEmail,
            emailConcluinte: atendidoPorEmail,
            criadoEm: serverTimestamp(),
        });

        // 🔹 Configura transporte do e-mail
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // 🔹 Garante que o e-mail não será vazio
        const destinatario = atendidoPorEmail?.trim();
        if (!destinatario) throw new Error("Destinatário do e-mail indefinido.");

        const mailOptions = {
            from: `"Suporte 017Tag" <${process.env.SMTP_USER}>`,
            to: destinatario,
            subject: "Registro de atendimento concluído",
            html: `
        <p>Olá ${atendidoPorNome || ""},</p>
        <p>Registre seu atendimento pelo forum (Suporte > Forum de tratativas) para ser efetuado o pagamento.</p>
        <p><strong>ID da solicitação:</strong> ${id}</p>
        <hr />
        <p style="font-size:12px;color:#777;">Mensagem automática - não responda este e-mail.</p>
      `,
        };

        console.log("📤 Enviando e-mail para:", destinatario);
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Erro ao concluir solicitação:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Erro interno ao concluir solicitação.",
        });
    }
}
