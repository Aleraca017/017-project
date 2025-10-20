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
    const { uid, nome, email, funcao, permissao, img, pix } = body;

    if (!uid || typeof uid !== "string" || uid.length > 128) {
      return NextResponse.json({ error: "UID inválido." }, { status: 400 });
    }

    // 🔹 Atualiza email no Firebase Auth, se fornecido
    if (email) {
      await auth.updateUser(uid, { email });
    }

    // 🔹 Atualiza dados no Firestore
    const userRef = db.collection("usuarios").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    await userRef.update({
      nome: nome || "",
      img: img || "",
      email: email || "",
      pix: pix || "",
      funcao: funcao || "",
      permissao: permissao || "leitor",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ message: "Usuário atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err);
    return NextResponse.json(
      { error: err.message || "Erro desconhecido." },
      { status: 500 }
    );
  }
}
