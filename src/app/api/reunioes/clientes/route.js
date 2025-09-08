// app/api/reunioes/clientes/route.js
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const snap = await getDocs(collection(db, "clientes"));
    const clientes = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return new Response(JSON.stringify(clientes), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
