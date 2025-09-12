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
import { format } from "date-fns";
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

export default function ProjetoPage() {
  const { id } = useParams();
  const [projeto, setProjeto] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

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
          linguagem: data.linguagem ? data.linguagem.split(",") : [],
          framework: data.framework ? data.framework.split(",") : [],
          tecnologia: data.tecnologia ? data.tecnologia.split(",") : [],
        });

        const langs = data.linguagem ? data.linguagem.split(",") : [];
        setAvailableFrameworks([...new Set(langs.flatMap((l) => frameworksMap[l] || []))]);
        setAvailableTechnologies([...new Set(langs.flatMap((l) => technologiesMap[l] || []))]);
      }
    };

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, "clientes"));
      setClients(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
      const bodyToSend = {
        ...editingProject,
        docId: editingProject.id,
         linguagem: editingProject.linguagem,
         framework: editingProject.framework,
         tecnologia: editingProject.tecnologia,
      };
      const res = await fetch("/api/projetos/update-projeto", {
        method: "POST",
        body: JSON.stringify(bodyToSend),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProjeto(bodyToSend);
      setIsEditing(false);
      alert("Projeto atualizado com sucesso!");
    } catch (err) {
      alert("Erro ao atualizar projeto: " + err.message);
    }
  };

  if (!projeto) return <div className="ml-64 p-6">Carregando...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Detalhes do Projeto</h1>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (isEditing)
                    setEditingProject({
  ...data,
  // manter como string
  linguagem: data.linguagem || "",
  framework: data.framework || "",
  tecnologia: data.tecnologia || "",
});

                  setIsEditing(!isEditing);
                }}
              >
                {isEditing ? "Cancelar" : "Editar"}
              </Button>
              {isEditing && <Button onClick={handleSave}>Salvar</Button>}
            </div>
          )}
        </div>

        <Card className="w-full h-full shadow-lg overflow-auto p-4 space-y-6">
          <Card className="w-full h-full shadow-lg overflow-auto p-4 space-y-6">
  {/* Administrativo */}
  <div className="p-4 bg-gray-50 rounded-md shadow-md space-y-4">
    <CardTitle className="text-lg font-semibold">Administrativo</CardTitle>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Responsável */}
      <div>
        <Label>Responsável</Label>
        {isEditing ? (
          <Select
            value={editingProject.responsavel || ""}
            onValueChange={(val) =>
              setEditingProject((prev) => ({ ...prev, responsavel: val }))
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
        ) : (
          <div className="p-2 bg-white rounded-md shadow-sm">
            <p className="font-medium">{getUserName(projeto.responsavel)}</p>
          </div>
        )}
      </div>

      {/* Autor */}
      <div>
        <Label>Autor</Label>
        {isEditing ? (
          <Input
            value={editingProject.autor || ""}
            onChange={(e) =>
              setEditingProject((prev) => ({ ...prev, autor: e.target.value }))
            }
          />
        ) : (
          <div className="p-2 bg-white rounded-md shadow-sm">{projeto.autor || "—"}</div>
        )}
      </div>

      {/* Cliente */}
      <div>
        <Label>Cliente</Label>
        {isEditing ? (
          <Select
            value={editingProject.cliente || ""}
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
        ) : (
          <div className="p-2 bg-white rounded-md shadow-sm">
            {getClientName(projeto.cliente)}
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Contrato */}
  <div className="p-4 bg-blue-50 rounded-md shadow-md space-y-4">
    <CardTitle className="text-lg font-semibold">Contrato</CardTitle>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Tipo */}
<div>
  <Label>Tipo</Label>
  {isEditing ? (
    <Select
      value={editingProject.tipo || ""}
      onValueChange={(val) =>
        setEditingProject((prev) => ({ ...prev, tipo: val }))
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione tipo de projeto" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fixo">Fixo</SelectItem>
        <SelectItem value="recorrente">Recorrente</SelectItem>
      </SelectContent>
    </Select>
  ) : (
    <div className="p-2 bg-white rounded-md shadow-sm">{projeto.tipo || "—"}</div>
  )}
</div>

      {/* Criado em */}
      <div>
        <Label>Data de Criação</Label>
        <div className="p-2 bg-white rounded-md shadow-sm">
          {projeto.criadoEm?.seconds
            ? format(new Date(projeto.criadoEm.seconds * 1000), "dd/MM/yyyy")
            : "—"}
        </div>
      </div>

      {/* Data de Entrega */}
      <div>
        <Label>Data de Entrega</Label>
        {isEditing ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                {editingProject.dataEntrega
                  ? format(new Date(editingProject.dataEntrega), "dd/MM/yyyy")
                  : "Selecione a data"}
                <CalendarIcon className="ml-auto h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  editingProject.dataEntrega
                    ? new Date(editingProject.dataEntrega)
                    : undefined
                }
                onSelect={(date) =>
                  setEditingProject((prev) => ({
                    ...prev,
                    dataEntrega: date ? date.toISOString().split("T")[0] : "",
                  }))
                }
              />
            </PopoverContent>
          </Popover>
        ) : (
          <div className="p-2 bg-white rounded-md shadow-sm">
            {projeto.dataEntrega
              ? projeto.dataEntrega.seconds
                ? format(new Date(projeto.dataEntrega.seconds * 1000), "dd/MM/yyyy")
                : format(new Date(projeto.dataEntrega), "dd/MM/yyyy")
              : "Sem data prevista"}
          </div>
        )}
      </div>
    </div>
  </div>

 {/* Stacks */}
<div className="p-4 bg-green-50 rounded-md shadow-md space-y-4">
  <CardTitle className="text-lg font-semibold">Stacks</CardTitle>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Linguagem */}
    <div>
      <Label>Linguagem</Label>
      {isEditing ? (
        <Select
  value={editingProject.linguagem || ""}
  onValueChange={(val) => {
    setEditingProject((prev) => ({
      ...prev,
      linguagem: val,
      // limpa framework/tecnologia se não estiver disponível
      framework: frameworksMap[val]?.includes(prev.framework) ? prev.framework : "",
      tecnologia: technologiesMap[val]?.includes(prev.tecnologia) ? prev.tecnologia : "",
    }));
    setAvailableFrameworks(frameworksMap[val] || []);
    setAvailableTechnologies(technologiesMap[val] || []);
  }}
>

          <SelectTrigger>
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
        <div className="flex flex-wrap gap-2">
          {projeto.linguagem && (
            <Badge className={languageColors[projeto.linguagem] || "bg-gray-200"}>
              {projeto.linguagem}
            </Badge>
          )}
        </div>
      )}
    </div>

    {/* Framework */}
    <div>
      <Label>Framework</Label>
      {isEditing ? (
        <Select
          value={editingProject.framework || ""}
          onValueChange={(val) =>
            setEditingProject((prev) => ({ ...prev, framework: val }))
          }
        >
          <SelectTrigger>
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
        <div className="flex flex-wrap gap-2">
          {projeto.framework && (
            <Badge className={frameworkColors[projeto.framework] || "bg-gray-200"}>
              {projeto.framework}
            </Badge>
          )}
        </div>
      )}
    </div>

    {/* Tecnologia */}
    <div>
      <Label>Tecnologia</Label>
      {isEditing ? (
        <Select
          value={editingProject.tecnologia || ""}
          onValueChange={(val) =>
            setEditingProject((prev) => ({ ...prev, tecnologia: val }))
          }
        >
          <SelectTrigger>
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
        <div className="flex flex-wrap gap-2">
          {projeto.tecnologia && (
            <Badge className={technologyColors[projeto.tecnologia] || "bg-gray-200"}>
              {projeto.tecnologia}
            </Badge>
          )}
        </div>
      )}
    </div>
  </div>
</div>

  {/* Documentação */}
  <div className="p-4 bg-purple-50 rounded-md shadow-md space-y-4">
    <CardTitle className="text-lg font-semibold">Documentação</CardTitle>
    <div>
      {isEditing ? (
        <Input
          value={editingProject.githubUrl || ""}
          onChange={(e) =>
            setEditingProject((prev) => ({ ...prev, githubUrl: e.target.value }))
          }
        />
      ) : projeto.githubUrl ? (
        <a href={projeto.githubUrl} target="_blank" className="text-blue-600 underline">
          {projeto.githubUrl}
        </a>
      ) : (
        <div className="p-2 bg-white rounded-md shadow-sm">Sem documentação</div>
      )}
    </div>
  </div>

  {/* Status */}
  <div className="flex justify-end">
    <Badge className={`text-lg px-4 py-2 ${statusColors[projeto.status] || "bg-gray-200"}`}>
      {projeto.status || "—"}
    </Badge>
  </div>
</Card>

        </Card>
      </main>
    </div>
  );
}
