"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function CheckUserPermission({ children }) {
    const [isAllowed, setIsAllowed] = useState(null); // null = carregando
    const router = useRouter();

    useEffect(() => {
        const checkPermission = async () => {
            const user = auth.currentUser;
            if (!user) return; // já será tratado pelo AuthGuard

            try {
                const userDoc = await getDoc(doc(db, "usuarios", user.uid));

                if (userDoc.exists()) {
                    const data = userDoc.data();

                    if (data.permissao?.toLowerCase() === "cliente") {
                        router.replace("/client/home");
                        return;
                    }

                    setIsAllowed(true); // tem permissão
                } else {
                    console.warn("Documento do usuário não encontrado");
                }
            } catch (error) {
                console.error("Erro ao verificar permissão:", error);
            }
        };

        checkPermission();
    }, [router]);

    // Enquanto verifica, não renderiza nada (evita flash)
    if (isAllowed === null) {
        return null;
    }

    // Só renderiza o conteúdo se o usuário tiver permissão
    return <>{children}</>;
}
