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
    const { uid } = await req.json();

    // Validação do UID
    if (!uid || typeof uid !== "string" || uid.length > 128) {
      return new Response(
        JSON.stringify({ error: "UID inválido" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Deleta do Auth
    try {
      await admin.auth().deleteUser(uid);
    } catch (authErr) {
      if (authErr.code === "auth/user-not-found") {
        return new Response(
          JSON.stringify({ error: "Usuário não encontrado no Auth" }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      throw authErr; // outros erros do Auth
    }

    // Deleta do Firestore
    const db = admin.firestore();
    const userDocRef = db.collection("usuarios").doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return new Response(
        JSON.stringify({ warning: "Usuário deletado do Auth, mas não existia no Firestore" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await userDocRef.delete();

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno ao deletar usuário" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
