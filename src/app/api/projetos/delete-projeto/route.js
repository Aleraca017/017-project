import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.docId) {
      return NextResponse.json(
        { error: "ID do projeto é obrigatório." },
        { status: 400 }
      );
    }

    const projectRef = doc(db, "projetos", body.docId);
    await deleteDoc(projectRef);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao excluir projeto:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
