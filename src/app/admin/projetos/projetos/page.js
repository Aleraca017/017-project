//front end definer
"use client";

// react imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

//firebase imports
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

//security components imports
import AuthGuard from "@/components/security/AuthGuard";
import CheckUserPermission from "@/components/security/CheckUserPermission";

//visual components imports
import Sidebar from "@/components/admin/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

// shadcn
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProjetosPage() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Notificação
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  // Verifica claim admin
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

  // Buscar dados
  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projetos"));
      setProjects(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      setClients(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchProjects();
    fetchUsers();
    fetchClients();
  }, []);

  // Criar projeto
  const handleCreateClick = () => {
    if (!isAdmin)
      return showNotification("Apenas admins podem criar!", "error");
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
      tipo: "",
      dataEntrega: "",
    });
    setIsCreating(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!isAdmin)
      return showNotification("Apenas admins podem salvar!", "error");

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
      tipo: editingProject.tipo,
      dataEntrega: editingProject.dataEntrega,
    };

    try {
      const res = await fetch("/api/projetos/create-projeto", {
        method: "POST",
        body: JSON.stringify(projectData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProjects((prev) => [...prev, { id: data.docId, ...projectData }]);
      showNotification("Projeto criado com sucesso!", "success");
      setShowModal(false);
    } catch (err) {
      showNotification("Erro ao salvar projeto: " + err.message, "error");
    }
  };

  // linguagens, frameworks e tecnologias
  // --- listas ---
  const linguagens = ["JavaScript", "Python", "PHP", "Java", "C#", "Ruby"];

  const frameworks = {
    JavaScript: ["React", "Angular", "Vue", "Vanilla JS"],
    Python: ["Django", "Flask", "FastAPI"],
    PHP: ["Laravel", "Symfony", "CodeIgniter"],
    Java: ["Spring", "JSF", "Struts"],
    "C#": ["ASP.NET", "Blazor", "Unity"],
    Ruby: ["Rails", "Sinatra"],
  };

  const tecnologias = {
    JavaScript: ["Next.js", "React Native", "Node.js", "Vanilla JS"],
    Python: ["NumPy", "Pandas", "TensorFlow"],
    PHP: ["Composer", "WordPress", "Drupal"],
    Java: ["Spring Boot", "Maven", "Jenkins"],
    "C#": [".NET Core", "Xamarin", "Unity Engine"],
    Ruby: ["Rails", "Sinatra"],
  };

  const handleDelete = async (docId) => {
    if (!isAdmin)
      return showNotification("Apenas admins podem excluir!", "error");
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
    <AuthGuard>
      <CheckUserPermission>
        <div className="flex min-h-screen bg-black">
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
                  className={`fixed top-20 rounded-2xl -right-15 w-80 text-left py-2 px-4 z-50 shadow-lg ${notification.type === "success"
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
              <h1 className="text-2xl font-bold text-gray-50">
                Gerenciamento de Projetos
              </h1>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Pesquisar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="shadow-lg shadow-purple-950 focus:shadow-purple-700 rounded px-3 py-2 ring-2 ring-purple-600 outline-none placeholder-purple-400 text-gray-50"
                />
                <button
                  onClick={handleCreateClick}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition cursor-pointer "
                >
                  + Criar Projeto
                </button>
              </div>
            </div>

            {/* Lista */}
            <div className="shadow rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-700 border-b-2 border-zinc-500">
                  <tr>
                    <th className="p-3 text-gray-50">Título</th>
                    <th className="p-3 text-gray-50">Cliente</th>
                    <th className="p-3 text-gray-50">Descrição</th>
                    <th className="p-3 text-gray-50">Status</th>
                    <th className="p-3 text-gray-50">Responsável</th>
                    {isAdmin && <th className="p-3 text-gray-50">Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((p, index) => {
                    // Busca o cliente pelo id salvo no projeto
                    const client = clients.find((c) => c.id === p.cliente);
                    const clientName = client?.nome || client?.empresa || "-";

                    // Busca o responsável pelo id
                    const responsavel = users.find((u) => u.id === p.responsavel);
                    const responsavelNome = responsavel?.nome || "-";

                    // Função para cor do status
                    const getStatusClass = (status) => {
                      switch (status) {
                        case "cancelado":
                          return "bg-red-500 text-white";
                        case "concluido":
                          return "bg-green-500 text-white";
                        case "em andamento":
                          return "bg-yellow-400 text-black";
                        default:
                          return "bg-gray-300 text-black";
                      }
                    };

                    return (
                      <tr
                        key={p.id}
                        className={`${index % 2 === 0 ? "bg-zinc-800" : "bg-zinc-900"
                          } hover:bg-zinc-600 transition cursor-pointer`}
                        onDoubleClick={() => router.push(`/admin/projetos/projetos/${p.id}`)}
                      >
                        <td className="p-3 text-zinc-50">{p.titulo || "-"}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full bg-green-200 text-green-800 text-sm">
                            {clientName}
                          </span>
                        </td>
                        <td className="p-3 text-zinc-50">{p.descricao || "-"}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
                              p.status
                            )}`}
                          >
                            {p.status}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full bg-purple-200 text-purple-800 text-sm">
                            {responsavelNome}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="p-3 flex gap-2">
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
                            >
                              Excluir
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal de criação */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="max-w-lg h-200 overflow-y-auto no-scrollbar">
                <DialogHeader>
                  <DialogTitle>Criar Projeto</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do projeto e salve.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  {/* Responsável */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Responsável</label>
                    <Select
                      value={editingProject?.responsavel || ""}
                      onValueChange={(val) =>
                        setEditingProject((prev) => ({
                          ...prev,
                          responsavel: val,
                        }))
                      }
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
                      onValueChange={(val) =>
                        setEditingProject((prev) => ({ ...prev, cliente: val }))
                      }
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
                      onChange={(e) =>
                        setEditingProject((prev) => ({
                          ...prev,
                          titulo: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Descrição */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea
                      value={editingProject?.descricao || ""}
                      onChange={(e) =>
                        setEditingProject((prev) => ({
                          ...prev,
                          descricao: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={editingProject?.status || "andamento"}
                      onValueChange={(val) =>
                        setEditingProject((prev) => ({ ...prev, status: val }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                        <SelectItem value="tratativa">Em tratativa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Linguagem */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Linguagem</label>
                    <Select
                      value={editingProject?.linguagem || ""}
                      onValueChange={(val) =>
                        setEditingProject((prev) => ({
                          ...prev,
                          linguagem: val,
                          framework: "",   // reseta quando mudar linguagem
                          tecnologia: "",  // reseta quando mudar linguagem
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a linguagem" />
                      </SelectTrigger>
                      <SelectContent>
                        {linguagens.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Framework */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Framework</label>
                    <Select
                      value={editingProject?.framework || ""}
                      onValueChange={(val) =>
                        setEditingProject((prev) => ({
                          ...prev,
                          framework: val,
                        }))
                      }
                      disabled={!editingProject?.linguagem} // só habilita se linguagem escolhida
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um framework" />
                      </SelectTrigger>
                      <SelectContent>
                        {(frameworks[editingProject?.linguagem] || []).map((fw) => (
                          <SelectItem key={fw} value={fw}>
                            {fw}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tecnologia */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tecnologia</label>
                    <Select
                      value={editingProject?.tecnologia || ""}
                      onValueChange={(val) =>
                        setEditingProject((prev) => ({
                          ...prev,
                          tecnologia: val,
                        }))
                      }
                      disabled={!editingProject?.linguagem} // só habilita se linguagem escolhida
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma tecnologia" />
                      </SelectTrigger>
                      <SelectContent>
                        {(tecnologias[editingProject?.linguagem] || []).map((tech) => (
                          <SelectItem key={tech} value={tech}>
                            {tech}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>


                  {/* Tipo */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Projeto</label>
                    <Select
                      value={editingProject?.tipo || ""}
                      onValueChange={(val) =>
                        setEditingProject((prev) => ({ ...prev, tipo: val }))
                      }
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
                            ? format(
                              new Date(editingProject.dataEntrega),
                              "dd/MM/yyyy"
                            )
                            : "Selecione a data"}
                          <CalendarIcon className="ml-auto h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            editingProject?.dataEntrega
                              ? new Date(editingProject.dataEntrega)
                              : undefined
                          }
                          onSelect={(date) =>
                            setEditingProject((prev) => ({
                              ...prev,
                              dataEntrega: date
                                ? date.toISOString().split("T")[0]
                                : "",
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
                      onChange={(e) =>
                        setEditingProject((prev) => ({
                          ...prev,
                          autor: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* GitHub */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      URL da Documentação (GitHub)
                    </label>
                    <Input
                      value={editingProject?.githubUrl || ""}
                      onChange={(e) =>
                        setEditingProject((prev) => ({
                          ...prev,
                          githubUrl: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>Criar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </main>
        </div>
      </CheckUserPermission>
    </AuthGuard>
  );
}
