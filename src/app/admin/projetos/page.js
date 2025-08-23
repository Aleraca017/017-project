"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null); // Modal de detalhes (duplo clique)
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Opções dependentes
  const languages = ["JavaScript", "Python", "PHP", "Java", "C#", "Ruby"];
  const frameworksMap = {
    JavaScript: ["React", "Angular", "Vue", "Vanilla JS"],
    Python: ["Django", "Flask", "FastAPI"],
    PHP: ["Laravel", "Symfony", "CodeIgniter"],
    Java: ["Spring", "JSF", "Struts"],
    "C#": ["ASP.NET", "Blazor", "Unity"],
    Ruby: ["Rails", "Sinatra"],
  };
  const technologiesMap = {
    JavaScript: ["Next.js", "React Native", "Node.js", "Vanilla JS"],
    Python: ["NumPy", "Pandas", "TensorFlow"],
    PHP: ["Composer", "WordPress", "Drupal"],
    Java: ["Spring Boot", "Maven", "Jenkins"],
    "C#": [".NET Core", "Xamarin", "Unity Engine"],
    Ruby: ["Rails", "Sinatra"],
  };

  // Cores dos status (rótulos tipo "botão")
  const statusColors = {
    andamento: "bg-yellow-400 text-black",
    concluido: "bg-green-500 text-white",
    cancelado: "bg-red-500 text-white",
    tratativa: "bg-gray-400 text-white",
  };

  // Notificação no topo
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // Buscar projetos e usuários
  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projetos"));
      const projectList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectList);
    };

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };

    fetchProjects();
    fetchUsers();
  }, []);

  // Abrir modal de edição
  const handleEditClick = (project) => {
    setEditingProject(project);
    setIsCreating(false);
    setShowModal(true);
  };

  // Abrir modal de criação
  const handleCreateClick = () => {
    setEditingProject({
      titulo: "",
      descricao: "",
      status: "andamento",
      responsavel: "",
      linguagem: "",
      framework: "",
      tecnologia: "",
      autor: "",
    });
    setIsCreating(true);
    setShowModal(true);
  };

  // Salvar (criar/editar)
  const handleSave = async () => {
    const user = users.find((u) => u.id === editingProject.responsavel);

    const projectData = {
      titulo: editingProject.titulo?.trim(),
      descricao: editingProject.descricao?.trim(),
      status: editingProject.status,
      responsavel: editingProject.responsavel,
      responsavelNome: user?.nome || "",
      responsavelEmail: user?.email || "",
      linguagem: editingProject.linguagem,
      framework: editingProject.framework,
      tecnologia: editingProject.tecnologia,
      autor: editingProject.autor,
    };

    try {
      if (isCreating) {
        const res = await fetch("/api/projetos/create-projeto", {
          method: "POST",
          body: JSON.stringify(projectData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setProjects((prev) => [...prev, { id: data.docId, ...projectData }]);
        showNotification("Projeto criado com sucesso!", "success");
      } else {
        const res = await fetch("/api/projetos/update-projeto", {
          method: "POST",
          body: JSON.stringify({ docId: editingProject.id, ...projectData }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? { ...p, ...projectData } : p))
        );
        showNotification("Projeto atualizado com sucesso!", "success");
      }

      setShowModal(false);
    } catch (err) {
      showNotification("Erro ao salvar projeto: " + err.message, "error");
    }
  };

  // Excluir
  const handleDelete = async (docId) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    try {
      const res = await fetch("/api/projetos/delete-projeto", {
        method: "POST",
        body: JSON.stringify({ docId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProjects((prev) => prev.filter((p) => p.id !== docId));
      showNotification("Projeto excluído com sucesso!", "success");
    } catch (err) {
      showNotification("Erro ao excluir projeto: " + err.message, "error");
    }
  };

  // Mudança nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProject((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "linguagem" && { framework: "", tecnologia: "" }),
    }));
  };

  // Filtro de busca
  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.titulo?.toLowerCase().includes(term) ||
      p.descricao?.toLowerCase().includes(term) ||
      p.responsavelNome?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        {/* Notificação */}
<AnimatePresence>
  {notification.message && (
    <motion.div
      key="notification"
      initial={{ x: 400, opacity: 0 }} 
      animate={{ x: -40, opacity: 1 }} 
      exit={{ x: 400, opacity: 0 }} 
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={`fixed top-20 rounded-2xl -right-15 w-80 text-left py-2 px-4 z-50 shadow-lg ${
        notification.type === "success"
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
      }`}
    >
      {notification.message}
    </motion.div>
  )}
</AnimatePresence>

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Projetos</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Pesquisar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-purple-400 rounded px-3 py-2 ring-2 ring-purple-600 outline-none placeholder-purple-400 text-gray-600"
            />
            <button
              onClick={handleCreateClick}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer"
            >
              + Criar Projeto
            </button>
          </div>
        </div>

        {/* Lista de projetos */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-gray-700">Título</th>
                <th className="p-3 text-gray-700">Descrição</th>
                <th className="p-3 text-gray-700">Status</th>
                <th className="p-3 text-gray-700">Responsável</th>
                <th className="p-3 text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p, index) => (
                <tr
                  key={p.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  } hover:bg-gray-200 transition cursor-pointer`}
                  onDoubleClick={() => setSelectedProject(p)} 
                >
                  <td className="p-3 text-gray-800">{p.titulo || "-"}</td>
                  <td className="p-3 text-gray-800">{p.descricao || "-"}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[p.status] || "bg-gray-300 text-black"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full bg-purple-200 text-purple-800 text-sm">
                      {p.responsavelNome || "-"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de criação/edição */}
        {showModal && editingProject && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 border">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {isCreating ? "Criar Projeto" : "Editar Projeto"}
              </h2>

              {/* Responsável */}
              <label className="block mb-2 text-gray-700">
                Responsável
                <select
                  name="responsavel"
                  value={editingProject.responsavel || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="">Selecione um responsável</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nome} ({u.email})
                    </option>
                  ))}
                </select>
              </label>

              {/* Título */}
              <label className="block mb-2 text-gray-700">
                Título
                <input
                  type="text"
                  name="titulo"
                  value={editingProject.titulo || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </label>

              {/* Descrição */}
              <label className="block mb-2 text-gray-700">
                Descrição
                <textarea
                  name="descricao"
                  value={editingProject.descricao || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </label>

              {/* Status */}
              <label className="block mb-2 text-gray-700">
                Status
                <select
                  name="status"
                  value={editingProject.status || "andamento"}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="andamento">Em andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="tratativa">Em tratativa</option>
                </select>
              </label>

              {/* Linguagem */}
              <label className="block mb-2 text-gray-700">
                Linguagem
                <select
                  name="linguagem"
                  value={editingProject.linguagem || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="">Selecione uma linguagem</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </label>

              {/* Framework */}
              <label className="block mb-2 text-gray-700">
                Framework
                <select
                  name="framework"
                  value={editingProject.framework || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                  disabled={!editingProject.linguagem}
                >
                  <option value="">Selecione um framework</option>
                  {frameworksMap[editingProject.linguagem]?.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>

              {/* Tecnologia */}
              <label className="block mb-2 text-gray-700">
                Tecnologia
                <select
                  name="tecnologia"
                  value={editingProject.tecnologia || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                  disabled={!editingProject.linguagem}
                >
                  <option value="">Selecione uma tecnologia</option>
                  {technologiesMap[editingProject.linguagem]?.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              {/* Autor */}
              <label className="block mb-4 text-gray-700">
                Autor
                <input
                  type="text"
                  name="autor"
                  value={editingProject.autor || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </label>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition cursor-pointer text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer transition"
                >
                  {isCreating ? "Criar" : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalhes (abre com duplo clique) */}
        {selectedProject && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/85 z-50 text-black"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 border"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold mb-4 text-purple-800 text-center">
                Detalhes do Projeto
              </h2>

              <p>
                <strong>Título:</strong> {selectedProject.titulo || "-"}
              </p>
              <p>
                <strong>Descrição:</strong> {selectedProject.descricao || "-"}
              </p>
              <p className="flex items-center gap-2">
                <strong>Status:</strong>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    statusColors[selectedProject.status] || "bg-gray-300 text-black"
                  }`}
                >
                  {selectedProject.status}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <strong>Responsável:</strong>
                <span className="px-2 py-1 rounded-full bg-purple-200 text-purple-800 text-sm">
                  {selectedProject.responsavelNome || "-"}
                </span>
              </p>

              <hr className="my-3" />

              <p>
                <strong>Linguagem:</strong> {selectedProject.linguagem || "-"}
              </p>
              <p>
                <strong>Framework:</strong> {selectedProject.framework || "-"}
              </p>
              <p>
                <strong>Tecnologia:</strong> {selectedProject.tecnologia || "-"}
              </p>
              <p>
                <strong>Autor:</strong> {selectedProject.autor || "-"}
              </p>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
