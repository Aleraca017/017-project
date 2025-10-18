// app/api/update-email/route.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";

// inicializa apenas se ainda não tiver sido inicializado
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
    });
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { idToken, newEmail } = body;

        if (!idToken || !newEmail) {
            return NextResponse.json({ error: "idToken e newEmail são obrigatórios" }, { status: 400 });
        }

        // verifica idToken enviado pelo cliente
        const decoded = await admin.auth().verifyIdToken(idToken);
        const uid = decoded.uid;

        // atualiza email do usuário via Admin
        await admin.auth().updateUser(uid, { email: newEmail, emailVerified: false });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("update-email error:", err);
        return NextResponse.json({ error: err.message || "Erro interno" }, { status: 500 });
    }
}
