"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Sidebar from "@/components/admin/Sidebar";
import AuthGuard from "@/components/security/AuthGuard";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ForumTratativasPage() {
    const [tratativas, setTratativas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [expandedCliente, setExpandedCliente] = useState(null);
    const [expandedAssuntoKey, setExpandedAssuntoKey] = useState(null); // chave composta cliente|assunto
    const [loading, setLoading] = useState(true);

    // carrega tratativas
    useEffect(() => {
        async function carregarTratativas() {
            try {
                const snap = await getDocs(collection(db, "tratativas"));
                const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setTratativas(lista);
            } catch (err) {
                console.error("Erro ao carregar tratativas:", err);
            } finally {
                setLoading(false);
            }
        }
        carregarTratativas();
    }, []);

    // agrupa por cliente > assunto > detalhamento
    const grupos = tratativas.reduce((acc, t) => {
        const cliente = (t.cliente || "—").trim();
        const assunto = (t.assunto || "Sem assunto").trim();
        const detalhamento = (t.detalhamento || "Sem detalhamento").trim();

        if (!acc[cliente]) acc[cliente] = {};
        if (!acc[cliente][assunto]) acc[cliente][assunto] = {};
        if (!acc[cliente][assunto][detalhamento]) acc[cliente][assunto][detalhamento] = [];
        acc[cliente][assunto][detalhamento].push(t);
        return acc;
    }, {});

    // filtro: busca em cliente, assunto ou detalhamento
    const matchesFiltro = (cliente, assuntosObj) => {
        if (!filtro || filtro.trim() === "") return true;
        const f = filtro.toLowerCase();
        // cliente
        if ((cliente || "").toLowerCase().includes(f)) return true;
        // assuntos e detalhamentos
        for (const assunto of Object.keys(assuntosObj)) {
            if (assunto.toLowerCase().includes(f)) return true;
            const detalhamentos = Object.keys(assuntosObj[assunto] || {});
            for (const det of detalhamentos) {
                if (det.toLowerCase().includes(f)) return true;
            }
        }
        return false;
    };

    return (
        <AuthGuard>
            <div className="flex min-h-screen bg-black text-white">
                <Sidebar />

                <main className="flex-1 p-6 max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6 text-white">Fórum de Tratativas</h1>

                    <div className="flex items-center gap-3 mb-6">
                        <Input
                            placeholder="Buscar por cliente, assunto ou detalhamento..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="bg-zinc-900 border-zinc-700 text-white"
                        />
                        <Button
                            onClick={() => setFiltro("")}
                            className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                        >
                            Limpar
                        </Button>
                    </div>

                    {loading ? (
                        <p className="text-gray-400">Carregando tratativas...</p>
                    ) : Object.keys(grupos).length === 0 ? (
                        <p className="text-gray-400">Nenhuma tratativa registrada.</p>
                    ) : (
                        Object.entries(grupos)
                            .filter(([cliente, assuntos]) => matchesFiltro(cliente, assuntos))
                            .map(([cliente, assuntos]) => (
                                <Card key={cliente} className="mb-4 bg-zinc-900 border-zinc-700 text-white">
                                    <CardHeader
                                        onClick={() => setExpandedCliente(expandedCliente === cliente ? null : cliente)}
                                        className="cursor-pointer hover:bg-zinc-800 transition"
                                    >
                                        <CardTitle className="text-white">{cliente}</CardTitle>
                                    </CardHeader>

                                    <AnimatePresence>
                                        {expandedCliente === cliente && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <CardContent className="space-y-3">
                                                    {Object.entries(assuntos)
                                                        .filter(([assunto]) => {
                                                            // filtrar por busca (cliente já passou no matchesFiltro)
                                                            if (!filtro || filtro.trim() === "") return true;
                                                            const f = filtro.toLowerCase();
                                                            // incluir assunto se tema bate ou se algum detalhamento bate
                                                            if (assunto.toLowerCase().includes(f)) return true;
                                                            for (const det of Object.keys(assuntos[assunto] || {})) {
                                                                if (det.toLowerCase().includes(f)) return true;
                                                            }
                                                            return false;
                                                        })
                                                        .map(([assunto, detalhamentos]) => {
                                                            const assuntoKey = `${cliente}||${assunto}`;
                                                            return (
                                                                <div key={assunto} className="bg-zinc-800 rounded-lg p-3">
                                                                    <h3
                                                                        onClick={() =>
                                                                            setExpandedAssuntoKey(
                                                                                expandedAssuntoKey === assuntoKey ? null : assuntoKey
                                                                            )
                                                                        }
                                                                        className="font-semibold text-lg cursor-pointer hover:text-blue-400 text-white"
                                                                    >
                                                                        {assunto}
                                                                    </h3>

                                                                    <AnimatePresence>
                                                                        {expandedAssuntoKey === assuntoKey && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, height: 0 }}
                                                                                animate={{ opacity: 1, height: "auto" }}
                                                                                exit={{ opacity: 0, height: 0 }}
                                                                                transition={{ duration: 0.25 }}
                                                                                className="mt-2 pl-4 space-y-3"
                                                                            >
                                                                                {Object.entries(detalhamentos)
                                                                                    .filter(([detalhamento]) => {
                                                                                        if (!filtro || filtro.trim() === "") return true;
                                                                                        return detalhamento.toLowerCase().includes(filtro.toLowerCase());
                                                                                    })
                                                                                    .map(([detalhamento, itens]) => (
                                                                                        <div
                                                                                            key={detalhamento}
                                                                                            className="bg-zinc-700 p-3 rounded-md"
                                                                                        >
                                                                                            <h4 className="font-medium mb-2 text-white">
                                                                                                {detalhamento}
                                                                                            </h4>

                                                                                            {itens.map((t) => (
                                                                                                <div
                                                                                                    key={t.id}
                                                                                                    className="border-t border-zinc-600 pt-2 mt-2 text-sm"
                                                                                                >
                                                                                                    <p className="text-white">
                                                                                                        <strong>Status:</strong>{" "}
                                                                                                        <span
                                                                                                            className={
                                                                                                                t.statusTratativa === "concluída"
                                                                                                                    ? "text-green-400"
                                                                                                                    : "text-yellow-400"
                                                                                                            }
                                                                                                        >
                                                                                                            {t.statusTratativa || "—"}
                                                                                                        </span>
                                                                                                    </p>
                                                                                                    <p className="text-white">
                                                                                                        <strong>Registrado:</strong>{" "}
                                                                                                        {t.registrado ? "Sim" : "Não"}
                                                                                                    </p>
                                                                                                    <p className="text-white mt-1">
                                                                                                        {t.tratativa || "Sem detalhes registrados."}
                                                                                                    </p>
                                                                                                    {t.concluidoEm && (
                                                                                                        <p className="text-xs text-gray-400 mt-2">
                                                                                                            Concluído em:{" "}
                                                                                                            {new Date(
                                                                                                                t.concluidoEm.seconds * 1000
                                                                                                            ).toLocaleString()}
                                                                                                        </p>
                                                                                                    )}
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    ))}
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            );
                                                        })}
                                                </CardContent>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Card>
                            ))
                    )}
                </main>
            </div>
        </AuthGuard>
    );
}
