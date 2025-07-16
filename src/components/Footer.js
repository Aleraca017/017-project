"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp } from "react-icons/fa"

export default function Footer() {
  const pathname = usePathname()

  const mandaParaWpp = () => {
    window.open("https://wa.me/5511999999999", "_blank") // Substitua pelo seu número
  }

  const isProjetosPage = pathname === "/projetos"

  return (
    <footer
      className={`relative z-10 pt-16 pb-10 px-6 text-white ${
        isProjetosPage
          ? "bg-gradient-to-b from-transparent to-purple-950/50"
          : "bg-gradient-to-b from-zinc-900 to-purple-900"
      }`}
    >
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-4 sm:grid-cols-2 text-sm">
        
        {/* Logo e descrição */}
        <div className="col-span-full md:col-span-1 text-center md:text-left">
          <h3 className="text-3xl font-bold text-purple-500 mb-3">017Tag</h3>
          <p className="text-purple-200 text-sm leading-relaxed">
            Desenvolvimento web com soluções modernas em integração, performance e experiência.
          </p>
        </div>

        {/* Contato */}
        <div>
          <h4 className="text-purple-400 font-semibold mb-3">Contato</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>CNPJ: 11.111.111/0001-11</li>
            <li>Mogi das Cruzes - SP</li>
            <li>
              <Link href="/contato/contato" className="hover:underline text-white">
                Fale conosco
              </Link>
            </li>
          </ul>
        </div>

        {/* Informações */}
        <div>
          <h4 className="text-purple-400 font-semibold mb-3">Informações</h4>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <Link href="/politicas/politica-de-privacidade" className="hover:underline">
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link href="/politicas/termos-de-uso" className="hover:underline">
                Termos de Uso
              </Link>
            </li>
          </ul>
        </div>

        {/* Redes Sociais */}
        <div>
          <h4 className="text-purple-400 font-semibold mb-3">Redes Sociais</h4>
          <div className="flex gap-4 text-2xl text-purple-400">
            <Link href="https://github.com/seu-perfil" target="_blank" className="hover:text-white transition">
              <FaGithub />
            </Link>
            <Link href="https://linkedin.com/in/seu-perfil" target="_blank" className="hover:text-white transition">
              <FaLinkedin />
            </Link>
            <Link href="mailto:contato@017tag.com.br" className="hover:text-white transition">
              <FaEnvelope />
            </Link>
          </div>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="mt-12 text-center text-purple-300 text-xs">
        &copy; {new Date().getFullYear()} 017Tag. Todos os direitos reservados.
      </div>

      {/* Botão WhatsApp flutuante */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={mandaParaWpp}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition"
        >
          <FaWhatsapp className="text-xl" />
          <span className="text-sm font-semibold hidden sm:inline">WhatsApp</span>
        </button>
      </div>
    </footer>
  )
}
