"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const defaultPassword = "017tag.2025@";

  // 🔹 Buscar usuários do Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  // 🔹 Abrir modal para edição
  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsCreating(false);
    setShowModal(true);
  };

  // 🔹 Abrir modal para criação
  const handleCreateClick = () => {
    setEditingUser({ nome: "", email: "", funcao: "", permissao: "leitor" });
    setIsCreating(true);
    setShowModal(true);
  };

  // 🔹 Salvar alterações ou criar usuário
  const handleSave = async () => {
    const userData = {
      nome: editingUser.nome?.trim(),
      email: editingUser.email?.trim(),
      funcao: editingUser.funcao?.trim(),
      permissao: editingUser.permissao?.trim().toLowerCase(),
    };

    try {
      if (isCreating) {
        // Criação de usuário via backend
        const res = await fetch("/api/users/create-user", {
          method: "POST",
          body: JSON.stringify({ ...userData, password: defaultPassword }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setUsers([...users, { id: data.docId, uid: data.uid, ...userData }]);
      } else {
        // Atualiza usuário via backend (Auth + Firestore)
        const res = await fetch("/api/users/update-user", {
          method: "POST",
          body: JSON.stringify({
            uid: editingUser.id, // UID do Auth
            docId: editingUser.id, // ID do Firestore
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

  // 🔹 Excluir usuário
  const handleDelete = async (uid) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      const res = await fetch("/api/users/delete-user", {
        method: "POST",
        body: JSON.stringify({ uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers(users.filter((u) => u.uid !== uid));
    } catch (err) {
      alert("Erro ao excluir usuário: " + err.message);
    }
  };

  // 🔹 Resetar senha
  const handleResetPassword = async (uid, email) => {
    if (!confirm(`Deseja resetar a senha de ${email} para a padrão?`)) return;

    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
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
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            + Criar Usuário
          </button>
        </div>

        {/* Lista de usuários */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-gray-700">Nome</th>
                <th className="p-3 text-gray-700">Email</th>
                <th className="p-3 text-gray-700">Função</th>
                <th className="p-3 text-gray-700">Permissão</th>
                <th className="p-3 text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr
                  key={u.id}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} hover:bg-gray-200`}
                >
                  <td className="p-3 text-gray-800">{u.nome || "-"}</td>
                  <td className="p-3 text-gray-800">{u.email || "-"}</td>
                  <td className="p-3 text-gray-800">{u.funcao || "-"}</td>
                  <td className="p-3 text-gray-800 capitalize">{u.permissao || "-"}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEditClick(u)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u.uid)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Excluir
                    </button>
                    <button
                      onClick={() => handleResetPassword(u.uid, u.email)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Resetar Senha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de edição/criação */}
        {showModal && editingUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 border">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {isCreating ? "Criar Usuário" : "Editar Usuário"}
              </h2>

              <label className="block mb-2 text-gray-700">
                Nome
                <input
                  type="text"
                  name="nome"
                  value={editingUser.nome || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </label>

              <label className="block mb-2 text-gray-700">
                Email
                <input
                  type="email"
                  name="email"
                  value={editingUser.email || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </label>

              <label className="block mb-2 text-gray-700">
                Função
                <input
                  type="text"
                  name="funcao"
                  value={editingUser.funcao || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </label>

              <label className="block mb-4 text-gray-700">
                Permissão
                <select
                  name="permissao"
                  value={editingUser.permissao || "leitor"}
                  onChange={handleChange}
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="adm">Administrador</option>
                  <option value="dev">Dev</option>
                  <option value="leitor">Leitor</option>
                </select>
              </label>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  {isCreating ? "Criar" : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
