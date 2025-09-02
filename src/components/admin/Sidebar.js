"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUsers,
  FaProjectDiagram,
  FaFileAlt,
  FaTasks,
  FaCalendarAlt,
  FaUserAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Carregando...");
  const [userFullName, setUserFullName] = useState("Carregando...");
  const [userImg, setUserImg] = useState(null); // imagem do Firestore
  const [isAdmin, setIsAdmin] = useState(false);
  const [openSection, setOpenSection] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Pegar usuário logado, claims e dados do Firestore
  useEffect(() => {
    console.log("Sidebar conectada no Firestore Project:", db._databaseId?.projectId);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // claims
          const tokenResult = await getIdTokenResult(user, true);
          setIsAdmin(!!tokenResult.claims.admin);

          // dados do Firestore
          const userRef = doc(db, "usuarios", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            const nomeCompleto = data.nome || "Usuário";
            setUserName(nomeCompleto.split(" ")[0]);
            setUserFullName(nomeCompleto);
            setUserImg(data.img || null);
          }
        } catch (err) {
          console.error("Erro ao buscar usuário no Sidebar:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Saudação
  const horaAtual = new Date().getHours();
  let periodo = "";
  if (horaAtual < 12) periodo = "Bom dia";
  else if (horaAtual < 18) periodo = "Boa tarde";
  else periodo = "Boa noite";

  // Links do Sidebar
  const links = [
    ...(isAdmin
      ? [
          {
            label: "Gerência",
            icon: <FaCalendarAlt />,
            subLinks: [
              { label: "Usuários", href: "/admin/usuarios", icon: <FaUsers /> },
              { label: "Reuniões", href: "/admin/reunioes", icon: <FaCalendarAlt /> },
              { label: "Prazos", href: "/admin/prazos", icon: <FaTasks /> },
              { label: "Clientes", href: "/admin/clientes", icon: <FaUserAlt /> },
            ],
          },
        ]
      : []),
    {
      label: "Projetos",
      icon: <FaProjectDiagram />,
      subLinks: [
        { label: "Projetos", href: "/admin/projetos", icon: <FaProjectDiagram /> },
        { label: "Documentações", href: "/admin/docs", icon: <FaFileAlt /> },
      ],
    },
    {
      label: "Suporte",
      icon: <FaTasks />,
      subLinks: [
        { label: "Solicitações", href: "/admin/solicitacoes", icon: <FaTasks /> },
      ],
    },
  ];

  // Alterna a seção aberta
  const toggleSection = (label) => {
    setOpenSection((prev) => (prev === label ? "" : label));
  };

  const linkClass = (href) =>
    `flex items-center gap-2 p-2 rounded transition ${
      pathname.startsWith(href)
        ? "bg-purple-600 font-semibold border-l-4 border-yellow-400"
        : "hover:bg-purple-600"
    }`;

  const renderLinks = () => {
    return links.map((section, idx) => {
      const isActiveSection = section.subLinks.some((link) =>
        pathname.startsWith(link.href)
      );
      const isOpen = openSection === section.label || isActiveSection;

      return (
        <div key={idx} className="mb-4">
          <button
            onClick={() => toggleSection(section.label)}
            className={`flex items-center justify-between w-full p-2 font-semibold hover:bg-purple-600 rounded ${
              isActiveSection ? "bg-purple-600" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              {section.icon} {section.label}
            </div>
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          <div
            className={`ml-4 mt-2 overflow-hidden transition-all duration-300 ${
              isOpen ? "max-h-96" : "max-h-0"
            }`}
          >
            <nav className="flex flex-col gap-2">
              {section.subLinks.map((link, i) => (
                <a key={i} href={link.href} className={linkClass(link.href)}>
                  {link.icon} {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      );
    });
  };

  // Avatar com fallback para iniciais
  const renderAvatar = () => {
    if (userImg) {
      return (
        <img
          src={userImg}
          className="w-16 h-16 rounded-full object-cover"
          alt="Avatar do usuário"
          onError={(e) => {
            e.currentTarget.onerror = null; // evita loop infinito
            setUserImg(null);
          }}
        />
      );
    } else {
      const initials = userFullName
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div className="w-16 h-16 rounded-full bg-yellow-400 text-purple-700 flex items-center justify-center font-bold text-xl">
          {initials}
        </div>
      );
    }
  };

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-purple-700 text-white hidden md:flex flex-col justify-between h-screen">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">Painel Admin</h2>
          {renderLinks()}
        </div>

        <div className="flex flex-col h-40 items-center justify-between bg-purple-800 w-full p-4">
          <div className="flex flex-row items-center gap-4 justify-center w-full pt-4">
            {renderAvatar()}
            <div>
              {periodo}, <span className="font-semibold">{userName}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-5 flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full justify-center"
          >
            <FaSignOutAlt /> Sair
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex">
          <aside className="w-64 bg-purple-700 text-white p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setMenuOpen(false)}>
                <FaTimes size={20} />
              </button>
            </div>
            {renderLinks()}
            <button
              onClick={handleLogout}
              className="mt-10 flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              <FaSignOutAlt /> Sair
            </button>
          </aside>
          <div className="flex-1" onClick={() => setMenuOpen(false)}></div>
        </div>
      )}

      {/* Botão abre menu no mobile */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden bg-purple-600 text-white p-2 rounded fixed top-4 right-4 z-40"
      >
        <FaBars size={20} />
      </button>
    </>
  );
}
