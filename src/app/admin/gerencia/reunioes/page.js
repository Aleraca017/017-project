"use client";

import AdminGuard from "@/components/security/AdminGuard";
import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function ReunioesPage() {
  const [date, setDate] = useState(new Date());
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDayMeetings, setSelectedDayMeetings] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [reunioes, setReunioes] = useState([]);
  const [newMeeting, setNewMeeting] = useState({ data: "", hora: "", cliente: "" });
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);

  // Dropdown state
  const [openYears, setOpenYears] = useState({});
  const [openMonths, setOpenMonths] = useState({});
  const [openDays, setOpenDays] = useState({});

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch("/api/reunioes/clientes");
        if (!res.ok) throw new Error("Erro ao buscar clientes");
        const data = await res.json();
        setClientes(data);
      } catch (error) {
        console.error(error);
        showMsg("error", "Erro ao buscar clientes");
      }
    };
    fetchClientes();
  }, []);

  // Buscar reuniões somente depois dos clientes
  useEffect(() => {
    if (!clientes.length) return;
    const fetchReunioes = async () => {
      try {
        const res = await fetch("/api/reunioes");
        if (!res.ok) throw new Error("Erro ao carregar reuniões");
        const data = await res.json();
        setReunioes(data);
      } catch (err) {
        console.error(err);
        showMsg("error", "Erro ao carregar reuniões");
      }
    };
    fetchReunioes();
  }, [clientes]);

  const handleCreateMeeting = async () => {
    if (!newMeeting.data || !newMeeting.hora || !newMeeting.cliente) {
      showMsg("error", "Preencha todos os campos");
      return;
    }

    const clienteNome =
      clientes.find((c) => c.id === newMeeting.cliente)?.nome || "";

    try {
      // 1️⃣ Criar reunião no Firestore
      const res = await fetch("/api/reunioes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMeeting),
      });

      if (!res.ok) throw new Error("Erro ao criar reunião");
      const created = await res.json();

      setReunioes((prev) => [...prev, created]);
      setNewMeeting({ data: "", hora: "", cliente: "" });
      setShowNewModal(false);

      showMsg("success", "Reunião criada com sucesso!");

      // 2️⃣ Criar evento no Google Agenda
      const [hour, minute] = created.hora.split(":").map(Number);
      const startDate = new Date(`${created.data}T${created.hora}:00-03:00`);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1h

      const googleRes = await fetch("/api/reunioes/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: `Reunião com ${clienteNome}`,
          description: `Reunião agendada via sistema`,
          start: {
            dateTime: startDate.toISOString(),
            timeZone: "America/Sao_Paulo",
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: "America/Sao_Paulo",
          },
          attendees: [],
        }),
      });

      if (!googleRes.ok) {
        const err = await googleRes.json();
        console.error("Erro ao criar evento no Google Agenda:", err);
        showMsg(
          "error",
          "Reunião criada, mas não foi possível adicionar ao Google Agenda."
        );
      } else {
        showMsg("success", "Reunião adicionada ao Google Agenda!");
      }
    } catch (err) {
      showMsg("error", "Erro ao criar reunião");
      console.error(err);
    }
  };





  const handleSaveEdit = async () => {
    if (!editingMeeting.data || !editingMeeting.hora || !editingMeeting.cliente) {
      showMsg("error", "Preencha todos os campos");
      return;
    }

    const clienteNome = clientes.find(c => c.id === editingMeeting.cliente)?.nome || "";

    try {
      // 1️⃣ Atualizar reunião no Firestore
      const res = await fetch(`/api/reunioes/${editingMeeting.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMeeting),
      });
      if (!res.ok) throw new Error("Erro ao atualizar reunião");
      const updated = await res.json();
      setReunioes(prev => prev.map(r => (r.id === updated.id ? updated : r)));
      setEditingMeeting(null);
      setShowEditModal(false);
      showMsg("success", "Reunião atualizada com sucesso!");

      // 2️⃣ Atualizar evento no Google Agenda
      await fetch("/api/reunioes/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: editingMeeting.googleEventId, // se você já armazenou
          data: updated.data,
          hora: updated.hora,
          clienteNome,
        }),
      });

    } catch (err) {
      showMsg("error", "Erro ao atualizar reunião");
      console.error(err);
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta reunião?")) return;
    try {
      const res = await fetch(`/api/reunioes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir reunião");
      setReunioes((prev) => prev.filter((r) => r.id !== id));
      setShowEditModal(false);
      setShowDayModal(false);
      showMsg("success", "Reunião excluída com sucesso!");
    } catch (err) {
      console.error(err);
      showMsg("error", "Erro ao excluir reunião");
    }
  };

  const handleDayClick = (day) => {
    const dateStr = day.toISOString().split("T")[0];
    const meetingsForDay = reunioes.filter((r) => r.data === dateStr);
    setSelectedDayMeetings(meetingsForDay);
    setShowDayModal(true);
  };

  const handleEditMeeting = (meeting) => {
    setEditingMeeting(meeting);
    setShowEditModal(true);
  };

  const filteredReunioes = useMemo(() => {
    if (!search) return reunioes;
    return reunioes.filter((r) => {
      const cliente = clientes.find((c) => c.id === r.cliente);
      return cliente?.nome?.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, reunioes, clientes]);

  const grouped = useMemo(() => {
    const acc = {};
    filteredReunioes.forEach((r) => {
      const [year, month, day] = r.data.split("-");
      acc[year] = acc[year] || {};
      acc[year][month] = acc[year][month] || {};
      acc[year][month][day] = acc[year][month][day] || [];
      acc[year][month][day].push(r);
    });
    return acc;
  }, [filteredReunioes]);

  const getClienteNome = (clienteId) => clientes.find((c) => c.id === clienteId)?.nome || "Cliente não encontrado";

  const toggleYear = (year) => setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }));
  const toggleMonth = (year, month) =>
    setOpenMonths((prev) => ({ ...prev, [`${year}-${month}`]: !prev[`${year}-${month}`] }));
  const toggleDay = (year, month, day) =>
    setOpenDays((prev) => ({ ...prev, [`${year}-${month}-${day}`]: !prev[`${year}-${month}-${day}`] }));



  // Função para criar evento no Google Calendar
  const addToGoogleCalendar = async (meeting) => {
    try {
      const res = await fetch("/api/reunioes/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: `Reunião com ${getClienteNome(meeting.cliente)}`,
          description: `Reunião agendada via sistema`,
          start: `${meeting.data}T${meeting.hora}:00-03:00`,
          end: `${meeting.data}T${meeting.hora}:00-03:00`,
          attendees: [], // opcional: emails dos convidados
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar evento no Calendar");
      const data = await res.json();
      console.log("Evento criado no Google Calendar:", data);
      showMsg("success", "Evento adicionado ao Google Calendar!");
    } catch (err) {
      console.error(err);
      showMsg("error", "Não foi possível adicionar no Google Calendar");
    }
  };

  return (
    <AdminGuard>
      <div className="flex h-screen bg-black  ">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4 text-gray-50">Reuniões</h1>

          {message && (
            <div
              className={`p-3 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {message.text}
            </div>
          )}

          {/* Busca e botão */}
          <div className="flex items-center justify-between mb-6">
            <Input placeholder="Buscar por cliente..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm bg-zinc-900 border-0 text-white" />
            <button onClick={() => setShowNewModal(true)} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer">
              + Nova Reunião
            </button>
          </div>

          {/* Calendário */}
          <div className="bg-zinc-950 rounded-lg shadow p-4 mb-6">
            <Calendar onChange={setDate} value={date} onClickDay={handleDayClick} className="border rounded-lg shadow bg-white p-3" />
          </div>

          {/* Lista agrupada com dropdown */}
          <div className="space-y-4">
            {Object.entries(grouped).map(([year, months]) => (
              <div key={year} className="rounded-lg border-0 shadow">
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full text-left px-4 py-2 font-bold bg-zinc-800 hover:bg-zinc-900 border-0 flex justify-between items-center rounded-lg rounded-br-none text-white hover:cursor-pointer"
                >
                  {year} {openYears[year] ? "▲" : "▼"}
                </button>

                {openYears[year] &&
                  Object.entries(months).map(([month, days]) => (
                    <div key={month} className="ml-4">
                      <button
                        onClick={() => toggleMonth(year, month)}
                        className="w-full text-left px-4 py-1 font-medium bg-zinc-700 hover:bg-zinc-900 flex justify-between items-center text-white hover:cursor-pointer rounded-bl-lg"
                      >
                        {new Date(year, month - 1).toLocaleString("pt-BR", { month: "long" })}{" "}
                        {openMonths[`${year}-${month}`] ? "▲" : "▼"}
                      </button>

                      {openMonths[`${year}-${month}`] &&
                        Object.entries(days).map(([day, meetings]) => (
                          <div key={day} className="ml-4 mb-2">
                            <button
                              onClick={() => toggleDay(year, month, day)}
                              className="w-full text-left px-4 py-1 bg-zinc-800 hover:bg-zinc-900 flex justify-between items-center text-white hover:cursor-pointer rounded-bl-lg"
                            >
                              {day}/{month}/{year} {openDays[`${year}-${month}-${day}`] ? "▲" : "▼"}
                            </button>

                            {openDays[`${year}-${month}-${day}`] && (
                              <ul className="ml-4 list-disc space-y-1">
                                {meetings.map((r) => (
                                  <li key={r.id} className="flex justify-between items-center gap-2 px-5 py-5 bg-purple-700 text-white">
                                    {r.hora} - {getClienteNome(r.cliente)}
                                    <div className="flex gap-2">
                                      <button onClick={() => handleEditMeeting(r)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 hover:cursor-pointer">
                                        Editar
                                      </button>
                                      <button onClick={() => handleDeleteMeeting(r.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer">
                                        Excluir
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Modal Nova Reunião */}
          <Dialog open={showNewModal} onOpenChange={setShowNewModal} >
            <DialogContent className="max-w-100">
              <DialogHeader>
                <DialogTitle>Nova Reunião</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  type="date"
                  value={newMeeting.data}
                  onChange={(e) =>
                    setNewMeeting((prev) => ({ ...prev, data: e.target.value }))
                  }
                />
                <Input
                  type="time"
                  value={newMeeting.hora}
                  onChange={(e) =>
                    setNewMeeting((prev) => ({ ...prev, hora: e.target.value }))
                  }
                />
                <select
                  value={newMeeting.cliente}
                  onChange={(e) =>
                    setNewMeeting((prev) => ({ ...prev, cliente: e.target.value }))
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCreateMeeting}
                  className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 hover:cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal Editar Reunião */}
          <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
            <DialogContent className="max-w-100">
              <DialogHeader>
                <DialogTitle>Editar Reunião</DialogTitle>
              </DialogHeader>
              {editingMeeting && (
                <div className="space-y-3">
                  <Input
                    type="date"
                    value={editingMeeting.data}
                    onChange={(e) =>
                      setEditingMeeting((prev) => ({ ...prev, data: e.target.value }))
                    }
                  />
                  <Input
                    type="time"
                    value={editingMeeting.hora}
                    onChange={(e) =>
                      setEditingMeeting((prev) => ({ ...prev, hora: e.target.value }))
                    }
                  />
                  <select
                    value={editingMeeting.cliente}
                    onChange={(e) =>
                      setEditingMeeting((prev) => ({
                        ...prev,
                        cliente: e.target.value,
                      }))
                    }
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSaveEdit}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Modal do Dia */}
          <Dialog open={showDayModal} onOpenChange={setShowDayModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reuniões do dia</DialogTitle>
              </DialogHeader>
              {selectedDayMeetings.length === 0 ? (
                <p>Nenhuma reunião para este dia.</p>
              ) : (
                <ul className="space-y-2">
                  {selectedDayMeetings.map((r) => (
                    <li key={r.id} className="flex justify-between items-center">
                      {r.hora} - {getClienteNome(r.cliente)}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditMeeting(r)}
                          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteMeeting(r.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </AdminGuard>
  );
}
