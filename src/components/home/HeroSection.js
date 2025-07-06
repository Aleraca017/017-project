"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Link from "next/link"
import { FaArrowDown, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa"

export default function HeroSection() {
  const fullText = "const developer = '017Tag'"
  const [text, setText] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText[index])
        setIndex(index + 1)
      }, 100)
      return () => clearTimeout(timeout)
    } })

  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center px-6 py-24 text-center bg-cover bg-center bg-fixed overflow-hidden"
      style={{ backgroundImage: "url('/images/hero.jpg')" }}
      aria-label="Seção principal de apresentação da empresa"
    >
      {/* Camada escura + gradiente animado */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/30 to-transparent animate-pulse-slow" />
      </div>

      <motion.header
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-3xl flex flex-col items-center"
      >
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
          Soluções tecnológicas que impulsionam o seu negócio
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-4 max-w-xl">
          Conectamos <strong className="text-purple-400">estratégia</strong>, <strong className="text-purple-400">design</strong> e <strong className="text-purple-400">tecnologia</strong> para desenvolver produtos digitais inteligentes, escaláveis e com alta performance.
        </p>

        <p className="text-base md:text-lg text-gray-300 mb-8 max-w-xl">
          Somos especialistas em soluções personalizadas usando <span className="text-purple-400 font-semibold">Next.js</span>, <span className="text-purple-400 font-semibold">React</span> e ferramentas modernas para transformar ideias em realidade.
        </p>

        {/* Texto animado */}
        <p className="text-purple-400 font-mono text-lg md:text-xl mb-6" aria-hidden="true">
          {text}
          <span className="animate-pulse">_</span>
        </p>

        {/* CTA */}
        <div className="flex justify-center">
          <Link href="#sobre" scroll={true}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-purple-700 transition"
              aria-label="Saiba mais sobre a 017Tag"
            >
              Saiba mais
              <FaArrowDown className="animate-bounce" />
            </motion.button>
          </Link>
        </div>

        {/* Redes sociais */}
        <nav className="flex justify-center gap-6 mt-10 text-white text-xl" aria-label="Redes sociais">
          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            aria-label="GitHub da 017Tag"
            title="GitHub"
          >
            <FaGithub />
          </motion.a>
          <motion.a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2 }}
            aria-label="LinkedIn da 017Tag"
            title="LinkedIn"
          >
            <FaLinkedin />
          </motion.a>
          <motion.a
            href="mailto:contato@017tag.com"
            whileHover={{ scale: 1.2 }}
            aria-label="Enviar e-mail para a 017Tag"
            title="E-mail"
          >
            <FaEnvelope />
          </motion.a>
        </nav>
      </motion.header>
    </section>
  )
}
