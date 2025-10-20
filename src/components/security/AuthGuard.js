"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; // seu arquivo de configuração do Firebase


export default function AuthGuard({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/login");
            } else {
                setUser(user);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        // Pode trocar por um spinner bonitinho
        return (
            <div className="flex items-center justify-center h-screen text-gray-600">
                Verificando autenticação...
            </div>
        );
    }

    // Se não estiver logado, nada é renderizado (o redirecionamento já ocorreu)
    if (!user) return null;

    return <>{children}</>;
}
