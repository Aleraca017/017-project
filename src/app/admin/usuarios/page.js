"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const defaultPassword = "017tag.2025@";

  // 🔹 Buscar usuários do Firestore
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

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsCreating(false);
    setShowModal(true);
  };

  const handleCreateClick = () => {
    setEditingUser({ nome: "", email: "", funcao: "", permissao: "leitor" });
    setIsCreating(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    const userData = {
      nome: editingUser.nome?.trim(),
      email: editingUser.email?.trim(),
      funcao: editingUser.funcao?.trim(),
      permissao: editingUser.permissao?.trim().toLowerCase(),
    };

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
            u.id === editingUser.id ? { ...u, ...userData, uid: editingUser.uid } : u
          )
        );
      }

      setShowModal(false);
    } catch (err) {
      alert("Erro ao salvar usuário: " + err.message);
      console.error(err);
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
    } catch (err) {
      alert("Erro ao excluir usuário: " + err.message);
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
        alert(`Senha de ${email} resetada para: ${data.password}`);
      } else {
        alert("Erro ao resetar senha: " + data.error);
      }
    } catch (err) {
      alert("Erro ao resetar senha: " + err.message);
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-50">Gerenciamento de Usuários</h1>
          <Button onClick={handleCreateClick} className="bg-green-600 hover:bg-green-700">
            + Criar Usuário
          </Button>
        </div>

        <div className="shadow rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-700 border-b-2 border-zinc-500">
              <tr>
                <th className="p-3 text-gray-50">Nome</th>
                <th className="p-3 text-gray-50">Email</th>
                <th className="p-3 text-gray-50">Função</th>
                <th className="p-3 text-gray-50">Permissão</th>
                <th className="p-3 text-gray-50">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr
                  key={u.id}
                  className={`${index % 2 === 0 ? "bg-zinc-800" : "bg-zinc-900"} hover:bg-zinc-700`}
                >
                  <td className="p-3 text-gray-50">{u.nome || "-"}</td>
                  <td className="p-3 text-gray-50">{u.email || "-"}</td>
                  <td className="p-3 text-gray-50">{u.funcao || "-"}</td>
                  <td className="p-3 text-gray-50 capitalize">{u.permissao || "-"}</td>
                  <td className="p-3 flex gap-2">
                    <Button onClick={() => handleEditClick(u)} className="bg-blue-600 hover:bg-blue-700">
                      Editar
                    </Button>
                    <Button onClick={() => handleDelete(u.uid)} className="bg-red-600 hover:bg-red-700">
                      Excluir
                    </Button>
                    <Button onClick={() => handleResetPassword(u.uid, u.email)} className="bg-yellow-500 hover:bg-yellow-600">
                      Resetar Senha
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal ShadCN */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isCreating ? "Criar Usuário" : "Editar Usuário"}</DialogTitle>
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
                  <option value="adm">Administrador</option>
                  <option value="dev">Dev</option>
                  <option value="leitor">Leitor</option>
                </select>
              </label>
            </div>

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>{isCreating ? "Criar" : "Salvar"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
