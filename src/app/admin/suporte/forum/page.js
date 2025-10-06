"use client";

import { useState } from "react";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { dbSolicitacoes } from "@/lib/firebase-solicitacoes";
import Sidebar from "@/components/admin/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function RegistroPage() {
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(false);
    const [solicitacao, setSolicitacao] = useState(null);
    const [erro, setErro] = useState("");
    const [tratativa, setTratativa] = useState("");
    const [salvando, setSalvando] = useState(false);

    async function buscarSolicitacao() {
        setLoading(true);
        setErro("");
        setSolicitacao(null);

        try {
            const docRef = doc(dbSolicitacoes, "chamados", id.trim());
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                setSolicitacao({ id: snap.id, ...snap.data() });
            } else {
                setErro("Nenhuma solicitação encontrada com este ID.");
            }
        } catch (err) {
            console.error(err);
            setErro("Erro ao buscar solicitação. Verifique o ID e tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    async function registrarTratativa() {
        if (!tratativa.trim()) return;

        setSalvando(true);
        try {
            await addDoc(collection(dbSolicitacoes, "chamados", id.trim(), "tratativas"), {
                texto: tratativa.trim(),
                criadoEm: serverTimestamp(),
            });

            alert("Tratativa registrada com sucesso!");
            setTratativa("");
        } catch (err) {
            console.error(err);
            alert("Erro ao registrar tratativa.");
        } finally {
            setSalvando(false);
        }
    }

    function toMillis(ts) {
        if (!ts) return 0;
        if (ts.seconds !== undefined) return ts.seconds * 1000 + (ts.nanoseconds || 0) / 1e6;
        if (ts.toDate) return ts.toDate().getTime();
        if (ts instanceof Date) return ts.getTime();
        return 0;
    }

    function formatGap(start, end) {
        let delta = Math.max(0, end - start) / 1000; // segundos, nunca negativo
        const days = Math.floor(delta / 86400);
        delta -= days * 86400;
        const hours = Math.floor(delta / 3600);
        delta -= hours * 3600;
        const minutes = Math.floor(delta / 60);

        let gapStr = "";
        if (days) gapStr += `${days}d `;
        if (hours) gapStr += `${hours}h `;
        if (minutes) gapStr += `${minutes}m`;
        if (!gapStr) gapStr = "<1m";

        return gapStr.trim();
    }


    return (
        <div className="flex min-h-screen bg-black">
            <Sidebar />

            <main className="flex-1 p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-50">Registro de Solicitação</h1>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Buscar Solicitação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Digite o ID da solicitação"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <Button onClick={buscarSolicitacao} disabled={loading || !id.trim()}>
                            {loading ? "Buscando..." : "Buscar"}
                        </Button>

                        {erro && <p className="text-red-600 text-sm">{erro}</p>}
                    </CardContent>
                </Card>

                {solicitacao && (
                    <Card className="bg-zinc-900 border-zinc-700 text-white">
                        <CardHeader className="border-b border-zinc-700">
                            <CardTitle className="text-xl text-white">Detalhes da Solicitação</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Dados do Cliente */}
                                <div className="flex-1 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                                    <h3 className="text-lg font-semibold mb-3 text-white border-b border-zinc-600 pb-1">
                                        Dados do Cliente
                                    </h3>
                                    <p><strong>Cliente:</strong> {solicitacao.cliente || "—"}</p>
                                    <p><strong>Solicitante:</strong> {solicitacao.emailAutor || "—"}</p>
                                </div>

                                {/* Dados da Solicitação */}
                                <div className="flex-1 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                                    <h3 className="text-lg font-semibold mb-3 text-white border-b border-zinc-600 pb-1">
                                        Dados da Solicitação
                                    </h3>
                                    <p><strong>ID:</strong> {solicitacao.id}</p>
                                    <p><strong>Status:</strong> {solicitacao.status || "—"}</p>

                                    {/* Datas e Gap */}
                                    <div className="mt-2">
                                        <p>
                                            <strong>Criado em:</strong>{" "}
                                            {solicitacao.criadoEm
                                                ? new Date(solicitacao.criadoEm.seconds * 1000).toLocaleString()
                                                : "—"}
                                        </p>
                                        <p>
                                            <strong>Concluído em:</strong>{" "}
                                            {solicitacao.concluidoEm
                                                ? new Date(solicitacao.concluidoEm.seconds * 1000).toLocaleString()
                                                : "—"}
                                        </p>
                                        {solicitacao.criadoEm && solicitacao.concluidoEm && (
                                            <p>
                                                <strong>Tempo de conclusão:</strong>{" "}
                                                {formatGap(
                                                    toMillis(solicitacao.criadoEm),
                                                    toMillis(solicitacao.concluidoEm)
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-md font-medium mb-2 text-white bg-zinc-700 p-1 text-center rounded">Stacks</h4>
                                        <p><strong>Linguagem:</strong> {solicitacao.linguagem || "—"}</p>
                                        <p><strong>Framework:</strong> {solicitacao.framework || "—"}</p>
                                        <p><strong>Tecnologia:</strong> {solicitacao.tecnologia || "—"}</p>
                                        <p><strong>Rotas:</strong> {solicitacao.rotas || "—"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tratativa */}
                            <div className="mt-4">
                                <h2 className="font-semibold mb-2 text-white">Tratativa</h2>
                                <Textarea
                                    placeholder="Descreva as tratativas realizadas..."
                                    rows={5}
                                    value={tratativa}
                                    onChange={(e) => setTratativa(e.target.value)}
                                    className="bg-zinc-800 text-white border-zinc-700 focus:ring-1 focus:ring-blue-500"
                                />
                                <Button
                                    onClick={registrarTratativa}
                                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={!tratativa.trim() || salvando}
                                >
                                    {salvando ? "Salvando..." : "Registrar Tratativa"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
