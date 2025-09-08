// app/api/reunioes/route.js
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export async function GET() {
  try {
    const snap = await getDocs(collection(db, "reunioes"));
    const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return Response.json(list, { status: 200 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const docRef = await addDoc(collection(db, "reunioes"), data);
    return Response.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
