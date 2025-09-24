"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format, differenceInDays } from "date-fns";

export default function PrazosPage() {
    const router = useRouter();

    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            const q = await getDocs(collection(db, "projetos"));
            setProjects(q.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };

        const fetchUsers = async () => {
            const q = await getDocs(collection(db, "usuarios"));
            setUsers(q.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };

        const fetchClients = async () => {
            const q = await getDocs(collection(db, "clientes"));
            setClients(q.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        };

        fetchProjects();
        fetchUsers();
        fetchClients();
    }, []);

    const filteredProjects = projects.filter((p) => {
        const term = searchTerm.toLowerCase();
        return (
            p.titulo?.toLowerCase().includes(term) ||
            p.clienteNome?.toLowerCase().includes(term) ||
            p.responsavelNome?.toLowerCase().includes(term)
        );
    });

    const getPrazoStatus = (dataEntrega) => {
        if (!dataEntrega) return { label: "Sem prazo", className: "bg-gray-400 text-black" };

        const hoje = new Date();
        const entrega = new Date(dataEntrega);
        const diff = differenceInDays(entrega, hoje);

        if (diff < 0) return { label: "Atrasado", className: "bg-red-600 text-white" };
        if (diff <= 5) return { label: "Perto do prazo", className: "bg-yellow-400 text-black" };
        return { label: "Dentro do prazo", className: "bg-green-500 text-white" };
    };

    return (
        <div className="flex min-h-screen bg-black">
            <Sidebar />
            <main className="flex-1 p-6">
                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-50">Controle de Prazos</h1>
                    <input
                        type="text"
                        placeholder="Pesquisar por título, cliente ou responsável..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="shadow-lg shadow-purple-950 focus:shadow-purple-700 rounded px-3 py-2 ring-2 ring-purple-600 outline-none placeholder-purple-400 text-gray-50"
                    />
                </div>

                {/* Tabela de prazos */}
                <div className="shadow rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-zinc-700 border-b-2 border-zinc-500">
                            <tr>
                                <th className="p-3 text-gray-50">Título</th>
                                <th className="p-3 text-gray-50">Cliente</th>
                                <th className="p-3 text-gray-50">Responsável</th>
                                <th className="p-3 text-gray-50">Data de Entrega</th>
                                <th className="p-3 text-gray-50">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((p, index) => {
                                const client = clients.find((c) => c.id === p.cliente);
                                const responsavel = users.find((u) => u.id === p.responsavel);

                                const prazo = getPrazoStatus(p.dataEntrega);

                                return (
                                    <tr
                                        key={p.id}
                                        className={`${index % 2 === 0 ? "bg-zinc-800" : "bg-zinc-900"
                                            } hover:bg-zinc-600 transition cursor-pointer`}
                                        onDoubleClick={() => router.push(`/admin/projetos/${p.id}`)}
                                    >
                                        <td className="p-3 text-zinc-50">{p.titulo || "-"}</td>
                                        <td className="p-3 text-zinc-50">
                                            {client?.nome || client?.empresa || "-"}
                                        </td>
                                        <td className="p-3 text-zinc-50">
                                            {responsavel?.nome || "-"}
                                        </td>
                                        <td className="p-3 text-zinc-50">
                                            {p.dataEntrega ? format(new Date(p.dataEntrega), "dd/MM/yyyy") : "-"}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${prazo.className}`}
                                            >
                                                {prazo.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
