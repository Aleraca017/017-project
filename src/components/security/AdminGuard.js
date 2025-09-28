"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminGuard({ children }) {
    const [status, setStatus] = useState("checking");
    // "checking" | "authorized" | "unauthorized"
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.replace("/login");
                return;
            }

            try {
                const tokenResult = await getIdTokenResult(user);

                if (tokenResult.claims.admin) {
                    setStatus("authorized");
                } else {
                    setStatus("unauthorized");
                    // redireciona só depois de renderizar a mensagem
                }
            } catch (err) {
                console.error("Erro ao verificar claims:", err);
                await signOut(auth);
                router.replace("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (status === "checking") {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-white text-center">
                <Loader2 className="animate-spin w-8 h-8 mb-4" />
                Verificando permissões...
            </div>
        );
    }

    if (status === "unauthorized") {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-red-500 text-center">
                <Header />
                <div className="flex flex-col h-screen w-full items-center justify-center bg-[url(/images/erros/401.jpg)] bg-cover bg-position-[center_left_30rem] flex-1 p-6 bold text-4xl">
                    Erro 401
                    <br />
                    <br />
                    Você não possui permissões suficientes.
                </div>
                <Footer />
            </div>
        );
    }

    return children;
}
