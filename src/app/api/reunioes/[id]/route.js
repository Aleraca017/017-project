// app/api/reunioes/[id]/route.js
import { db } from "@/lib/firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

export async function PUT(req, { params }) {
  try {
    const data = await req.json();
    await updateDoc(doc(db, "reunioes", params.id), data);
    return Response.json({ id: params.id, ...data }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await deleteDoc(doc(db, "reunioes", params.id));
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
