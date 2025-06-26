"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Header() {
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-black text-white shadow-md transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/">
          <img
            src="/images/logo.png"
            alt="017Tag"
            className="h-12 w-auto cursor-pointer"
          />
        </Link>

        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          <Link href="/" className="hover:text-purple-400 transition">Início</Link>
          <Link href="/#sobre" className="hover:text-purple-400 transition">Sobre</Link>
          <Link href="/#servicos" className="hover:text-purple-400 transition">Serviços</Link>
          <Link href="/#projetos" className="hover:text-purple-400 transition">Projetos</Link>
          <Link href="/contato/contato" className="hover:text-purple-400 transition">Contato</Link>
        </nav>
      </div>
    </header>
  )
}
