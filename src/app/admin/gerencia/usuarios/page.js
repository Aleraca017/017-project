"use client";

import AdminGuard from "@/components/security/AdminGuard";
import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPermissao, setFilterPermissao] = useState("all");

  const defaultPassword = "017tag.2025@";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          uid: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsCreating(false);
    setShowModal(true);
  };

  const handleCreateClick = () => {
    setEditingUser({
      nome: "",
      email: "",
      funcao: "",
      permissao: "leitor",
      img: "",
    });
    setIsCreating(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    const userData = {
      nome: editingUser.nome?.trim(),
      email: editingUser.email?.trim(),
      funcao: editingUser.funcao?.trim(),
      permissao: editingUser.permissao?.trim().toLowerCase(),
      img: editingUser.img?.trim() || "",
    };

    setIsSaving(true);
    setMessage(null);

    try {
      if (isCreating) {
        const res = await fetch("/api/users/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userData, password: defaultPassword }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setUsers((prev) => [
          ...prev,
          { id: data.docId, uid: data.uid, ...userData },
        ]);
        setMessage({ type: "success", text: "Usuário criado com sucesso!" });
      } else {
        const res = await fetch("/api/users/update-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: editingUser.uid,
            docId: editingUser.id,
            ...userData,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? { ...u, ...userData, uid: editingUser.uid }
              : u
          )
        );
        setMessage({ type: "success", text: "Usuário atualizado com sucesso!" });
      }

      setShowModal(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: "Erro ao salvar usuário: " + err.message,
      });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (uid) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const res = await fetch("/api/users/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers((prev) => prev.filter((u) => u.uid !== uid));
      setMessage({ type: "success", text: "Usuário excluído com sucesso!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: "Erro ao excluir usuário: " + err.message,
      });
      console.error(err);
    }
  };

  const handleResetPassword = async (uid, email) => {
    if (!confirm(`Deseja resetar a senha de ${email} para a padrão?`)) return;

    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: `Senha de ${email} resetada para: ${data.password}`,
        });
      } else {
        setMessage({
          type: "error",
          text: "Erro ao resetar senha: " + data.error,
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Erro ao resetar senha: " + err.message,
      });
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nome?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesPermissao =
      filterPermissao === "all" || u.permissao === filterPermissao;
    return matchesSearch && matchesPermissao;
  });

  return (
    <div className="bg-[url(/images/restrict/bg-cyberpunk.jpg)] bg-cover">
      <div className="flex min-h-screen bg-black/40 backdrop-blur-sm">
        <Sidebar />
        <AdminGuard>
          <main className="flex-1 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-50">
                Gerenciamento de Usuários
              </h1>
              <Button
                onClick={handleCreateClick}
                className="bg-purple-600 hover:bg-purple-700 hover:cursor-pointer"
              >
                + Criar Usuário
              </Button>
            </div>

            {message && (
              <div className="fixed top-4 right-4 z-50 w-80 animate-in fade-in slide-in-from-top-2">
                <Alert
                  className={`shadow-lg ${message.type === "error"
                    ? "border-red-700 bg-red-500 text-white"
                    : "border-green-700 bg-green-500 text-white"
                    }`}
                >
                  <AlertDescription className="text-white">
                    {message.text}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Pesquisar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 rounded focus:ring-2 focus:ring-purple-600 outline-none text-white bg-zinc-900"
              />
              <select
                value={filterPermissao}
                onChange={(e) => setFilterPermissao(e.target.value)}
                className="p-2 rounded focus:ring-2 focus:ring-purple-600 outline-none text-white bg-zinc-900 hover:cursor-pointer"
              >
                <option value="all">Todas</option>
                <option value="administrador">Administrador</option>
                <option value="dev">Dev</option>
                <option value="leitor">Leitor</option>
              </select>
            </div>

            <div className="shadow rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-700 border-b-2 border-zinc-500">
                  <tr>
                    <th className="p-3 text-gray-50">Foto</th>
                    <th className="p-3 text-gray-50">Nome</th>
                    <th className="p-3 text-gray-50">Email</th>
                    <th className="p-3 text-gray-50">Função</th>
                    <th className="p-3 text-gray-50">Permissão</th>
                    <th className="p-3 text-gray-50">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, index) => (
                    <tr
                      key={u.id}
                      className={`${index % 2 === 0 ? "bg-zinc-800" : "bg-zinc-900"
                        } hover:bg-zinc-700`}
                    >
                      <td className="p-3">
                        <img
                          src={u.img || "/images/default-avatar.png"}
                          alt={u.nome}
                          className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                        />
                      </td>
                      <td className="p-3 text-gray-50">{u.nome || "-"}</td>
                      <td className="p-3 text-gray-50">{u.email || "-"}</td>
                      <td className="p-3 text-gray-50">{u.funcao || "-"}</td>
                      <td className="p-3 text-gray-50 capitalize">
                        {u.permissao || "-"}
                      </td>
                      <td className="p-3 flex gap-2">
                        <Button
                          onClick={() => handleEditClick(u)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDelete(u.uid)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Excluir
                        </Button>
                        <Button
                          onClick={() =>
                            handleResetPassword(u.uid, u.email)
                          }
                          className="bg-yellow-500 hover:bg-yellow-600"
                        >
                          Resetar Senha
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {isCreating ? "Criar Usuário" : "Editar Usuário"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  <label className="block">
                    Nome
                    <input
                      type="text"
                      name="nome"
                      value={editingUser?.nome || ""}
                      onChange={handleChange}
                      className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </label>

                  <label className="block">
                    Foto (URL)
                    <input
                      type="text"
                      name="img"
                      value={editingUser?.img || ""}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                    {editingUser?.img && (
                      <img
                        src={editingUser.img}
                        alt="Preview"
                        className="mt-2 w-20 h-20 object-cover rounded-full border"
                      />
                    )}
                  </label>

                  <label className="block">
                    Email
                    <input
                      type="email"
                      name="email"
                      value={editingUser?.email || ""}
                      onChange={handleChange}
                      className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </label>

                  <label className="block">
                    Função
                    <input
                      type="text"
                      name="funcao"
                      value={editingUser?.funcao || ""}
                      onChange={handleChange}
                      className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </label>

                  <label className="block">
                    Permissão
                    <select
                      name="permissao"
                      value={editingUser?.permissao || "leitor"}
                      onChange={handleChange}
                      className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                    >
                      <option value="administrador">Administrador</option>
                      <option value="dev">Dev</option>
                      <option value="leitor">Leitor</option>
                    </select>
                  </label>
                </div>

                <DialogFooter className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" /> Salvando...
                      </>
                    ) : isCreating ? (
                      "Criar"
                    ) : (
                      "Salvar"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </main>
        </AdminGuard>
      </div>
    </div>
  );
}
