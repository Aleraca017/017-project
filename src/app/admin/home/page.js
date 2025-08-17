"use client";

import { FaUsers, FaFileAlt, FaDownload } from "react-icons/fa";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminHome() {
  const links = [
    { href: "/admin/home", label: "Dashboard" },
    { href: "/admin/usuarios", label: "Usuários" },
    { href: "/admin/laudos", label: "Laudos" },
    { href: "/admin/logs", label: "Logs" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar links={links} />

      {/* Conteúdo principal */}
      <main className="flex-1 p-8 w-full">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        </header>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
            <FaUsers className="text-purple-600 text-3xl" />
            <div>
              <p className="text-gray-500">Usuários</p>
              <h2 className="text-2xl font-bold">120</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
            <FaFileAlt className="text-purple-600 text-3xl" />
            <div>
              <p className="text-gray-500">Laudos</p>
              <h2 className="text-2xl font-bold">85</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
            <FaDownload className="text-purple-600 text-3xl" />
            <div>
              <p className="text-gray-500">Downloads</p>
              <h2 className="text-2xl font-bold">340</h2>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
