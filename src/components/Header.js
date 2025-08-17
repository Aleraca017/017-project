"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { FaBars, FaTimes } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Esconde o header ao rolar para baixo
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false)
      } else {
        setShowHeader(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  return (
  <header
    className={`fixed top-0 left-0 right-0 z-50 bg-black text-white shadow-md transition-transform duration-300 ${
      showHeader ? "translate-y-0" : "-translate-y-full"
    }`}
  >
    {/* Linha principal */}
    <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
      <Link href="/">
        <img
          src="/images/logo.png"
          alt="017Tag"
          className="h-12 w-auto cursor-pointer"
        />
      </Link>

      {/* Menu desktop */}
      <nav className="hidden md:flex space-x-8 text-sm font-medium">
        <Link href="/#home" className="hover:text-purple-400 transition">Início</Link>
        <Link href="/sobre" className="hover:text-purple-400 transition">Sobre</Link>
        <Link href="/servicos" className="hover:text-purple-400 transition">Serviços</Link>
        <Link href="/projetos" className="hover:text-purple-400 transition">Projetos</Link>
        <Link href="/contato/contato" className="hover:text-purple-400 transition">Contato</Link>
      </nav>

      {/* Botão hamburguer */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Abrir menu"
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </div>

    {/* Sub-barra de login para clientes */}
    <Link href="/login" className="hover:underline font-semibold">
    <div className="bg-zinc-900 text-white text-sm py-2 text-center">
      
        Já é nosso cliente? Faça seu login aqui para verificar suas solicitações de suporte ou realizar novas solicitações.
      
    </div>
    </Link>

    {/* Menu mobile */}
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          key="mobileMenu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          ref={menuRef}
          className="md:hidden bg-black px-6 pb-6 pt-2 flex flex-col gap-4 text-sm font-medium border-t border-zinc-700"
        >
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-purple-400 transition">Início</Link>
          <Link href="/sobre" onClick={() => setIsMenuOpen(false)} className="hover:text-purple-400 transition">Sobre</Link>
          <Link href="/servicos" onClick={() => setIsMenuOpen(false)} className="hover:text-purple-400 transition">Serviços</Link>
          <Link href="/projetos" onClick={() => setIsMenuOpen(false)} className="hover:text-purple-400 transition">Projetos</Link>
          <Link href="/contato/contato" onClick={() => setIsMenuOpen(false)} className="hover:text-purple-400 transition">Contato</Link>
          <Link href="/login" onClick={() => setIsMenuOpen(false)} className="hover:text-purple-400 transition">🔒 Área Restrita</Link>
        </motion.div>
      )}
    </AnimatePresence>
  </header>
)

}
