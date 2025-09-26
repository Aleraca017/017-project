"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import Sidebar from "@/components/admin/Sidebar";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, isValid } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function ProjetoPage() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const languages = ["JavaScript", "Python", "PHP", "Java", "C#", "Ruby"];
  const projectTypes = ["Fixo", "Recorrente"];

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
    "em andamento": "bg-yellow-400 text-black",
    concluido: "bg-green-500 text-white",
    cancelado: "bg-red-500 text-white",
    tratativa: "bg-gray-400 text-white",
  };

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

  const [availableFrameworks, setAvailableFrameworks] = useState([]);
  const [availableTechnologies, setAvailableTechnologies] = useState([]);

  // helpers para data
  const parseToDate = (v) => {
    if (!v && v !== 0) return null;
    // Firestore Timestamp like { seconds, nanoseconds }
    if (typeof v === "object" && v !== null) {
      if (typeof v.seconds === "number") return new Date(v.seconds * 1000);
      if (typeof v.toDate === "function") {
        try {
          const d = v.toDate();
          if (d instanceof Date && !isNaN(d)) return d;
        } catch (e) { }
      }
    }
    if (typeof v === "number") {
      // could be ms or seconds — assumimos ms (Firestore seconds handled acima)
      return new Date(v);
    }
    if (typeof v === "string") {
      // "2025-09-29" or ISO string
      const d = new Date(v);
      if (!isNaN(d)) return d;
      return null;
    }
    if (v instanceof Date) {
      return isNaN(v) ? null : v;
    }
    return null;
  };

  const safeFormat = (value, fmt = "dd/MM/yyyy") => {
    const d = value instanceof Date ? value : parseToDate(value);
    if (!d) return "—";
    return isValid(d) ? format(d, fmt) : "—";
  };

  // Verifica admin
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin);
      }
    });
    return () => unsubscribe();
  }, []);

  // Buscar projeto, usuários e clientes
  useEffect(() => {
    const fetchProjeto = async () => {
      const docRef = doc(db, "projetos", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        setProjeto(data);
        setEditingProject({
          ...data,
          tipo: data.tipo || "",
          linguagem: data.linguagem || "",
          framework: data.framework || "",
          tecnologia: data.tecnologia || "",
          // padroniza como Date | null
          dataEntrega: parseToDate(data.dataEntrega),
        });

        setAvailableFrameworks(frameworksMap[data.linguagem] || []);
        setAvailableTechnologies(technologiesMap[data.linguagem] || []);
      }
    };

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      setUsers(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      setClients(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    if (id) {
      fetchProjeto();
      fetchUsers();
      fetchClients();
    }
  }, [id]);

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.nome || client.empresa : "—";
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.nome : "—";
  };

  const handleSave = async () => {
    try {
      // Antes de enviar, converte dataEntrega (Date) para ISO (ou null)
      const payload = {
        ...editingProject,
        docId: editingProject.id,
        tipo: editingProject.tipo || "",
        linguagem: editingProject.linguagem || "",
        framework: editingProject.framework || "",
        tecnologia: editingProject.tecnologia || "",
        dataEntrega: editingProject.dataEntrega
          ? editingProject.dataEntrega.toISOString()
          : null,
      };

      const res = await fetch("/api/projetos/update-projeto", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no servidor");
      // Atualiza localmente (mantemos editingProject como Date)
      setProjeto((prev) => ({ ...prev, ...payload }));
      setIsEditing(false);
      alert("Projeto atualizado com sucesso!");
    } catch (err) {
      alert("Erro ao atualizar projeto: " + err.message);
    }
  };

  if (!projeto) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col justify-center items-center bg-black text-white w-full h-screen">
          <Loader2 className="animate-spin w-8 h-8 mb-4 text-purple-600" />
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-zinc-950 text-white min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Detalhes do Projeto</h1>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                className={"bg-gray-900 hover:bg-gray-800 hover:cursor-pointer"}
                onClick={() => {
                  // sempre (re)inicializa editingProject com data como Date
                  setEditingProject({
                    ...projeto,
                    linguagem: projeto.linguagem || "",
                    framework: projeto.framework || "",
                    tecnologia: projeto.tecnologia || "",
                    dataEntrega: parseToDate(projeto.dataEntrega),
                  });
                  setIsEditing((v) => !v);
                }}
              >
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
              {isEditing && (
                <Button
                  className={"bg-green-600 hover:bg-green-800 hover:cursor-pointer"}
                  onClick={handleSave}
                >
                  Salvar
                </Button>
              )}
            </div>
          )}
        </div>

        <Card className="bg-zinc-900 border-0 w-full h-210 shadow-lg overflow-auto p-4 space-y-6 scrollbar-black">
          {/* Administrativo */}
          <div className="p-4 bg-zinc-950 text-white rounded-md shadow-md space-y-4">
            <CardTitle className="text-lg font-semibold">Administrativo</CardTitle>
            <hr className="border-zinc-800" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Responsável */}
              <div>
                <Label className="mb-2">Responsável</Label>
                {isEditing ? (
                  <Select
                    value={editingProject.responsavel || ""}
                    onValueChange={(val) =>
                      setEditingProject((prev) => ({ ...prev, responsavel: val }))
                    }
                  >
                    <SelectTrigger className="text-black bg-gray-50 w-full">
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
                ) : (
                  <div className="p-2 bg-zinc-900 rounded-md shadow-sm">
                    <p className="font-medium">{getUserName(projeto.responsavel)}</p>
                  </div>
                )}
              </div>

              {/* Autor */}
              <div>
                <Label className="mb-2">Autor</Label>
                {isEditing ? (
                  <Input
                    className="text-black bg-gray-50 w-full"
                    value={editingProject.autor || ""}
                    onChange={(e) =>
                      setEditingProject((prev) => ({ ...prev, autor: e.target.value }))
                    }
                  />
                ) : (
                  <div className="p-2 bg-zinc-900 rounded-md shadow-sm">{projeto.autor || "—"}</div>
                )}
              </div>

              {/* Cliente */}
              <div>
                <Label className="mb-2">Cliente</Label>
                {isEditing ? (
                  <Select
                    className="text-black"
                    value={editingProject.cliente || ""}
                    onValueChange={(val) =>
                      setEditingProject((prev) => ({ ...prev, cliente: val }))
                    }
                  >
                    <SelectTrigger className="text-black bg-gray-50 w-full">
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
                ) : (
                  <div className="p-2 bg-zinc-900 rounded-md shadow-sm">
                    {getClientName(projeto.cliente)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contrato */}
          <div className="bg-zinc-950 text-white p-4 rounded-md shadow-md space-y-4">
            <CardTitle className=" text-lg font-semibold">Contrato</CardTitle>
            <hr className="border-zinc-800" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tipo */}
              <div>
                <Label className="mb-2">Tipo</Label>
                {isEditing ? (
                  <Select
                    value={editingProject.tipo || ""}
                    onValueChange={(val) =>
                      setEditingProject((prev) => ({ ...prev, tipo: val }))
                    }
                  >
                    <SelectTrigger className="text-black bg-gray-50 w-full">
                      <SelectValue placeholder="Selecione tipo de projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-zinc-900 rounded-md shadow-sm">{projeto.tipo || "—"}</div>
                )}
              </div>

              {/* Criado em */}
              <div>
                <Label className="mb-2">Data de Criação</Label>
                <div className="p-2 bg-zinc-900 rounded-md shadow-sm">
                  {safeFormat(projeto.criadoEm, "dd/MM/yyyy")}
                </div>
              </div>

              {/* Data de Entrega */}
              <div>
                <Label className="mb-2">Data de Entrega</Label>
                {isEditing ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left text-black">
                        {editingProject?.dataEntrega
                          ? format(editingProject.dataEntrega, "dd/MM/yyyy")
                          : "Selecione a data"}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingProject?.dataEntrega ?? undefined}
                        onSelect={(date) =>
                          setEditingProject((prev) => ({
                            ...prev,
                            dataEntrega: date ?? null, // sempre Date | null
                          }))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="p-2 bg-zinc-900 rounded-md shadow-sm">
                    {projeto.dataEntrega ? safeFormat(projeto.dataEntrega, "dd/MM/yyyy") : "Sem data prevista"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stacks */}
          <div className="bg-zinc-950 text-white p-4 rounded-md shadow-md space-y-4">
            <CardTitle className="text-lg font-semibold">Stacks</CardTitle>
            <hr className="border-zinc-800" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Linguagem */}
              <div>
                <Label className="mb-2">Linguagem</Label>
                {isEditing ? (
                  <Select
                    value={editingProject.linguagem || ""}
                    onValueChange={(val) => {
                      setEditingProject((prev) => ({
                        ...prev,
                        linguagem: val,
                        framework: frameworksMap[val]?.includes(prev.framework) ? prev.framework : "",
                        tecnologia: technologiesMap[val]?.includes(prev.tecnologia) ? prev.tecnologia : "",
                      }));
                      setAvailableFrameworks(frameworksMap[val] || []);
                      setAvailableTechnologies(technologiesMap[val] || []);
                    }}
                  >
                    <SelectTrigger className="text-black bg-gray-50 w-full">
                      <SelectValue placeholder="Selecione uma linguagem" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={languageColors[projeto.linguagem] || "bg-gray-200"}>
                    {projeto.linguagem}
                  </Badge>
                )}
              </div>

              {/* Framework */}
              <div>
                <Label className="mb-2">Framework</Label>
                {isEditing ? (
                  <Select
                    value={availableFrameworks.includes(editingProject.framework) ? editingProject.framework : ""}
                    onValueChange={(val) => setEditingProject((prev) => ({ ...prev, framework: val }))}
                  >
                    <SelectTrigger className="text-black bg-gray-50 w-full">
                      <SelectValue placeholder="Selecione um framework" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFrameworks.map((fw) => (
                        <SelectItem key={fw} value={fw}>
                          {fw}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={frameworkColors[projeto.framework] || "bg-gray-200"}>
                    {projeto.framework}
                  </Badge>
                )}
              </div>

              {/* Tecnologia */}
              <div>
                <Label className="mb-2">Tecnologia</Label>
                {isEditing ? (
                  <Select
                    value={availableTechnologies.includes(editingProject.tecnologia) ? editingProject.tecnologia : ""}
                    onValueChange={(val) => setEditingProject((prev) => ({ ...prev, tecnologia: val }))}
                  >
                    <SelectTrigger className="text-black bg-gray-50 w-full">
                      <SelectValue placeholder="Selecione uma tecnologia" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTechnologies.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={technologyColors[projeto.tecnologia] || "bg-gray-200"}>
                    {projeto.tecnologia}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Documentação */}
          <div className="p-4 bg-zinc-950 text-white rounded-md shadow-md space-y-4">
            <CardTitle className="text-lg font-semibold">Documentação</CardTitle>
            <hr className="border-zinc-800" />
            <div>
              {isEditing ? (
                <Input
                  className="text-black bg-gray-50 focus:shadow-lg focus:shadow-purple-500"
                  value={editingProject.githubUrl || ""}
                  onChange={(e) =>
                    setEditingProject((prev) => ({ ...prev, githubUrl: e.target.value }))
                  }
                />
              ) : projeto.githubUrl ? (
                <a href={projeto.githubUrl} target="_blank" className="text-blue-300 underline">
                  {projeto.githubUrl}
                </a>
              ) : (
                <div className="p-2 bg-transparent rounded-md shadow-sm">Sem documentação</div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex justify-end items-center">
            <label className="mr-2 font-medium text-white">Status do projeto:</label>
            <Badge className={`text-lg px-4 py-2 ${statusColors[projeto.status] || "bg-gray-200"}`}>
              {projeto.status || "—"}
            </Badge>
          </div>
        </Card>
      </main>
    </div>
  );
}
