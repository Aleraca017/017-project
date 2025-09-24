"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import 'github-markdown-css'; // estilo GitHub

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"


// Componente client-only para renderizar Markdown
const MarkdownViewer = dynamic(() => import("@/components/MarkdownRenderer"), { ssr: false });

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [docProject, setDocProject] = useState(null);
  const [readmeContent, setReadmeContent] = useState("");
  const [loadingReadme, setLoadingReadme] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });

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

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projetos"));
      setProjects(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.titulo?.toLowerCase().includes(term) ||
      p.descricao?.toLowerCase().includes(term)
    );
  });

  // Carregar README do GitHub via API do Next.js
  const loadReadme = async (project) => {
    if (!project.githubUrl) {
      setReadmeContent("Nenhuma documentação disponível.");
      setDocProject(project);
      return;
    }

    try {
      setLoadingReadme(true);
      setDocProject(project);

      const res = await fetch(`/api/github/readme?url=${encodeURIComponent(project.githubUrl)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao buscar README");

      setReadmeContent(data.content || "Nenhuma documentação disponível.");
    } catch (err) {
      console.error(err);
      setReadmeContent("Erro ao carregar documentação.");
    } finally {
      setLoadingReadme(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
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
              className={`fixed top-20 rounded-2xl -right-15 w-80 text-left py-2 px-4 z-50 shadow-lg ${notification.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
                }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-50">Gerenciamento de Projetos</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Pesquisar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-purple-400 rounded px-3 py-2 ring-2 ring-purple-600 outline-none placeholder-purple-400 text-gray-50"
            />
          </div>
        </div>

        <div className="shadow rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-700 border-b-2 border-zinc-500">
              <tr>
                <th className="p-3 text-white ">Título</th>
                <th className="p-3 text-white">Descrição</th>
                <th className="p-3 text-white">Documentação</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p, index) => (
                <tr
                  key={p.id}
                  className={`${index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800"} hover:bg-zinc-600 transition cursor-pointer`}
                  onDoubleClick={() => loadReadme(p)}
                >
                  <td className="p-3 text-gray-50">{p.titulo || "-"}</td>
                  <td className="p-3 text-gray-50">{p.descricao || "-"}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${p.githubUrl
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                        }`}
                    >
                      {p.githubUrl ? "Com documentação" : "Sem documentação"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Modal de documentação */}
        <Dialog open={!!docProject} onOpenChange={() => setDocProject(null)}>
          <DialogContent className=" bg-zinc-800 text-gray-100 overflow-y-auto w-5xl h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-purple-300 text-2xl text-center">
                Documentação: {docProject?.titulo}
              </DialogTitle>
              <DialogDescription className="text-center text-zinc-400">
                Visualização do README.md do projeto
              </DialogDescription>
            </DialogHeader>

            {loadingReadme ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="markdown-body p-4 max-h-[65vh] overflow-y-auto no-scrollbar rounded-lg bg-zinc-900">
                <MarkdownViewer content={readmeContent} />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
