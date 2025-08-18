import admin from "firebase-admin";
import fs from "fs";

// Lê o arquivo JSON manualmente
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Substitua pelo UID do usuário que deseja tornar admin
const uid = "IFcNA44TNZY81DmRPdKZGc2518x1";

async function setAdminClaim() {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Usuário ${uid} agora é ADMIN`);
    process.exit(0);
  } catch (error) {
    console.error("Erro ao definir claim:", error);
    process.exit(1);
  }
}

setAdminClaim();
