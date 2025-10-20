import admin from "firebase-admin";

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
    const { email, nome, funcao, permissao, img, pix } = await req.json();
    const defaultPassword = "017Tag.2025@";

    const db = admin.firestore();

    // 🔢 Busca o maior ID atual
    const snapshot = await db
      .collection("usuarios")
      .orderBy("id", "desc")
      .limit(1)
      .get();

    let nextId = 1;
    if (!snapshot.empty) {
      const lastUser = snapshot.docs[0].data();
      // 👇 força conversão para número antes de somar
      const lastId = parseInt(lastUser.id) || 0;
      nextId = lastId + 1;
    }

    // 👤 Cria o usuário no Auth
    const userRecord = await admin.auth().createUser({
      email,
      password: defaultPassword,
      displayName: nome,
    });

    // 🗂️ Adiciona os dados no Firestore
    await db.collection("usuarios").doc(userRecord.uid).set({
      id: nextId,
      nome,
      img,
      email,
      funcao,
      permissao,
      pix,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        uid: userRecord.uid,
        password: defaultPassword,
        id: nextId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
