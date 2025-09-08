"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { dbSolicitacoes } from "@/lib/firebase-solicitacoes";
import Sidebar from "@/components/admin/Sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Buscar solicitações
  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const querySnapshot = await getDocs(collection(dbSolicitacoes, "chamados"));
        const dados = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => new Date(b.data) - new Date(a.data));
        setSolicitacoes(dados);
      } catch (err) {
        console.error("Erro ao buscar solicitações:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitacoes();
  }, []);

  // Notificação animada
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const statusColors = {
    pendente: "bg-yellow-500",
    "em tratativa": "bg-gray-400",
    concluido: "bg-green-500",
    cancelado: "bg-red-500",
  };

  const formatDate = (str) => {
    if (!str) return "-";
    const d = new Date(str);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}/${d.getFullYear()} - ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  const atualizarStatus = async (id, novoStatus, emailAutor, cancelReason = "") => {
    try {
      const res = await fetch("/api/solicitacoes/set-tratativa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, novoStatus, emailAutor, cancelReason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao atualizar status");

      setNotification({ message: data.message || "Status atualizado com sucesso!", type: "success" });
      setSolicitacoes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: novoStatus } : s))
      );
      setSelectedSolicitacao((prev) =>
        prev && prev.id === id ? { ...prev, status: novoStatus } : prev
      );
      setShowCancelInput(false);
      setCancelReason("");
    } catch (err) {
      setNotification({ message: err.message, type: "error" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-purple-500">Solicitações</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : solicitacoes.length > 0 ? (
          <ul className="space-y-4">
            {solicitacoes.map((sol) => (
              <li
                key={sol.id}
                className="border p-4 rounded-lg shadow-sm bg-gray-50 hover:shadow-md cursor-pointer"
                onClick={() => {
                  setSelectedSolicitacao(sol);
                  setShowCancelInput(false);
                  setCancelReason("");
                }}
              >
                <div className="flex justify-between items-center mb-2 text-black">
                  <span className="font-bold">{sol.aplicação || "-"}</span>
                  <span
                    className={`text-white px-2 py-1 rounded ${statusColors[sol.status] || "bg-gray-400"}`}
                  >
                    {sol.status || "-"}
                  </span>
                </div>
                <p className="text-gray-700">{sol.emailAutor || "-"}</p>
                <p className="text-gray-500 text-sm">{formatDate(sol.data)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma solicitação encontrada.</p>
        )}

        {/* Modal usando shadcn/ui Dialog */}
        <Dialog open={!!selectedSolicitacao} onOpenChange={() => setSelectedSolicitacao(null)}>
          <DialogContent className="max-w-lg">
            {selectedSolicitacao && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedSolicitacao.aplicação}</DialogTitle>
                  <DialogDescription className="flex justify-between">
                    <span className={`text-white px-2 py-1 rounded ${statusColors[selectedSolicitacao.status]}`}>
                      {selectedSolicitacao.status}
                    </span>
                    <span>{selectedSolicitacao.emailAutor} - {formatDate(selectedSolicitacao.data)}</span>
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-2 space-y-2 text-black">
                  <p><strong>Assunto:</strong> {selectedSolicitacao.assunto || "-"}</p>
                  <p><strong>Detalhamento:</strong> {selectedSolicitacao.detalhamento || "-"}</p>
                  <p><strong>Mensagem:</strong> {selectedSolicitacao.mensagem || "-"}</p>
                  <p><strong>Linguagem:</strong> {selectedSolicitacao.linguagem || "-"}</p>
                  <p><strong>Framework:</strong> {selectedSolicitacao.framework || "-"}</p>
                  <p><strong>Tecnologia:</strong> {selectedSolicitacao.tecnologia || "-"}</p>
                  <p><strong>Rotas:</strong> {selectedSolicitacao.rotas || "-"}</p>

                  {/* Botões e input de cancelamento */}
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex justify-end gap-2">
                      {selectedSolicitacao.status === "pendente" && (
                        <Button
                          variant="yellow"
                          onClick={() =>
                            atualizarStatus(selectedSolicitacao.id, "em tratativa", selectedSolicitacao.emailAutor)
                          }
                        >
                          Colocar em tratativa
                        </Button>
                      )}

                      {selectedSolicitacao.status === "em tratativa" && (
                        <>
                          <Button
                            variant="green"
                            className={"bg-green-500 text-white hover:bg-green-600 hover:scale-105 hover:cursor-pointer transition-all"}
                            onClick={() =>
                              atualizarStatus(selectedSolicitacao.id, "concluido", selectedSolicitacao.emailAutor)
                            }
                          >
                            Concluir
                          </Button>
                          <Button
                            variant="destructive"
                            className={"bg-red-500 text-white hover:bg-red-600 hover:scale-105 hover:cursor-pointer transition-all"}
                            onClick={() => setShowCancelInput(!showCancelInput)}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}

                      <Button variant="outline" 
                      className={"bg-gray-500 text-white hover:bg-gray-600 hover:scale-105 hover:text-white hover:cursor-pointer transition-all"}
                      onClick={() => setSelectedSolicitacao(null)}>
                        Fechar
                      </Button>
                    </div>

                    {showCancelInput && (
                      <div className="flex flex-col gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Motivo do cancelamento"
                          className="w-full border p-2 rounded"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                        />
                        <Button
                          variant="destructive"
                          onClick={() =>
                            atualizarStatus(
                              selectedSolicitacao.id,
                              "cancelado",
                              selectedSolicitacao.emailAutor,
                              cancelReason
                            )
                          }
                        >
                          Enviar cancelamento
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Notificação */}
        {notification.message && (
          <div
            className={`fixed top-5 right-5 rounded-2xl py-2 px-4 z-50 transition-transform duration-500 ${
              notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {notification.message}
          </div>
        )}
      </main>
    </div>
  );
}
