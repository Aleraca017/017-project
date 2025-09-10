import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.docId) {
      return NextResponse.json({ error: "ID do projeto é obrigatório." }, { status: 400 });
    }

    // Buscar dados do responsável
    let responsavelData = {};
    if (body.responsavel) {
      const userRef = doc(db, "usuarios", body.responsavel);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        responsavelData = {
          responsavelNome: userSnap.data().nome,
          responsavelEmail: userSnap.data().email,
        };
      }
    }

    const projectRef = doc(db, "projetos", body.docId);
    await updateDoc(projectRef, {
      titulo: body.titulo,
      descricao: body.descricao,
      cliente: body.clienteNome || "",
      status: body.status,
      ...responsavelData,
      atualizadoEm: new Date(),
      linguagem: body.linguagem || "",
      framework: body.framework || "",
      tecnologia: body.tecnologia || "",
      autor: body.autor || "",
      githubUrl: body.githubUrl || "",
      tipo: body.tipo || "", // novo campo: tipo de projeto
      dataEntrega: body.dataEntrega ? new Date(body.dataEntrega) : null, // novo campo: data de entrega
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao atualizar projeto:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
