"use client"
import Layout from "@/components/Layout"
import { useState } from "react"
import Lottie from "lottie-react"
import animationData from "@/../public/lotties/contato/Animation1.json"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Formulário enviado:", formData)
  }

  return (
    <Layout>
      <section className="relative min-h-screen flex items-center justify-center px-6 py-16 text-white overflow-hidden">

        {/* VÍDEO DE FUNDO */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.8]"
        >
          <source src="/videos/contatc.mp4" type="video/mp4" />s
          Seu navegador não suporta vídeos em HTML5.
        </video>

        {/* CAMADA DE CONTEÚDO */}
        <div className="relative z-10 max-w-6xl w-full grid md:grid-cols-2 gap-12">

          {/* Lado da Animação e Info */}
          <div className="flex flex-col justify-center items-center md:w-[90%] w-full md:items-start text-center md:text-left">
            <Lottie animationData={animationData} loop className="w-full mb-6" />

            <div className="w-full bg-zinc-900/60 backdrop-blur-xl rounded-xl p-4 text-left text-sm text-gray-300 shadow-md border border-purple-700/30">
              <p className="font-semibold text-purple-400 mb-2">Por que falar com a 017Tag?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Atendimento direto com especialistas</li>
                <li>Respostas rápidas por e-mail ou WhatsApp</li>
                <li>Orçamento sem compromisso</li>
              </ul>
            </div>
          </div>

          {/* Lado do Formulário */}
          <div className="w-full bg-zinc-900/70 backdrop-blur-xl rounded-xl p-8 border border-purple-800/20 shadow-lg">
            <h1 className="text-3xl font-bold text-purple-400 mb-2">Entre em Contato</h1>

            <h2 className="text-lg text-gray-300 mb-4">
              Tire dúvidas, compartilhe ideias ou inicie um projeto com a gente.
            </h2>

            <div className="h-1 w-16 bg-purple-500 rounded-full mb-6"></div>

            <div className="space-y-1 text-sm text-gray-400 mb-8">
              <p>Email: contato@017tag.com.br</p>
              <p>WhatsApp: (11) 99999-9999</p>
              <p>Localização: Mogi das Cruzes - SP</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nome"
                placeholder="Seu nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-400"
              />

              <input
                type="email"
                name="email"
                placeholder="Seu e-mail"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-400"
              />

              <textarea
                name="mensagem"
                placeholder="Escreva sua mensagem..."
                value={formData.mensagem}
                onChange={handleChange}
                required
                rows={5}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-400"
              />

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 transition rounded-lg px-6 py-3 font-semibold w-full"
              >
                Enviar Mensagem
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-10">
              Estamos prontos para ajudar no seu próximo projeto digital.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
