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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [filteredSolicitacoes, setFilteredSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showCancelInput, setShowCancelInput] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [idSearch, setIdSearch] = useState("");

  // Novo estado para loader de alteração de status
  const [statusLoading, setStatusLoading] = useState(false);

  // Buscar solicitações
  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const querySnapshot = await getDocs(collection(dbSolicitacoes, "chamados"));
        const dados = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => new Date(b.data) - new Date(a.data));
        setSolicitacoes(dados);
        setFilteredSolicitacoes(dados);
      } catch (err) {
        console.error("Erro ao buscar solicitações:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitacoes();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let data = [...solicitacoes];

    if (idSearch) {
      data = data.filter((s) => s.id === idSearch.trim());
    } else {
      if (search) {
        const lower = search.toLowerCase();
        data = data.filter(
          (s) =>
            (s.aplicação && s.aplicação.toLowerCase().includes(lower)) ||
            (s.emailAutor && s.emailAutor.toLowerCase().includes(lower))
        );
      }
      if (startDate) data = data.filter((s) => new Date(s.data) >= new Date(startDate));
      if (endDate)
        data = data.filter((s) => new Date(s.data) <= new Date(endDate + "T23:59:59"));
      if (statusFilter) data = data.filter((s) => s.status === statusFilter);
    }

    setFilteredSolicitacoes(data);
  }, [search, startDate, endDate, statusFilter, idSearch, solicitacoes]);

  // Notificação animada
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const statusColors = {
    pendente: "bg-gray-500",
    "em tratativa": "bg-yellow-500",
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
      setStatusLoading(true); // ativa loader

      const res = await fetch("/api/solicitacoes/set-tratativa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, novoStatus, emailAutor, cancelReason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao atualizar status");

      setNotification({
        message: data.message || "Status atualizado com sucesso!",
        type: "success",
      });

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
    } finally {
      setStatusLoading(false); // desativa loader
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-50">Solicitações</h1>

        {/* Filtros */}
        <div className="flex flex-col gap-4 mb-6 items-start">
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col text-white">
              <label className="mb-1 text-sm">Data inicial</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-zinc-800 text-zinc-300 border-zinc-700 border-2"
              />
            </div>
            <div className="flex flex-col text-white">
              <label className="mb-1 text-sm">Data final</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-zinc-800 text-zinc-300 border-zinc-700 border-2"
              />
            </div>
            <div className="flex flex-col text-white">
              <label className="mb-1 text-sm">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-800 text-zinc-300 border-zinc-700 border-2 rounded-md p-1"
              >
                <option value="">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="em tratativa">Em tratativa</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <Switch
                checked={showAdvancedSearch}
                onCheckedChange={setShowAdvancedSearch}
                className={"bg-red-500"}
              />
              <Label className="text-white">
                {showAdvancedSearch ? "Busca por ID (ativa)" : "Busca avançada"}
              </Label>
            </div>
          </div>

          {showAdvancedSearch && (
            <Input
              type="text"
              placeholder="Digite o ID do documento"
              value={idSearch}
              onChange={(e) => setIdSearch(e.target.value)}
              className="w-full text-zinc-300 border-zinc-700 border-2"
            />
          )}

          <Input
            type="text"
            placeholder="Pesquisar por cliente ou email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-zinc-300 border-zinc-700 border-2"
            disabled={!!idSearch}
          />
        </div>

        <hr className="mb-4 w-full border-zinc-500" />

        {loading ? (
          <p>Carregando...</p>
        ) : filteredSolicitacoes.length > 0 ? (
          <div className="overflow-y-auto max-h-170 no-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSolicitacoes.map((sol) => (
                <div
                  key={sol.id}
                  className="border-2 border-zinc-700 p-4 rounded-lg shadow-sm bg-zinc-900 hover:shadow-md cursor-pointer"
                  onDoubleClick={() => {
                    setSelectedSolicitacao(sol);
                    setShowCancelInput(false);
                    setCancelReason("");
                  }}
                >
                  <div className="flex justify-between items-center mb-2 text-white">
                    <span className="font-bold">{sol.aplicação || "-"}</span>
                    <span
                      className={`text-white px-2 py-1 rounded ${statusColors[sol.status] || "bg-gray-100"
                        }`}
                    >
                      {sol.status || "-"}
                    </span>
                  </div>
                  <p className="text-purple-200">{sol.emailAutor || "-"}</p>
                  <p className="text-zinc-200 text-sm">{formatDate(sol.data)}</p>
                </div>
              ))}
            </div>
          </div>

        ) : (
          <p className="text-white">Nenhuma solicitação encontrada.</p>
        )}

        {/* Modal */}
        <Dialog open={!!selectedSolicitacao} onOpenChange={() => setSelectedSolicitacao(null)}>
          <DialogContent className="max-w-lg">
            {selectedSolicitacao && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedSolicitacao.aplicação}</DialogTitle>
                  <DialogDescription className="flex justify-between">
                    <span
                      className={`text-white px-2 py-1 rounded ${statusColors[selectedSolicitacao.status]
                        }`}
                    >
                      {selectedSolicitacao.status}
                    </span>
                    <span>
                      {selectedSolicitacao.emailAutor} - {formatDate(selectedSolicitacao.data)}
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-2 space-y-2 text-black">
                  <p>
                    <strong>Assunto:</strong> {selectedSolicitacao.assunto || "-"}
                  </p>
                  <p>
                    <strong>Detalhamento:</strong> {selectedSolicitacao.detalhamento || "-"}
                  </p>
                  <p>
                    <strong>Mensagem:</strong> {selectedSolicitacao.mensagem || "-"}
                  </p>
                  <p>
                    <strong>Linguagem:</strong> {selectedSolicitacao.linguagem || "-"}
                  </p>
                  <p>
                    <strong>Framework:</strong> {selectedSolicitacao.framework || "-"}
                  </p>
                  <p>
                    <strong>Tecnologia:</strong> {selectedSolicitacao.tecnologia || "-"}
                  </p>
                  <p>
                    <strong>Rotas:</strong> {selectedSolicitacao.rotas || "-"}
                  </p>


                  {selectedSolicitacao.motivoCancelamento && (
                    <p>
                      <strong>Motivo do cancelamento: </strong>
                      {selectedSolicitacao.motivoCancelamento || "-"}
                    </p>
                  )}

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex justify-end gap-2">
                      {selectedSolicitacao.status === "pendente" && (
                        <Button
                          className="bg-yellow-500 text-white hover:bg-yellow-600 flex items-center gap-2"
                          onClick={() =>
                            atualizarStatus(
                              selectedSolicitacao.id,
                              "em tratativa",
                              selectedSolicitacao.emailAutor
                            )
                          }
                          disabled={statusLoading}
                        >
                          {statusLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            "Colocar em tratativa"
                          )}
                        </Button>
                      )}

                      {selectedSolicitacao.status === "em tratativa" && (
                        <>
                          <Button
                            className="bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
                            onClick={() =>
                              atualizarStatus(
                                selectedSolicitacao.id,
                                "concluido",
                                selectedSolicitacao.emailAutor
                              )
                            }
                            disabled={statusLoading}
                          >
                            {statusLoading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              "Concluir"
                            )}
                          </Button>
                          <Button
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() => setShowCancelInput(!showCancelInput)}
                            disabled={statusLoading}
                          >
                            Cancelar
                          </Button>
                        </>
                      )}

                      <Button
                        variant="outline"
                        className="bg-gray-500 text-white hover:bg-gray-600"
                        onClick={() => setSelectedSolicitacao(null)}
                        disabled={statusLoading}
                      >
                        Fechar
                      </Button>
                    </div>

                    {showCancelInput && (
                      <div className="flex flex-col gap-2 mt-2">
                        <Input
                          type="text"
                          placeholder="Motivo do cancelamento"
                          className="w-full border p-2 rounded"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          disabled={statusLoading}
                        />
                        <Button
                          className="bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
                          onClick={() =>
                            atualizarStatus(
                              selectedSolicitacao.id,
                              "cancelado",
                              selectedSolicitacao.emailAutor,
                              cancelReason
                            )
                          }
                          disabled={statusLoading}
                        >
                          {statusLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            "Enviar cancelamento"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {notification.message && (
          <div
            className={`fixed top-5 right-5 rounded-2xl py-2 px-4 z-50 transition-transform duration-500 ${notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
          >
            {notification.message}
          </div>
        )}
      </main>
    </div>
  );
}
