import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req) {
  try {
    const { email, nome, funcao, permissao } = await req.json();
    const defaultPassword = "017tag.2025@";

    // Cria o usuário no Auth
    const userRecord = await admin.auth().createUser({
      email,
      password: defaultPassword,
      displayName: nome,
    });

    // Adiciona os dados no Firestore
    const db = admin.firestore();
    await db.collection("usuarios").doc(userRecord.uid).set({
      nome,
      email,
      funcao,
      permissao,
    });

    return new Response(JSON.stringify({ success: true, uid: userRecord.uid, password: defaultPassword }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
