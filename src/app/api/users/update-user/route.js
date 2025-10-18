// src/app/api/users/update-user/route.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";

// 🔹 Inicializa Firebase Admin apenas se ainda não estiver inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();
const auth = admin.auth();

export async function POST(req) {
  try {
    const body = await req.json();
    const { uid, docId, nome, email, funcao, permissao, foto } = body;

    if (!uid || typeof uid !== "string" || uid.length > 128) {
      return NextResponse.json({ error: "UID inválido." }, { status: 400 });
    }

    if (!docId || typeof docId !== "string") {
      return NextResponse.json({ error: "docId inválido." }, { status: 400 });
    }

    // 🔹 Atualiza email no Firebase Auth
    if (email) {
      await auth.updateUser(uid, { email });
    }

    // 🔹 Atualiza dados no Firestore
    const userRef = db.collection("usuarios").doc(docId);
    await userRef.update({
      nome: nome || "",
      img: foto || "",
      email: email || "",
      funcao: funcao || "",
      permissao: permissao || "leitor",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: "Usuário atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    return NextResponse.json({ error: err.message || "Erro desconhecido." }, { status: 500 });
  }
}
