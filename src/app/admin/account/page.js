"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import AuthGuard from "@/components/security/AuthGuard";
import { sendEmailVerification } from "firebase/auth"; // adicione no topo se ainda não importou
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
    onAuthStateChanged,
    updateEmail,
    updatePassword,
    sendPasswordResetEmail,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, X } from "lucide-react"; // adicione Close

export default function AccountPage() {
    const [user, setUser] = useState(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [img, setImg] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmSenha, setConfirmSenha] = useState("");
    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [editField, setEditField] = useState(null); // controle de edição individual

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

    const validateSenha = () => {
        if (senha.length < 6) {
            alert("A nova senha deve ter pelo menos 6 caracteres.");
            return false;
        }
        if (senha !== confirmSenha) {
            alert("As senhas não coincidem.");
            return false;
        }
        return true;
    };

    const handleSaveDados = async () => {
        if (!user) return;
        if (!validate()) return;

        setSaving(true);
        try {
            const currentUser = auth.currentUser || user;
            if (!currentUser) throw new Error("Usuário não encontrado. Faça login novamente.");

            if (email !== currentUser.email) {
                // pega token recente
                const idToken = await currentUser.getIdToken(true);

                const res = await fetch("/api/update-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken, newEmail: email }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || "Erro ao atualizar email");

                // recarrega usuário para refletir mudança
                await currentUser.reload();

                // opcional: envia verificação pro novo e-mail
                try {
                    await sendEmailVerification(currentUser);
                } catch (err) {
                    console.warn("Não foi possível enviar e-mail de verificação automaticamente:", err);
                }
            }

            // atualiza Firestore depois do Auth
            const docRef = doc(db, "usuarios", currentUser.uid);
            await updateDoc(docRef, { nome, email, img });

            setOriginalData({ nome, email, img });
            setEditField(null);
            alert("Dados atualizados com sucesso!");
        } catch (err) {
            console.error("Erro ao atualizar dados:", err);
            if (err.message.includes("(auth/user-token-expired)")) {
                alert("Sua sessão expirou. Por favor, faça login novamente para atualizar seu e-mail.");
            } else {
                alert("Erro ao atualizar dados: " + (err.message || err));
            }
        } finally {
            setSaving(false);
        }
    };

    const handleSaveSenha = async () => {
        if (!user) return;
        if (!validateSenha()) return;

        setSaving(true);
        try {
            await updatePassword(user, senha);
            setSenha("");
            setConfirmSenha("");
            setShowPasswordForm(false);
            alert("Senha alterada com sucesso!");
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            alert("Erro ao alterar senha: " + error.message);
        }
        setSaving(false);
    };

    const handleRecoverPassword = async () => {
        if (!email) {
            alert("Por favor, insira um e-mail válido.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert("Um link de redefinição de senha foi enviado para o seu e-mail.");
        } catch (error) {
            alert("Erro ao enviar e-mail de recuperação: " + error.message);
        }
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
            <div className="flex min-h-screen bg-[url('/images/restrict/account.jpg')] bg-cover text-white">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center p-6 backdrop-blur-xl backdrop-hue-rotate-180">
                    <div className="relative w-full max-w-md perspective h-full flex flex-col pt-20">
                        <div
                            className={`transition-transform duration-700 w-120 transform-style-preserve-3d ${showPasswordForm ? "rotate-y-180" : ""
                                }`}
                        >
                            {/* Frente - Dados */}
                            <div className="absolute w-full backface-hidden bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-700 flex flex-col items-center">
                                <h1 className="text-2xl font-bold mb-6 text-center">
                                    Minha Conta
                                </h1>

                                {/* Foto */}
                                <div className="relative mb-6 flex flex-col items-center">
                                    {editField === "img" ? (
                                        <div className="flex items-center justify-center gap-2 w-full">
                                            <Input
                                                type="url"
                                                value={img}
                                                onChange={(e) => setImg(e.target.value)}
                                                className="bg-zinc-800 text-white border-zinc-700 w-3/4"
                                                placeholder="Cole aqui o link da imagem"
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="bg-zinc-700 hover:bg-zinc-600"
                                                onClick={() => setImg(originalData.img) || setEditField(null)}
                                            >
                                                <X className="w-4 h-4 text-white" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={img || "/default-user.png"}
                                                alt="Foto do usuário"
                                                className="w-28 h-28 rounded-full object-cover border-2 border-zinc-700"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute bottom-0 right-0 bg-zinc-800 hover:bg-zinc-700 rounded-full p-2"
                                                onClick={() => setEditField("img")}
                                            >
                                                <Pencil className="w-4 h-4 text-white" />
                                            </Button>
                                        </div>
                                    )}
                                </div>



                                {/* Nome */}
                                <div className="w-full text-center mb-4">
                                    {editField === "nome" ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Input
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                                className="bg-zinc-800 text-white border-zinc-700 w-3/4"
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="bg-zinc-700 hover:bg-zinc-600"
                                                onClick={() => setNome(originalData.nome) || setEditField(null)}
                                            >
                                                <X className="w-4 h-4 text-white" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center justify-center gap-2 cursor-pointer"
                                            onClick={() => setEditField("nome")}
                                        >
                                            <span className="text-lg font-semibold">{nome}</span>
                                            <Pencil className="w-4 h-4 text-zinc-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="w-full text-center mb-8">
                                    {editField === "email" ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="bg-zinc-800 text-white border-zinc-700 w-3/4"
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="bg-zinc-700 hover:bg-zinc-600"
                                                onClick={() => setEmail(originalData.email) || setEditField(null)}
                                            >
                                                <X className="w-4 h-4 text-white" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center justify-center gap-2 cursor-pointer"
                                            onClick={() => setEditField("email")}
                                        >
                                            <span className="text-sm text-zinc-300">{email}</span>
                                            <Pencil className="w-4 h-4 text-zinc-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Botões */}
                                <div className="flex space-x-4 mt-4 w-full">
                                    <Button
                                        onClick={handleSaveDados}
                                        disabled={saving}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 hover:cursor-pointer rounded-xl"
                                    >
                                        {saving ? "Salvando..." : "Salvar Alterações"}
                                    </Button>
                                    <Button
                                        onClick={() => setShowPasswordForm(true)}
                                        className="flex-1 bg-zinc-700 hover:bg-zinc-600 rounded-xl hover:cursor-pointer"
                                    >
                                        Alterar Senha
                                    </Button>
                                </div>
                            </div>

                            {/* Verso - Senha */}
                            <div className="absolute w-full backface-hidden rotate-y-180 bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-700">
                                <h1 className="text-2xl font-bold mb-6 text-center">
                                    Alterar Senha
                                </h1>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm mb-1">Nova Senha</label>
                                        <Input
                                            type="password"
                                            value={senha}
                                            onChange={(e) => setSenha(e.target.value)}
                                            className="bg-zinc-800 text-white border-zinc-700"
                                            placeholder="Digite a nova senha"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm mb-1">
                                            Confirmar Senha
                                        </label>
                                        <Input
                                            type="password"
                                            value={confirmSenha}
                                            onChange={(e) => setConfirmSenha(e.target.value)}
                                            className="bg-zinc-800 text-white border-zinc-700"
                                            placeholder="Confirme a nova senha"
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-3 mt-6 w-full">
                                        <div className="flex justify-center gap-1 w-full">
                                            <Button
                                                onClick={handleSaveSenha}
                                                disabled={saving}
                                                className="w-[49%] bg-purple-600 hover:bg-purple-700 rounded-xl hover:cursor-pointer"
                                            >
                                                {saving ? "Salvando..." : "Salvar Senha"}
                                            </Button>

                                            <Button
                                                onClick={handleRecoverPassword}
                                                variant="outline"
                                                className="w-[49%] border border-zinc-600 text-black bg-zinc-300 hover:bg-zinc-100 rounded-xl hover:cursor-pointer"
                                            >
                                                Recuperar senha por e-mail
                                            </Button>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                setShowPasswordForm(false);
                                                setSenha("");
                                                setConfirmSenha("");
                                            }}
                                            className="w-full bg-zinc-700 hover:bg-zinc-600 rounded-xl hover:cursor-pointer"
                                        >
                                            Voltar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <style jsx>{`
            .perspective {
              perspective: 1000px;
            }
            .transform-style-preserve-3d {
              transform-style: preserve-3d;
            }
            .backface-hidden {
              backface-visibility: hidden;
            }
            .rotate-y-180 {
              transform: rotateY(180deg);
            }
          `}</style>
                </main>
            </div>
        </AuthGuard>
    );
}
