"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { 
  FaSignOutAlt, FaBars, FaTimes, FaUsers, FaProjectDiagram, 
  FaFileAlt, FaTasks, FaCalendarAlt, FaUserAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const linkClass = (href) =>
    `flex items-center gap-2 p-2 rounded transition ${
      pathname === href
        ? "bg-purple-600 font-semibold"
        : "hover:bg-purple-600"
    }`;

  const dataAtual = new Date();
  const horaAtual = dataAtual.toLocaleTimeString([], { hour: '2-digit' });

  var periodo = '';
  if (horaAtual >= 0 && horaAtual < 12) {
    periodo = 'Bom dia';
  } else if (horaAtual >= 12 && horaAtual < 18) {
    periodo = 'Boa tarde';
  } else {
    periodo = 'Boa noite';
  }
  

  const links = [
    { label: "Usuários", href: "/admin/usuarios", icon: <FaUsers /> },
    { label: "Projetos", href: "/admin/projetos", icon: <FaProjectDiagram /> },
    { label: "Solicitações", href: "/admin/solicitacoes", icon: <FaTasks /> },
    { label: "Documentações", href: "/admin/docs", icon: <FaFileAlt /> },
    { label: "Gerência", href: "/admin/gerencia", icon: <FaCalendarAlt /> },
    { label: "Clientes", href: "/admin/clientes", icon: <FaUserAlt /> },
  ];

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-purple-700 text-white hidden md:block">
        <div className="h-full w-full flex flex-col justify-between">

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">Painel Admin</h2>
          <nav className="flex flex-col gap-2">
            {links.map((link, i) => (
              <a key={i} href={link.href} className={linkClass(link.href)}>
                {link.icon} {link.label}
              </a>
            ))}
          </nav>
          
        </div>

        <div className="flex flex-col h-40 items-center justify-between bg-purple-800">
          <div className="flex flex-row items-center gap-4 justify-center w-full pt-10">
          <img 
          src={'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png'}
          className="w-15 h-15 rounded-full"
          ></img>
          <div>{periodo}, <span className="font-semibold">Alexandre</span></div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-5 flex items-center px-2 hover:*:translate-x-45 *:transition-transform *:duration-500 hover:cursor-pointer gap-2 bg-red-500 hover:bg-red-600 w-full py-2"
          >
            <div className="flex flex-row w-full items-center gap-2">
            <FaSignOutAlt /> Sair
            </div>
          </button>
          
        </div>

        

        </div>
      </aside>

      {/* Sidebar Mobile (Drawer) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex">
          <aside className="w-64 bg-purple-700 text-white p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setMenuOpen(false)}>
                <FaTimes size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className={linkClass(link.href)}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.icon} {link.label}
                </a>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="mt-10 flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              <FaSignOutAlt /> Sair
            </button>
          </aside>
          {/* Clique fora fecha o menu */}
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
