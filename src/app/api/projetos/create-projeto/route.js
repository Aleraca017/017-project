import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.titulo || !body.descricao) {
      return NextResponse.json(
        { error: "Título e descrição são obrigatórios." },
        { status: 400 }
      );
    }

    const docRef = await addDoc(collection(db, "projetos"), {
      titulo: body.titulo,
      descricao: body.descricao,
      status: body.status || "andamento",
      cliente: body.clienteNome || "",
      responsavel: body.responsavel || "",
      responsavelNome: body.responsavelNome || "",
      responsavelEmail: body.responsavelEmail || "",
      criadoEm: new Date(),
      linguagem: body.linguagem || "",
      framework: body.framework || "",
      tecnologia: body.tecnologia || "",
      autor: body.autor || "",
    });

    return NextResponse.json({ docId: docRef.id });
  } catch (err) {
    console.error("Erro ao criar projeto:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
