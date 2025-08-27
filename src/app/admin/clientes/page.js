"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteAtual, setClienteAtual] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipoContrato: "fixo",
    statusContrato: "ativo",
    tipoPessoa: "pf",
    cpfCnpj: "",
    dataCadastro: "",
    dataVencimento: "",
  });

  useEffect(() => {
    buscarClientes();
  }, []);

  const buscarClientes = async () => {
    setLoading(true);
    const q = query(collection(db, "clientes"), orderBy("nome"), limit(10));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setClientes(docs);
    setLoading(false);
  };

  const handleOpenModal = () => {
    setFormData({
      nome: "",
      email: "",
      telefone: "",
      tipoContrato: "fixo",
      statusContrato: "ativo",
      tipoPessoa: "pf",
      cpfCnpj: "",
      dataCadastro: "",
      dataVencimento: "",
    });
    setClienteAtual(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    await addDoc(collection(db, "clientes"), formData);
    setIsModalOpen(false);
    buscarClientes();
  };

  const handleEdit = (cliente) => {
    setClienteAtual(cliente);
    setFormData(cliente);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    await updateDoc(doc(db, "clientes", clienteAtual.id), formData);
    setIsModalOpen(false);
    buscarClientes();
  };

  const handleDelete = async (cliente) => {
    await deleteDoc(doc(db, "clientes", cliente.id));
    buscarClientes();
  };

  const getStatusDisplay = (cliente) => {
  const hoje = new Date();

  if (cliente.dataVencimento && new Date(cliente.dataVencimento) < hoje) {
    return { text: "Vencido", color: "red" };
  }

  switch (cliente.statusContrato) {
    case "ativo":
      return { text: "Ativo", color: "green" };
    case "cancelado":
      return { text: "Cancelado", color: "red" };
    case "em_negociacao":
      return { text: "Em Negociação", color: "yellow" };
    default:
      return { text: cliente.statusContrato, color: "gray" };
  }
};


  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-white text-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <button
            onClick={handleOpenModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Novo Cliente
          </button>
        </div>
        {loading ? (
          <p>Carregando clientes...</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
  <thead className="bg-gray-100 border-b border-gray-200">
    <tr>
      <th className="p-3 text-left text-gray-700 font-medium">Nome/Nome da Empresa</th>
      <th className="p-3 text-left text-gray-700 font-medium">Email</th>
      <th className="p-3 text-left text-gray-700 font-medium">Telefone</th>
      <th className="p-3 text-left text-gray-700 font-medium">Tipo Contrato</th>
      <th className="p-3 text-left text-gray-700 font-medium">Status</th>
      <th className="p-3 text-left text-gray-700 font-medium">CPF/CNPJ</th>
      <th className="p-3 text-left text-gray-700 font-medium">Ações</th>
    </tr>
  </thead>
  <tbody>
    {clientes.map((c, i) => (
      <tr
        key={c.id}
        className={`${
          i % 2 === 0 ? "bg-white" : "bg-gray-50"
        } hover:bg-blue-50 transition-colors`}
      >
        <td className="p-3 text-gray-800">{c.nome}</td>
        <td className="p-3 text-gray-800 hover:underline hover:text-blue-900"><a href={"mailto:"+c.email}>{c.email}</a></td>
        <td className="p-3 text-gray-800">{c.telefone}</td>
        <td className="p-3 text-gray-800 capitalize">{c.tipoContrato}</td>
        <td className="p-3">
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${
      getStatusDisplay(c).color === "red"
        ? "bg-red-100 text-red-700"
        : getStatusDisplay(c).color === "green"
        ? "bg-green-100 text-green-700"
        : getStatusDisplay(c).color === "yellow"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {getStatusDisplay(c).text}
  </span>
</td>

        <td className="p-3 text-gray-800">{c.cpfCnpj}</td>
        <td className="p-3 flex gap-2">
          <button
            onClick={() => handleEdit(c)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
          >
            Visualizar/Editar
          </button>
          <button
            onClick={() => handleDelete(c)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Excluir
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        )}
      </div>

      {/* Modal de criação/edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {clienteAtual ? "Visualizar/Editar Cliente" : "Cadastrar Novo Cliente"}
            </h2>
            <div className="space-y-4 text-gray-800">
              <input
                type="text"
                placeholder="Nome ou Nome da Empresa"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full border rounded p-2"
              />
              <select
                value={formData.tipoContrato}
                onChange={(e) => setFormData({ ...formData, tipoContrato: e.target.value })}
                className="w-full border rounded p-2"
              >
                <option value="fixo">Contrato Fixo</option>
                <option value="recorrente">Contrato Recorrente</option>
              </select>
              <select
                value={formData.statusContrato}
                onChange={(e) => setFormData({ ...formData, statusContrato: e.target.value })}
                className="w-full border rounded p-2"
              >
                <option value="ativo">Status Ativo</option>
                <option value="cancelado">Status Cancelado</option>
                <option value="em_negociacao">Em Negociação</option>
              </select>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    value="pf"
                    checked={formData.tipoPessoa === "pf"}
                    onChange={(e) => setFormData({ ...formData, tipoPessoa: e.target.value })}
                  /> Pessoa Física (CPF)
                </label>
                <label>
                  <input
                    type="radio"
                    value="pj"
                    checked={formData.tipoPessoa === "pj"}
                    onChange={(e) => setFormData({ ...formData, tipoPessoa: e.target.value })}
                  /> Pessoa Jurídica (CNPJ)
                </label>
              </div>
              <input
                type="text"
                placeholder={formData.tipoPessoa === "pf" ? "CPF" : "CNPJ"}
                value={formData.cpfCnpj}
                onChange={(e) => setFormData({ ...formData, cpfCnpj: e.target.value })}
                className="w-full border rounded p-2"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data de Cadastro</label>
                  <input
                    type="date"
                    value={formData.dataCadastro}
                    onChange={(e) => setFormData({ ...formData, dataCadastro: e.target.value })}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Data de Vencimento</label>
                  <input
                    type="date"
                    value={formData.dataVencimento}
                    onChange={(e) => setFormData({ ...formData, dataVencimento: e.target.value })}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              <button onClick={clienteAtual ? handleUpdate : handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
