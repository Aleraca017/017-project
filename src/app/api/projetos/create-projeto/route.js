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
      status: body.status || "pendente",
      cliente: body.cliente || "",
      responsavel: body.responsavel || "",
      criadoEm: new Date(),
      linguagem: body.linguagem || "",
      framework: body.framework || "",
      tecnologia: body.tecnologia || "",
      autor: body.autor || "",
      tipo: body.tipo || "", // novo campo: tipo de projeto
      dataEntrega: body.dataEntrega ? new Date(body.dataEntrega) : null, // novo campo: data de entrega
    });

    return NextResponse.json({ docId: docRef.id });
  } catch (err) {
    console.error("Erro ao criar projeto:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
