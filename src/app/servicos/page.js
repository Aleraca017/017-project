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
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/mobile/code-sunset.png')] md:bg-[url('/images/code-sunset.png')] blur-[px] bg-cover bg-center z-0" />
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10" />

        {/* Conteúdo */}
        <div className="relative z-20 w-full px-8 md:px-50 mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-16 text-white text-center">
            O que oferecemos
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicos.map((servico, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center bg-white/5 backdrop-blur-xl rounded-2xl p-6"
              >
                <div className="w-full mb-4">
                  <Lottie className="h-48 mx-auto" path={servico.lottie} loop autoplay />
                </div>
                <h2 className="text-xl font-semibold text-purple-100 mb-2">
                  {servico.titulo}
                </h2>
                <p className="text-white font-medium mb-1">{servico.resumo}</p>
                <p className="text-purple-200 text-sm">{servico.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
