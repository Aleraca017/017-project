"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AuthGuard from "@/components/security/AuthGuard";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, updateEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AccountPage() {
    const [user, setUser] = useState(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [img, setImg] = useState("");
    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setUser(authUser);
                const docRef = doc(db, "usuarios", authUser.uid);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setNome(data.nome || "");
                    setEmail(authUser.email || "");
                    setImg(data.img || "");
                    setOriginalData({
                        nome: data.nome || "",
                        email: authUser.email || "",
                        img: data.img || "",
                    });
                }
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const validate = () => {
        if (!nome.trim() || nome.trim().split(" ").length < 2) {
            alert("O nome deve conter nome e sobrenome.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Digite um email válido.");
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!user) return;
        if (!validate()) return;

        setSaving(true);
        try {
            if (email !== user.email) {
                await updateEmail(user, email);
            }

            const docRef = doc(db, "usuarios", user.uid);
            await updateDoc(docRef, { nome, email, img });

            setOriginalData({ nome, email, img });
            alert("Dados atualizados com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar os dados: " + error.message);
        }
        setSaving(false);
    };

    const handleCancel = () => {
        setNome(originalData.nome);
        setEmail(originalData.email);
        setImg(originalData.img);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                Carregando...
            </div>
        );
    }

    return (
        <AuthGuard>
            <div className="flex min-h-screen bg-black text-white">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-700">
                        <h1 className="text-2xl font-bold mb-6 text-center">Minha Conta</h1>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Nome</label>
                                <Input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="bg-zinc-800 text-white border-zinc-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Email</label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-zinc-800 text-white border-zinc-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Foto (URL)</label>
                                <Textarea
                                    value={img}
                                    onChange={(e) => setImg(e.target.value)}
                                    className="bg-zinc-800 text-white border-zinc-700"
                                    placeholder="Cole aqui o link da sua imagem"
                                    rows={3}
                                />
                            </div>

                            {img && (
                                <div className="mt-4 flex justify-center">
                                    <img
                                        src={img}
                                        alt="Foto do usuário"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-zinc-700"
                                    />
                                </div>
                            )}

                            <div className="flex space-x-4 mt-6">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl"
                                >
                                    {saving ? "Salvando..." : "Salvar Alterações"}
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="flex-1 bg-zinc-700 hover:bg-zinc-600 rounded-xl"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );

}
