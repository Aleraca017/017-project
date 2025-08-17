"use client"

import Link from "next/link"
import { FaArrowDown, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const fullText = "const developer = '017Tag'"
  const [text, setText] = useState("")
  const [index, setIndex] = useState(0)

  // Texto tipo typing
  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText[index])
        setIndex(index + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [index])

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center text-center overflow-hidden">
      {/* Vídeo de fundo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/bg1.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos em HTML5.
      </video>

      {/* Gradiente leve */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center max-w-3xl text-white px-6">
        <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight animate-fade-in">
          Soluções tecnológicas que impulsionam o seu negócio
        </h1>

        <p className="text-lg md:text-xl mb-4 max-w-xl animate-fade-in delay-200">
          Conectamos <strong className="text-purple-400">estratégia</strong>,{" "}
          <strong className="text-purple-400">design</strong> e{" "}
          <strong className="text-purple-400">tecnologia</strong> para desenvolver produtos digitais inteligentes, escaláveis e com alta performance.
        </p>

        <p className="text-base md:text-lg mb-8 max-w-xl animate-fade-in delay-400">
          Somos especialistas em soluções personalizadas usando as{" "}
          <span className="text-purple-400 font-semibold">principais</span> ferramentas do mercado.
        </p>

        {/* Texto animado */}
        <p className="text-purple-400 font-mono text-lg md:text-xl mb-6">
          {text}
          <span className="animate-pulse">_</span>
        </p>

        {/* CTA */}
        <div className="flex justify-center animate-fade-in delay-600">
          <Link href="#sobre" scroll={true}>
            <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-purple-700 transition transform hover:scale-105">
              Saiba mais
              <FaArrowDown className="animate-bounce" />
            </button>
          </Link>
        </div>

        {/* Redes sociais */}
        <nav className="flex justify-center gap-6 mt-10 text-xl animate-fade-in delay-800">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform">
            <FaGithub />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-transform">
            <FaLinkedin />
          </a>
          <a href="mailto:contato@017tag.com" className="hover:scale-125 transition-transform">
            <FaEnvelope />
          </a>
        </nav>
      </div>

      {/* Animações CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-800 { animation-delay: 0.8s; }
      `}</style>
    </section>
  )
}
