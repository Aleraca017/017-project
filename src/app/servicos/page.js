"use client"

import Layout from "@/components/Layout"
import { useState } from "react"
import { FaCode, FaCogs, FaGlobe, FaChartLine, FaRobot, FaTachometerAlt, FaMobileAlt, FaDatabase, FaShieldAlt, FaPaintBrush } from "react-icons/fa"

const servicos = [
  {
    titulo: "Desenvolvimento de Sistemas",
    resumo: "Soluções personalizadas para web e mobile.",
    descricao:
      "Criamos sistemas sob medida para atender necessidades específicas da sua empresa, incluindo painel administrativo, autenticação segura, integração com APIs e muito mais.",
    icone: <FaCode />,
  },
  {
    titulo: "Integração de Sistemas",
    resumo: "Conecte diferentes plataformas e softwares.",
    descricao:
      "Desenvolvemos soluções para integrar PDVs, CRMs, ERPs, marketplaces, APIs públicas ou privadas e diversas outras plataformas de forma eficiente e segura.",
    icone: <FaCogs />,
  },
  {
    titulo: "Landing Pages",
    resumo: "Páginas otimizadas para conversão.",
    descricao:
      "Criamos landing pages modernas, rápidas e responsivas com foco em conversão, ideais para campanhas de marketing, lançamentos ou captação de leads.",
    icone: <FaGlobe />,
  },
  {
    titulo: "Sites Institucionais",
    resumo: "Fortaleça sua presença digital.",
    descricao:
      "Desenvolvemos sites institucionais com identidade visual moderna, estrutura de SEO, acessibilidade e integração com ferramentas como Google Analytics e formulários de contato.",
    icone: <FaChartLine />,
  },
  {
    titulo: "Automação de Processos",
    resumo: "Ganhe produtividade automatizando tarefas repetitivas.",
    descricao:
      "Automatizamos rotinas administrativas, envio de relatórios, agendamentos, disparo de emails, monitoramento de sistemas e muito mais.",
    icone: <FaRobot />,
  },
  {
    titulo: "Painéis Administrativos",
    resumo: "Gerencie seus dados com eficiência.",
    descricao:
      "Criamos dashboards personalizados com gráficos, filtros, tabelas dinâmicas e gestão de permissões para facilitar o controle de informações e operações.",
    icone: <FaTachometerAlt />,
  },
  {
    titulo: "Aplicativos Mobile",
    resumo: "Apps nativos e híbridos para Android e iOS.",
    descricao:
      "Desenvolvemos aplicativos com foco em performance, usabilidade e escalabilidade, com publicação nas lojas e suporte técnico contínuo.",
    icone: <FaMobileAlt />,
  },
  {
    titulo: "Banco de Dados e Back-end",
    resumo: "Infraestrutura sólida para seus sistemas.",
    descricao:
      "Projetamos e otimizamos bancos de dados relacionais e NoSQL, com APIs robustas e seguras para integração e performance em escala.",
    icone: <FaDatabase />,
  },
  {
    titulo: "Segurança de Sistemas",
    resumo: "Proteja seus dados e aplicações.",
    descricao:
      "Implementamos práticas modernas de segurança, como criptografia, autenticação multifator, prevenção a ataques e monitoramento contínuo.",
    icone: <FaShieldAlt />,
  },
  {
    titulo: "Design de Interfaces",
    resumo: "Experiências visuais impactantes.",
    descricao:
      "Criamos interfaces bonitas e funcionais, com foco em experiência do usuário, acessibilidade e consistência visual.",
    icone: <FaPaintBrush />,
  },
]

export default function ServicosPage() {
  const [ativo, setAtivo] = useState(null)

  return (
    <Layout>
      <section className="min-h-screen py-20 px-4 md:px-12 bg-gradient-to-b from-purple-400 via-black to-zinc-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-10 text-white text-center drop-shadow-md">
            Serviços
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {servicos.map((servico, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ease-in-out bg-zinc-800 p-6 rounded-2xl border-2 border-purple-700/50 hover:border-purple-400/80 shadow-lg cursor-pointer relative group overflow-hidden ${
                  ativo === index ? "bg-zinc-700/70" : ""
                }`}
                onClick={() => setAtivo(ativo === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl text-purple-300">
                    {servico.icone}
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-purple-300 group-hover:text-purple-100">
                    {servico.titulo}
                  </h2>
                </div>

                <p className="text-gray-300 mb-2 mt-2 text-sm md:text-base">
                  {servico.resumo}
                </p>

                <div className={`text-sm text-gray-200 mt-3 transition-all duration-300 ease-in-out ${
                  ativo === index ? "opacity-100 max-h-[300px]" : "opacity-0 max-h-0 overflow-hidden"
                }`}> 
                  {servico.descricao}
                </div>

                {ativo !== index && (
                  <p className="text-xs text-purple-400 mt-2 italic">
                    Toque para expandir ↓
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
