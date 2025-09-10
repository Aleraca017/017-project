"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

//shadcn
  import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
//calendario
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);


  

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

  // Cores dos status
  const statusColors = {
    andamento: "bg-yellow-400 text-black",
    concluido: "bg-green-500 text-white",
    cancelado: "bg-red-500 text-white",
    tratativa: "bg-gray-400 text-white",
  };

  // Badges coloridos (linguagem, framework, tecnologia)
  const languageColors = {
    JavaScript: "bg-yellow-100 text-yellow-800 ring-yellow-300",
    Python: "bg-blue-100 text-blue-800 ring-blue-300",
    PHP: "bg-indigo-100 text-indigo-800 ring-indigo-300",
    Java: "bg-orange-100 text-orange-800 ring-orange-300",
    "C#": "bg-violet-100 text-violet-800 ring-violet-300",
    Ruby: "bg-rose-100 text-rose-800 ring-rose-300",
  };
  const frameworkColors = {
    React: "bg-cyan-100 text-cyan-800 ring-cyan-300",
    Angular: "bg-red-100 text-red-800 ring-red-300",
    Vue: "bg-emerald-100 text-emerald-800 ring-emerald-300",
    "Vanilla JS": "bg-yellow-50 text-yellow-700 ring-yellow-200",
    Django: "bg-green-100 text-green-800 ring-green-300",
    Flask: "bg-slate-100 text-slate-800 ring-slate-300",
    FastAPI: "bg-teal-100 text-teal-800 ring-teal-300",
    Laravel: "bg-red-50 text-red-700 ring-red-200",
    Symfony: "bg-stone-100 text-stone-800 ring-stone-300",
    CodeIgniter: "bg-amber-100 text-amber-800 ring-amber-300",
    Spring: "bg-lime-100 text-lime-800 ring-lime-300",
    JSF: "bg-gray-100 text-gray-800 ring-gray-300",
    Struts: "bg-zinc-100 text-zinc-800 ring-zinc-300",
    "ASP.NET": "bg-blue-50 text-blue-700 ring-blue-200",
    Blazor: "bg-purple-100 text-purple-800 ring-purple-300",
    Unity: "bg-black/5 text-black ring-black/20",
    Rails: "bg-rose-50 text-rose-700 ring-rose-200",
    Sinatra: "bg-pink-100 text-pink-800 ring-pink-300",
  };
  const technologyColors = {
    "Next.js": "bg-neutral-100 text-neutral-800 ring-neutral-300",
    "React Native": "bg-sky-100 text-sky-800 ring-sky-300",
    "Node.js": "bg-green-50 text-green-700 ring-green-200",
    "Vanilla JS": "bg-yellow-50 text-yellow-700 ring-yellow-200",
    NumPy: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    Pandas: "bg-slate-50 text-slate-700 ring-slate-200",
    TensorFlow: "bg-orange-50 text-orange-700 ring-orange-200",
    Composer: "bg-amber-50 text-amber-700 ring-amber-200",
    WordPress: "bg-blue-100 text-blue-800 ring-blue-300",
    Drupal: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    "Spring Boot": "bg-lime-50 text-lime-700 ring-lime-200",
    Maven: "bg-red-100 text-red-800 ring-red-300",
    Jenkins: "bg-gray-50 text-gray-700 ring-gray-200",
    ".NET Core": "bg-violet-50 text-violet-700 ring-violet-200",
    Xamarin: "bg-blue-50 text-blue-700 ring-blue-200",
    "Unity Engine": "bg-black/5 text-black ring-black/20",
    Rails: "bg-rose-50 text-rose-700 ring-rose-200",
    Sinatra: "bg-pink-50 text-pink-700 ring-pink-200",
  };
  const badgeBase =
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset";

  const getLangBadge = (val) =>
    `${badgeBase} ${languageColors[val] || "bg-gray-100 text-gray-800 ring-gray-300"}`;
  const getFrameworkBadge = (val) =>
    `${badgeBase} ${frameworkColors[val] || "bg-gray-100 text-gray-800 ring-gray-300"}`;
  const getTechBadge = (val) =>
    `${badgeBase} ${technologyColors[val] || "bg-gray-100 text-gray-800 ring-gray-300"}`;

  // Notificação
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // Verifica claim admin do Firebase Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Buscar projetos, usuários e clientes
  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projetos"));
      setProjects(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      setClients(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchProjects();
    fetchUsers();
    fetchClients();
  }, []);

  // Funções de criação/edição/exclusão agora usam isAdmin
  const handleEditClick = (project) => {
    if (!isAdmin) return showNotification("Apenas admins podem editar!", "error");
    setEditingProject(project);
    setIsCreating(false);
    setShowModal(true);
  };

  const handleCreateClick = () => {
    if (!isAdmin) return showNotification("Apenas admins podem criar!", "error");
    setEditingProject({
      titulo: "",
      descricao: "",
      status: "andamento",
      responsavel: "",
      cliente: "",
      linguagem: "",
      framework: "",
      tecnologia: "",
      autor: "",
      githubUrl: "",
      tipo: editingProject.tipo || "",
      dataEntrega: editingProject.dataEntrega || "",
    });
    setIsCreating(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!isAdmin) return showNotification("Apenas admins podem salvar!", "error");

    const user = users.find((u) => u.id === editingProject.responsavel);
    const client = clients.find((c) => c.id === editingProject.cliente);

    const projectData = {
      titulo: editingProject.titulo?.trim(),
      descricao: editingProject.descricao?.trim(),
      status: editingProject.status,
      responsavel: editingProject.responsavel,
      responsavelNome: user?.nome || "",
      responsavelEmail: user?.email || "",
      cliente: editingProject.cliente,
      clienteNome: client?.nome || client?.empresa || "",
      linguagem: editingProject.linguagem,
      framework: editingProject.framework,
      tecnologia: editingProject.tecnologia,
      autor: editingProject.autor,
      githubUrl: editingProject.githubUrl,
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

  const handleDelete = async (docId) => {
    if (!isAdmin) return showNotification("Apenas admins podem excluir!", "error");
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
      p.responsavelNome?.toLowerCase().includes(term) ||
      p.clienteNome?.toLowerCase().includes(term)
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
          <h1 className="text-2xl font-bold text-gray-800">
            Gerenciamento de Projetos
          </h1>
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
              <tr className="">
                <th className="p-3 text-gray-700">Título</th>
                <th className="p-3 text-gray-700">Descrição</th>
                <th className="p-3 text-gray-700">Status</th>
                <th className="p-3 text-gray-700">Cliente</th>
                <th className="p-3 text-gray-700">Responsável</th>
                
  {isAdmin && (
  <th className="p-3 text-gray-700">Ações</th>
  )}
              </tr>
            </thead>
            <tbody className="">
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
                    <span className="px-2 py-1 rounded-full bg-green-200 text-green-800 text-sm">
                      {p.cliente || "-"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full bg-purple-200 text-purple-800 text-sm">
                      {p.responsavelNome || "-"}
                    </span>
                  </td>
                  {/* Botões Editar/Excluir */}

  {isAdmin && (
    <td className="p-3 flex gap-2">
    <>
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
    </>
    </td>
  )}

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de criação/edição */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>{isCreating ? "Criar Projeto" : "Editar Projeto"}</DialogTitle>
      <DialogDescription>Preencha os dados do projeto e salve.</DialogDescription>
    </DialogHeader>

    <div className="space-y-4 py-2">
      {/* Responsável */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Responsável</label>
        <Select
          value={editingProject?.responsavel || ""}
          onValueChange={(val) => setEditingProject(prev => ({ ...prev, responsavel: val }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um responsável" />
          </SelectTrigger>
          <SelectContent>
            {users.map((u) => (
              <SelectItem key={u.id} value={u.id}>
                {u.nome} ({u.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cliente */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Cliente</label>
        <Select
          value={editingProject?.cliente || ""}
          onValueChange={(val) => setEditingProject(prev => ({ ...prev, cliente: val }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nome || c.empresa}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Título */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Título</label>
        <Input
          value={editingProject?.titulo || ""}
          onChange={(e) => setEditingProject(prev => ({ ...prev, titulo: e.target.value }))}
        />
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição</label>
        <Textarea
          value={editingProject?.descricao || ""}
          onChange={(e) => setEditingProject(prev => ({ ...prev, descricao: e.target.value }))}
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select
          value={editingProject?.status || "andamento"}
          onValueChange={(val) => setEditingProject(prev => ({ ...prev, status: val }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="andamento">Em andamento</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
            <SelectItem value="tratativa">Em tratativa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tipo de projeto */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de Projeto</label>
        <Select
          value={editingProject?.tipo || ""}
          onValueChange={(val) => setEditingProject(prev => ({ ...prev, tipo: val }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de projeto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixo">Fixo</SelectItem>
            <SelectItem value="recorrente">Recorrente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data de entrega */}
      <div className="space-y-2">
  <Label>Data de Entrega</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className="w-full justify-start text-left"
      >
        {editingProject?.dataEntrega
          ? format(new Date(editingProject.dataEntrega), "dd/MM/yyyy")
          : "Selecione a data"}
        <CalendarIcon className="ml-auto h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={editingProject?.dataEntrega ? new Date(editingProject.dataEntrega) : undefined}
        onSelect={(date) =>
          setEditingProject(prev => ({
            ...prev,
            dataEntrega: date ? date.toISOString().split("T")[0] : "",
          }))
        }
      />
    </PopoverContent>
  </Popover>
</div>

      {/* Autor */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Autor</label>
        <Input
          value={editingProject?.autor || ""}
          onChange={(e) => setEditingProject(prev => ({ ...prev, autor: e.target.value }))}
        />
      </div>

      {/* GitHub URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium">URL da Documentação (GitHub)</label>
        <Input
          value={editingProject?.githubUrl || ""}
          onChange={(e) => setEditingProject(prev => ({ ...prev, githubUrl: e.target.value }))}
        />
      </div>
    </div>

    <DialogFooter>
      <Button variant="destructive" onClick={() => setShowModal(false)}>
        Cancelar
      </Button>
      <Button onClick={handleSave}>{isCreating ? "Criar" : "Salvar"}</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


        {/* Modal de detalhes (abre com duplo clique) */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
  <DialogContent className="max-w-lg">
    <DialogHeader>
      <DialogTitle>Detalhes do Projeto</DialogTitle>
    </DialogHeader>

    {selectedProject && (
      <div className="space-y-3">
        <p><strong>Título:</strong> {selectedProject.titulo || "-"}</p>
        <p><strong>Descrição:</strong> {selectedProject.descricao || "-"}</p>
        <p><strong>Status:</strong> {selectedProject.status}</p>
        <p><strong>Cliente:</strong> {selectedProject.clienteNome || "-"}</p>
        <p><strong>Responsável:</strong> {selectedProject.responsavelNome || "-"}</p>
        <p><strong>Autor:</strong> {selectedProject.autor || "-"}</p>
      </div>
    )}

    <DialogFooter>
      <Button onClick={() => setSelectedProject(null)}>Fechar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    
      </main>
    </div>
  );
}
