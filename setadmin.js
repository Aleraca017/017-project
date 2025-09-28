import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("./project017tag-28b6aaca7153.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Substutua pelo id do usuário do firebase que deseja tornarr adm
const uid = "m9m4EhhloVUcywwbkAY5QvKC0QB2";

async function setAdminClaim() {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: false });
    console.log(`Usuário ${uid} agora é ADMIN`);
    process.exit(0);
  } catch (error) {
    console.error("Erro ao definir claim:", error);
    process.exit(1);
  }
}

setAdminClaim();
