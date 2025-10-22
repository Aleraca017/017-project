"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Lottie from "lottie-react"
import error401Animation from "@/../public/lotties/restrict/Error401.json";

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
            <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950  text-center">
                <Header />
                <div className="flex flex-col h-screen w-full items-center justify-center bg-zinc-950 bg-cover bg-center flex-1 bold">
                    <div className="backdrop-blur-sm w-full h-150 flex flex-col items-center justify-around mt-20 text-purple-500 text-shadow-lg text-shadow-purple-900 text-7xl">

                        <h1>Você não tem permissão para acessar essa pagina</h1>

                        <Lottie
                            className="h-200 "
                            animationData={error401Animation}
                            loop
                            autoplay
                        />


                        <a onClick={router.push("/login")} className="text-xl text-white hover:cursor-pointer hover:underline">Retornar para a pagina anterior</a>

                    </div>


                </div>
                <Footer />
            </div>
        );
    }

    return children;
}
