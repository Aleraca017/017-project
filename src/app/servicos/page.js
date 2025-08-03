"use client"

import Layout from "@/components/Layout"
import { useState } from "react"
import Lottie from "lottie-react"

const servicos = [
  {
    titulo: "Soluções Web e Mobile",
    resumo: "Desenvolvimento de sites, sistemas e aplicativos sob medida.",
    descricao:
      "Criamos soluções digitais personalizadas com foco em performance, usabilidade e escalabilidade. Atendemos desde landing pages até sistemas completos e apps publicados nas lojas.",
    lottie: "@/../lotties/servicos/dev-web.json",
  },
  {
    titulo: "Integrações e Automação",
    resumo: "Conecte ferramentas e otimize tarefas repetitivas.",
    descricao:
      "Automatizamos processos empresariais e integramos sistemas como CRMs, ERPs, APIs e plataformas externas, reduzindo erros e aumentando a produtividade.",
    lottie: "@/../lotties/servicos/automation.json",
  },
  {
    titulo: "Dashboards e Painéis",
    resumo: "Visualização de dados com eficiência e clareza.",
    descricao:
      "Criamos painéis administrativos completos com gráficos, filtros e controle de permissões, facilitando o acompanhamento e tomada de decisões.",
    lottie: "@/../lotties/servicos/dashboard.json",
  },
  {
    titulo: "Segurança e Back-end",
    resumo: "Infraestrutura robusta e proteção de dados.",
    descricao:
      "Implementamos práticas avançadas de segurança com autenticação multifator, criptografia, monitoramento, além de back-ends eficientes com bancos relacionais e NoSQL.",
    lottie: "@/../lotties/servicos/backend.json",
  },
  {
    titulo: "Consultoria Digital",
    resumo: "Planejamento e estratégias para o seu projeto.",
    descricao:
      "Ajudamos empresas a tirar ideias do papel com planejamento técnico, estudo de viabilidade e definição das melhores tecnologias para cada cenário.",
    lottie: "@/../lotties/servicos/digital-agency.json",
  },
]

export default function ServicosPage() {
  return (
    <Layout>
      <section className="relative min-h-screen py-20 px-4 text-white overflow-hidden">

        {/* Fundo com blur */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-[url('/images/mobile/code-sunset.png')] md:bg-[url('/images/code-sunset.png')] blur-[7px] bg-cover bg-center z-0"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-10" />

        {/* Conteúdo */}
        <div className="relative z-20 w-full px-8 md:px-50 mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-16 text-white text-center drop-shadow-md">
            O que oferecemos
          </h1>

          <div className="flex flex-col gap-32">
            {servicos.map((servico, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="w-full md:w-1/2">
                  <Lottie className="h-64" path={servico.lottie} loop autoplay />
                </div>
                <div className="w-full md:w-1/2">
                  <h2 className="text-2xl md:text-3xl font-semibold text-purple-600 text-shadow-sm text-shadow-purple-700 mb-4">
                    {servico.titulo}
                  </h2>
                  <p className="text-white text-lg mb-2 font-semibold">{servico.resumo}</p>
                  <p className="text-purple-300 text-sm">{servico.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
