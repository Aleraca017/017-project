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
  where,
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

  // Função para definir as cores de cada badge
const getBadgeStyle = (type, value) => {
  const base = "px-3 py-1 rounded-full text-xs font-medium";

  // Linguagens
  const linguagens = {
    JavaScript: "bg-yellow-100 text-yellow-800",
    Python: "bg-green-100 text-green-800",
    "C#": "bg-blue-100 text-blue-800",
    PHP: "bg-indigo-100 text-indigo-800",
    Java: "bg-red-100 text-red-800",
    Ruby: "bg-pink-100 text-pink-800",
  };

  // Frameworks
  const frameworks = {
    React: "bg-cyan-100 text-cyan-800",
    Angular: "bg-red-200 text-red-900",
    Vue: "bg-green-200 text-green-900",
    Vanilla: "bg-gray-200 text-gray-800",

    Django: "bg-green-300 text-green-900",
    Flask: "bg-gray-300 text-gray-900",
    FastAPI: "bg-emerald-200 text-emerald-900",

    Laravel: "bg-red-300 text-red-900",
    Symfony: "bg-gray-400 text-gray-900",
    CodeIgniter: "bg-orange-200 text-orange-900",

    Spring: "bg-green-400 text-green-900",
    JSF: "bg-blue-200 text-blue-900",
    Struts: "bg-gray-200 text-gray-900",

    "ASP.NET": "bg-blue-300 text-blue-900",
    Blazor: "bg-purple-200 text-purple-900",
    Unity: "bg-black text-white",

    Rails: "bg-red-400 text-white",
    Sinatra: "bg-pink-200 text-pink-900",
  };

  // Tecnologias
  const tecnologias = {
    "Next.JS": "bg-black text-white",
    "React Native": "bg-cyan-200 text-cyan-900",
    "Node.JS": "bg-green-200 text-green-900",
    Vanilla: "bg-gray-200 text-gray-800",

    NumPY: "bg-blue-200 text-blue-900",
    Pandas: "bg-teal-200 text-teal-900",
    TensorFlow: "bg-orange-200 text-orange-900",

    Composer: "bg-yellow-200 text-yellow-900",
    WordPress: "bg-blue-400 text-white",
    Drupal: "bg-blue-300 text-blue-900",

    "Spring Boot": "bg-green-500 text-white",
    Maven: "bg-red-500 text-white",
    Jenkins: "bg-gray-500 text-white",

    ".NETCore": "bg-purple-400 text-white",
    Xamarim: "bg-blue-500 text-white",
    "Unity Engine": "bg-black text-white",

    Rails: "bg-red-400 text-white",
    Sinatra: "bg-pink-200 text-pink-900",
  };

  if (type === "linguagem" && linguagens[value]) return `${base} ${linguagens[value]}`;
  if (type === "framework" && frameworks[value]) return `${base} ${frameworks[value]}`;
  if (type === "tecnologia" && tecnologias[value]) return `${base} ${tecnologias[value]}`;

  return `${base} bg-gray-200 text-gray-800`;
};


  // Estado para modal de projetos
  const [isProjetosModalOpen, setIsProjetosModalOpen] = useState(false);
  const [projetosCliente, setProjetosCliente] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

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
      return { text: "Vencido", classes: "bg-red-100 text-red-700" };
    }

    switch (cliente.statusContrato) {
      case "ativo":
        return { text: "Ativo", classes: "bg-green-100 text-green-700" };
      case "cancelado":
        return { text: "Cancelado", classes: "bg-red-100 text-red-700" };
      case "em_negociacao":
        return { text: "Em Negociação", classes: "bg-yellow-100 text-yellow-700" };
      default:
        return { text: cliente.statusContrato, classes: "bg-gray-100 text-gray-700" };
    }
  };

  // --- Projetos ---
  const buscarProjetos = async (cliente) => {
    const q = query(collection(db, "projetos"), where("cliente", "==", cliente.nome));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProjetosCliente(docs);
    setClienteSelecionado(cliente);
    setIsProjetosModalOpen(true);
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
              {clientes.map((c, i) => {
                const status = getStatusDisplay(c);
                return (
                  <tr
                    key={c.id}
                    onDoubleClick={() => buscarProjetos(c)}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors cursor-pointer`}
                  >
                    <td className="p-3 text-gray-800">{c.nome}</td>
                    <td className="p-3 text-gray-800">{c.email}</td>
                    <td className="p-3 text-gray-800">{c.telefone}</td>
                    <td className="p-3 text-gray-800 capitalize">{c.tipoContrato}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${status.classes}`}
                      >
                        {status.text}
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de criação/edição cliente */}
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
                  />{" "}
                  Pessoa Física (CPF)
                </label>
                <label>
                  <input
                    type="radio"
                    value="pj"
                    checked={formData.tipoPessoa === "pj"}
                    onChange={(e) => setFormData({ ...formData, tipoPessoa: e.target.value })}
                  />{" "}
                  Pessoa Jurídica (CNPJ)
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
                    onChange={(e) =>
                      setFormData({ ...formData, dataCadastro: e.target.value })
                    }
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Data de Vencimento</label>
                  <input
                    type="date"
                    value={formData.dataVencimento}
                    onChange={(e) =>
                      setFormData({ ...formData, dataVencimento: e.target.value })
                    }
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={clienteAtual ? handleUpdate : handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de projetos */}
      {isProjetosModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900">
        Projetos de {clienteSelecionado?.nome}
      </h2>

      {projetosCliente.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projetosCliente.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition bg-gray-50"
            >
              <h3 className="font-semibold text-gray-900 mb-1">
                {p.titulo || "Sem título"}
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                {p.descricao || "Sem descrição"}
              </p>

              <div className="flex flex-wrap gap-2">
  {p.linguagem && (
    <span className={getBadgeStyle("linguagem", p.linguagem)}>
      {p.linguagem}
    </span>
  )}
  {p.framework && (
    <span className={getBadgeStyle("framework", p.framework)}>
      {p.framework}
    </span>
  )}
  {p.tecnologia && (
    <span className={getBadgeStyle("tecnologia", p.tecnologia)}>
      {p.tecnologia}
    </span>
  )}
</div>

            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Nenhum projeto encontrado para este cliente.</p>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={() => setIsProjetosModalOpen(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
