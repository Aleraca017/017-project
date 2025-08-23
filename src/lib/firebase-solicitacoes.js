import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfigSolicitacoes = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_SOL_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_SOL_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_SOL_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_SOL_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SOL_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_SOL_APP_ID,
};

const appSolicitacoes =
  getApps().find((a) => a.name === "solicitacoes") ||
  initializeApp(firebaseConfigSolicitacoes, "solicitacoes");

export const dbSolicitacoes = getFirestore(appSolicitacoes);
