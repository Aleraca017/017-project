"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";

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
                    setTimeout(async () => {
                        await signOut(auth);
                        router.replace("/login");
                    }, 2000);
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
            <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-white text-center">
                <Loader2 className="animate-spin w-8 h-8 mb-4 text-red-500" />
                Você não possui permissões suficientes.
                <br />
                Redirecionando para login...
            </div>
        );
    }

    return children;
}
