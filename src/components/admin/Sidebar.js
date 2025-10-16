"use client";

import { useState, useEffect, useRef } from "react";
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
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdForum } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { BiTransferAlt } from "react-icons/bi";
import { MdAttachMoney } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Carregando...");
  const [userFullName, setUserFullName] = useState("Carregando...");
  const [userImg, setUserImg] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openSection, setOpenSection] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pegar usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const tokenResult = await getIdTokenResult(user, true);
          setIsAdmin(!!tokenResult.claims.admin);

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
            { label: "Usuários", href: "/admin/gerencia/usuarios", icon: <FaUsers /> },
            { label: "Reuniões", href: "/admin/gerencia/reunioes", icon: <FaCalendarAlt /> },
            { label: "Prazos", href: "/admin/gerencia/prazos", icon: <FaTasks /> },
            { label: "Clientes", href: "/admin/gerencia/clientes", icon: <FaUserAlt /> },
            { label: "Transferir Solicitações", href: "/admin/gerencia/t-solicitacoes", icon: <BiTransferAlt /> },
          ],
        },
      ]
      : []),
    //{     label: "Financeiro", icon: <MdAttachMoney />, subLinks: [  { label: "Pagamentos", href: "/admin/financeiro/pagamentos", icon: <FaMoneyBill /> },],},
    {
      label: "Projetos",
      icon: <FaProjectDiagram />,
      subLinks: [
        { label: "Projetos", href: "/admin/projetos/projetos", icon: <FaProjectDiagram /> },
        { label: "Documentações", href: "/admin/projetos/docs", icon: <FaFileAlt /> },
      ],
    },
    {
      label: "Suporte",
      icon: <BiSupport />,
      subLinks: [
        { label: "Solicitações", href: "/admin/suporte/solicitacoes", icon: <FaTasks /> },
        { label: "Registrar tratativas", href: "/admin/suporte/registro", icon: <MdOutlineLabelImportant /> },
        { label: "Fórum de tratativas", href: "/admin/suporte/forum", icon: <MdForum /> },
      ],
    },
  ];

  // Alterna a seção aberta
  const toggleSection = (label) => {
    setOpenSection((prev) => (prev === label ? "" : label));
  };

  const linkClass = (href) =>
    `flex items-center gap-2 p-2 rounded transition ${pathname.startsWith(href)
      ? "bg-zinc-600 font-semibold border-l-4 border-zinc-400"
      : "hover:bg-zinc-400"
    }`;

  const renderLinks = () => {
    return links.map((section, idx) => {
      const isActiveSection = section.subLinks.some((link) => pathname.startsWith(link.href));
      const isOpen = openSection === section.label || isActiveSection;

      return (
        <div key={idx} className="mb-4">
          <button
            onClick={() => toggleSection(section.label)}
            className={`flex items-center justify-between w-full p-2 font-semibold hover:cursor-pointer hover:bg-zinc-600 rounded ${isActiveSection ? "bg-zinc-600" : ""
              }`}
          >
            <div className="flex items-center gap-2">
              {section.icon} {section.label}
            </div>
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          <div
            className={`ml-4 mt-2 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"
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

  // Avatar com fallback
  const renderAvatar = () => {
    if (userImg) {
      return (
        <img
          src={userImg}
          className="w-16 h-16 rounded-full object-cover ring-3 ring-purple-700 shadow-lg shadow-purple-500"
          alt="Avatar do usuário"
          onError={(e) => {
            e.currentTarget.onerror = null;
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
        <div className="w-16 h-16 rounded-full bg-zinc-400 text-white flex items-center justify-center font-bold text-xl ring-3 ring-purple-700 shadow-lg shadow-purple-500">
          {initials}
        </div>
      );
    }
  };

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-stone-800 text-white hidden md:flex flex-col justify-between h-screen">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">Painel Admin</h2>
          {renderLinks()}
        </div>

        {/* Avatar + Dropdown */}
        <div ref={dropdownRef} className="relative flex flex-col items-center w-full p-4 pb-8 bg-stone-700">
          <div
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex flex-row items-center gap-4 justify-center w-full pt-4 hover:cursor-pointer group"
          >
            {renderAvatar()}
            <div>
              {periodo}, <span className="font-semibold">{userName}</span>
            </div>
            <MdOutlineKeyboardArrowRight
              className="invisible group-hover:visible transition-transform duration-200"
              style={{ transform: openDropdown ? "rotate(90deg)" : "rotate(0deg)" }}
            />
          </div>

          {openDropdown && (
            <div className="absolute bottom-10 w-44 left-60 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50">
              <ul className="flex flex-col text-sm text-zinc-200">
                <li
                  className="px-4 py-2 hover:bg-zinc-800 cursor-pointer rounded-lg"
                  onClick={() => {
                    setOpenDropdown(false);
                    router.push("/versao");
                  }}
                >
                  Versão
                </li>
                <li
                  className="px-4 py-2 hover:bg-zinc-800 cursor-pointer rounded-lg"
                  onClick={() => {
                    setOpenDropdown(false);
                    router.push("/admin/account");
                  }}
                >
                  Minha Conta
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-zinc-800 cursor-pointer text-red-400 flex items-center gap-2 rounded-lg"
                >
                  <FaSignOutAlt /> Sair
                </li>
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex">
          <aside className="w-64 bg-gray-800 text-white p-6">
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
        className="md:hidden bg-gray-800 text-white p-2 rounded fixed top-4 right-4 z-40"
      >
        <FaBars size={20} />
      </button>
    </>
  );
}
