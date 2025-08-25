"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { db } from "@/lib/firebase";
import { getFirestore, collection, query, where, orderBy, limit, startAfter, getDocs } from "firebase/firestore";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [filtroContrato, setFiltroContrato] = useState("");
  const [lastDoc, setLastDoc] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, [search, filtroContrato]);

  async function fetchClientes(next = false) {
    try {
      const q = query(
        collection(db, "clientes"),
        ...(search ? [where("nome", ">=", search), where("nome", "<=", search + "\uf8ff")] : []),
        ...(filtroContrato ? [where("tipoContrato", "==", filtroContrato)] : []),
        orderBy("nome"),
        limit(10)
      );

      const snapshot = await getDocs(q);
      setClientes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar />
      <div className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Clientes</h1>

        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nome ou email"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filtroContrato}
            onChange={e => setFiltroContrato(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os contratos</option>
            <option value="recorrente">Recorrente</option>
            <option value="avulso">Avulso</option>
          </select>
        </div>

        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Telefone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Tipo de contrato</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Data de cadastro</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Data de vencimento</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length > 0 ? (
                clientes.map(c => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{c.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.telefone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.tipoContrato}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.status || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.dataCadastro ? new Date(c.dataCadastro.seconds * 1000).toLocaleDateString() : "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.dataVencimento ? new Date(c.dataVencimento.seconds * 1000).toLocaleDateString() : "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">Nenhum cliente encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
