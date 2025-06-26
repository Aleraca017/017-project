"use client"
import Link from "next/link"
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp } from "react-icons/fa"

export default function Footer() {
  const mandaParaWpp = () => {
    window.open("https://wa.me/5511999999999", "_blank") // substitua pelo seu número
  }

  return (
    <footer className="bg-black text-white py-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl px-4 flex flex-col items-center gap-10 text-sm">

        {/* Logo e descrição */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-500">017Tag</h3>
          <p className="text-gray-400">Desenvolvimento e integração web</p>
        </div>

        {/* Grid com 4 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full text-left text-base">
          {/* Contato */}
          <div>
            <h1 className="mb-4 font-semibold">Contato</h1>
            <ul className="space-y-1">
              <li>CNPJ: 11.111.111/0001-11</li>
              <li>Mogi das Cruzes - SP</li>
              <li>
                <Link href="/contato/contato" className="text-white hover:underline">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Informações */}
          <div>
            <h1 className="mb-4 font-semibold">Informações</h1>
            <ul className="space-y-1">
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

          {/* Redes sociais */}
          <div>
            <h1 className="mb-4 font-semibold">Redes Sociais</h1>
            <div className="flex gap-4 text-xl">
              <Link href="https://github.com/seu-perfil" target="_blank" className="text-purple-400 hover:text-purple-300">
                <FaGithub />
              </Link>
              <Link href="https://www.linkedin.com/in/seu-perfil" target="_blank" className="text-purple-400 hover:text-purple-300">
                <FaLinkedin />
              </Link>
              <Link href="mailto:contato@017tag.com.br" className="text-purple-400 hover:text-purple-300">
                <FaEnvelope />
              </Link>
            </div>
          </div>

          {/* Parceiros */}
          <div>
            <h1 className="mb-4 font-semibold">Empresas Parceiras</h1>
            <p className="text-gray-400 text-sm">Em breve</p>
          </div>
        </div>

        {/* Direitos autorais */}
        <div className="pt-10 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} 017Tag. Todos os direitos reservados.
        </div>
      </div>

      {/* Botão WhatsApp fixo */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={mandaParaWpp}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-600 transition"
        >
          <FaWhatsapp className="text-xl" />
          <span className="text-sm font-semibold">WhatsApp</span>
        </button>
      </div>
    </footer>
  )
}
