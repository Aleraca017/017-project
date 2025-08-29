"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Componente client-only para renderizar Markdown
const MarkdownViewer = dynamic(() => import("@/components/admin/MarkdownViewer"), { ssr: false });

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null); // Modal de detalhes (duplo clique)
  const [docProject, setDocProject] = useState(null); // Projeto selecionado para documentação
  const [readmeContent, setReadmeContent] = useState("");
  const [loadingReadme, setLoadingReadme] = useState(false);
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

  const statusColors = {
    andamento: "bg-yellow-400 text-black",
    concluido: "bg-green-500 text-white",
    cancelado: "bg-red-500 text-white",
    tratativa: "bg-gray-400 text-white",
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // Buscar projetos e usuários
  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projetos"));
      setProjects(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchProjects();
    fetchUsers();
  }, []);

  const handleEditClick = (project) => {
    setEditingProject(project);
    setIsCreating(false);
    setShowModal(true);
  };

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
      cliente: "",
    });
    setIsCreating(true);
    setShowModal(true);
  };

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
      cliente: editingProject.cliente,
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
        showNotification("Projeto criado com sucesso!");
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
        showNotification("Projeto atualizado com sucesso!");
      }
      setShowModal(false);
    } catch (err) {
      showNotification("Erro ao salvar projeto: " + err.message, "error");
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProject((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "linguagem" && { framework: "", tecnologia: "" }),
    }));
  };

  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.titulo?.toLowerCase().includes(term) ||
      p.descricao?.toLowerCase().includes(term) ||
      p.responsavelNome?.toLowerCase().includes(term)
    );
  });

  // Carregar README do GitHub
  const loadReadme = async (project) => {
    if (!project.githubUrl) {
      setReadmeContent("Nenhuma documentação disponível.");
      setDocProject(project);
      return;
    }

    try {
      setLoadingReadme(true);
      setDocProject(project);
      const apiUrl = project.githubUrl.replace(
        "github.com",
        "raw.githubusercontent.com"
      ).replace("/blob/", "/");

      const res = await fetch(`${apiUrl}/README.md`);
      const text = await res.text();
      setReadmeContent(text);
    } catch {
      setReadmeContent("Erro ao carregar documentação.");
    } finally {
      setLoadingReadme(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
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
                  onDoubleClick={() => loadReadme(p)}
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

        {/* Modal de documentação */}
        {typeof window !== "undefined" && docProject && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/85 z-50 text-black"
            onClick={() => setDocProject(null)}
          >
            <div
              className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 border overflow-y-auto max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold mb-4 text-purple-800 text-center">
                Documentação: {docProject.titulo}
              </h2>
              {loadingReadme ? (
                <p>Carregando documentação...</p>
              ) : (
                <MarkdownViewer content={readmeContent} />
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setDocProject(null)}
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
