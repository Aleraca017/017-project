//frontend definer
"use client";

//react imports
import { useEffect, useState } from "react";

//firebase imports
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { dbSolicitacoes } from "@/lib/firebase-solicitacoes";

//security components
import AdminGuard from "@/components/security/AdminGuard";
import CheckUserPermission from "@/components/security/CheckUserPermission";

//visual components
import Sidebar from "@/components/admin/Sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function TransferirSolicitacoesPage() {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
    const [novoResponsavel, setNovoResponsavel] = useState("");
    const [transferindo, setTransferindo] = useState(false);

    // 🔹 Buscar solicitações em tratativa
    useEffect(() => {
        const fetchSolicitacoes = async () => {
            try {
                const querySnapshot = await getDocs(collection(dbSolicitacoes, "chamados"));
                const dados = querySnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((s) => s.status?.toLowerCase() === "em tratativa");
                setSolicitacoes(dados);
            } catch (error) {
                console.error("Erro ao buscar solicitações:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSolicitacoes();
    }, []);

    // 🔹 Buscar usuários
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "usuarios"));
                const dados = querySnapshot.docs.map((doc) => ({
                    uid: doc.id,
                    ...doc.data(),
                }));
                setUsuarios(dados);
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
            }
        };
        fetchUsuarios();
    }, []);

    // 🔹 Transferência
    const handleTransferir = async () => {
        if (!selectedSolicitacao || !novoResponsavel) return;
        try {
            setTransferindo(true);

            const usuario = usuarios.find((u) => u.uid === novoResponsavel);
            if (!usuario) throw new Error("Usuário não encontrado.");

            const solicitacaoRef = doc(dbSolicitacoes, "chamados", selectedSolicitacao.id);
            await updateDoc(solicitacaoRef, {
                atendidoPorUid: usuario.uid,
                atendidoPorNome: usuario.nome || "",
                atendidoPorEmail: usuario.email || "",
            });

            setSolicitacoes((prev) =>
                prev.map((s) =>
                    s.id === selectedSolicitacao.id
                        ? {
                            ...s,
                            atendidoPorUid: usuario.uid,
                            atendidoPorNome: usuario.nome,
                            atendidoPorEmail: usuario.email,
                        }
                        : s
                )
            );

            setSelectedSolicitacao(null);
            setNovoResponsavel("");
        } catch (error) {
            console.error("Erro ao transferir solicitação:", error);
        } finally {
            setTransferindo(false);
        }
    };

    // 🔎 Filtro
    const solicitacoesFiltradas = solicitacoes.filter((s) => {
        if (!busca) return true;
        const lower = busca.toLowerCase();
        return (
            s.id?.toLowerCase().includes(lower) ||
            s.aplicação?.toLowerCase().includes(lower) ||
            s.atendidoPorEmail?.toLowerCase().includes(lower) ||
            s.atendidoPorNome?.toLowerCase().includes(lower)
        );
    });

    return (
        <AdminGuard>
            <CheckUserPermission>
                <div className="flex min-h-screen bg-black text-white">
                    <Sidebar />

                    <main className="flex-1 p-6">
                        <h1 className="text-2xl font-bold mb-6 text-gray-50">
                            Transferência de Solicitações
                        </h1>

                        <div className="mb-4">
                            <Label className="text-white">
                                Buscar por ID, aplicação ou atendente:
                            </Label>
                            <Input
                                type="text"
                                placeholder="Digite para filtrar"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="bg-zinc-800 text-zinc-300 border-zinc-700 border-2 mt-1"
                            />
                        </div>

                        {loading ? (
                            <p>Carregando solicitações...</p>
                        ) : solicitacoesFiltradas.length === 0 ? (
                            <p>Nenhuma solicitação em tratativa encontrada.</p>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {solicitacoesFiltradas.map((s) => (
                                    <div
                                        key={s.id}
                                        onDoubleClick={() => setSelectedSolicitacao(s)}
                                        className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow hover:shadow-lg cursor-pointer transition"
                                    >
                                        <h2 className="text-lg font-semibold text-gray-100 mb-2">
                                            {s.aplicação || "Solicitação sem nome"}
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            <span className="font-medium">Atendido por:</span>{" "}
                                            {s.atendidoPorNome || "—"}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            <span className="font-medium">Email:</span>{" "}
                                            {s.atendidoPorEmail || "—"}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2 italic">
                                            (Clique duas vezes para transferir)
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Modal usando shadcn */}
                        <Dialog open={!!selectedSolicitacao} onOpenChange={setSelectedSolicitacao}>
                            <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-200">
                                <DialogHeader>
                                    <DialogTitle>Transferir Solicitação</DialogTitle>
                                </DialogHeader>

                                {selectedSolicitacao && (
                                    <>
                                        <p className="text-gray-300 mb-2">
                                            <span className="font-medium text-gray-100">Aplicação:</span>{" "}
                                            {selectedSolicitacao.aplicação || "—"}
                                        </p>
                                        <p className="text-gray-300 mb-4">
                                            <span className="font-medium text-gray-100">
                                                Atualmente tratado por:
                                            </span>{" "}
                                            {selectedSolicitacao.atendidoPorNome || "—"} (
                                            {selectedSolicitacao.atendidoPorEmail || "—"})
                                        </p>

                                        <Label className="block text-sm font-medium text-gray-200 mb-1">
                                            Novo Responsável
                                        </Label>
                                        <Select
                                            value={novoResponsavel}
                                            onValueChange={(v) => setNovoResponsavel(v)}
                                        >
                                            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-300">
                                                <SelectValue placeholder="Selecione um usuário" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 text-zinc-200">
                                                {usuarios.map((u) => (
                                                    <SelectItem key={u.uid} value={u.uid}>
                                                        {u.nome} ({u.email})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <DialogFooter className="mt-6">
                                            <Button
                                                variant="outline"
                                                onClick={() => setSelectedSolicitacao(null)}
                                                className="bg-zinc-800 border-zinc-700 text-gray-200 hover:bg-zinc-700"
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                onClick={handleTransferir}
                                                disabled={transferindo}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                {transferindo ? "Transferindo..." : "Transferir"}
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>
                    </main>
                </div>
            </CheckUserPermission>
        </AdminGuard>
    );
}
