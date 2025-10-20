//front end definer
"use client";

// react imports
import { useState, useEffect } from "react";

// security imports
import AdminGuard from "@/components/security/AdminGuard";
import CheckUserPermission from "@/components/security/CheckUserPermission";

// firebase imports
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

// visual components imports
import Sidebar from "@/components/admin/Sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  const buscarProjetos = async (cliente) => {
    const q = query(collection(db, "projetos"), where("cliente", "==", cliente.id));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProjetosCliente(docs);
    setClienteSelecionado(cliente);
    setIsProjetosModalOpen(true);
  };

  return (
    <div className="bg-[url(/images/restrict/bg-cyberpunk.jpg)] bg-cover">
      <AdminGuard>
        <CheckUserPermission>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 bg-black/40 backdrop-blur-sm text-gray-50">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Clientes</h1>
                <Button onClick={handleOpenModal} className="bg-blue-600 hover:bg-blue-700">
                  Novo Cliente
                </Button>
              </div>

              {loading ? (
                <p>Carregando clientes...</p>
              ) : (
                <table className="w-full rounded-lg overflow-hidden shadow-sm">
                  <thead className="bg-zinc-700 border-b-2 border-zinc-500">
                    <tr>
                      <th className="p-3 text-left text-gray-50 font-medium">Nome/Nome da Empresa</th>
                      <th className="p-3 text-left text-gray-50 font-medium">Email</th>
                      <th className="p-3 text-left text-gray-50 font-medium">Telefone</th>
                      <th className="p-3 text-left text-gray-50 font-medium">Tipo Contrato</th>
                      <th className="p-3 text-left text-gray-50 font-medium">Status</th>
                      <th className="p-3 text-left text-gray-50 font-medium">CPF/CNPJ</th>
                      <th className="p-3 text-left text-gray-50 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c, i) => {
                      const status = c.dataVencimento && new Date(c.dataVencimento) < new Date()
                        ? { text: "Vencido", classes: "bg-red-100 text-red-700" }
                        : c.statusContrato === "ativo"
                          ? { text: "Ativo", classes: "bg-green-100 text-green-700" }
                          : c.statusContrato === "cancelado"
                            ? { text: "Cancelado", classes: "bg-red-100 text-red-700" }
                            : c.statusContrato === "em_negociacao"
                              ? { text: "Em Negociação", classes: "bg-yellow-100 text-yellow-700" }
                              : { text: c.statusContrato, classes: "bg-gray-100 text-gray-700" };

                      return (
                        <tr
                          key={c.id}
                          onDoubleClick={() => buscarProjetos(c)}
                          className={`${i % 2 === 0 ? "bg-zinc-800" : "bg-zinc-900"} hover:bg-zinc-700 transition-colors cursor-pointer`}
                        >
                          <td className="p-3 text-gray-50">{c.nome}</td>
                          <td className="p-3 text-gray-50">{c.email}</td>
                          <td className="p-3 text-gray-50">{c.telefone}</td>
                          <td className="p-3 text-gray-50 capitalize">{c.tipoContrato}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.classes}`}>
                              {status.text}
                            </span>
                          </td>
                          <td className="p-3 text-gray-50">{c.cpfCnpj}</td>
                          <td className="p-3 flex gap-2">
                            <Button onClick={() => handleEdit(c)} className="bg-yellow-500 hover:bg-yellow-600">
                              Visualizar/Editar
                            </Button>
                            <Button onClick={() => handleDelete(c)} className="bg-red-500 hover:bg-red-600">
                              Excluir
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Modal de criação/edição cliente */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{clienteAtual ? "Visualizar/Editar Cliente" : "Cadastrar Novo Cliente"}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-2 text-gray-800">
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

              <DialogFooter className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={clienteAtual ? handleUpdate : handleSave}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal de projetos do cliente */}
          <Dialog open={isProjetosModalOpen} onOpenChange={setIsProjetosModalOpen}>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Projetos de {clienteSelecionado?.nome}</DialogTitle>
              </DialogHeader>

              {projetosCliente.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {projetosCliente.map((p) => (
                    <div key={p.id} className="border rounded-xl p-4 shadow hover:shadow-md transition bg-gray-50">
                      <h3 className="font-semibold text-gray-900 mb-1">{p.titulo || "Sem título"}</h3>
                      <p className="text-sm text-gray-700 mb-3">{p.descricao || "Sem descrição"}</p>
                      {/* Badges podem ser mantidas */}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mt-2">Nenhum projeto encontrado para este cliente.</p>
              )}

              <DialogFooter className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setIsProjetosModalOpen(false)}>Fechar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CheckUserPermission>
      </AdminGuard >
    </div>
  );
}
