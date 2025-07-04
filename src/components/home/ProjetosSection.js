"use client"
import { motion } from "framer-motion"
import { FaExternalLinkAlt, FaGithub, FaTimes } from "react-icons/fa"
import { Tooltip } from "react-tooltip"

const projetos = [
  {
    titulo: "Integrador KDS",
    descricao: "Integrador de sistemas para gestão de pedidos, com painel administrativo e integração com AnotaAi.",
    imagem: "/projetos/project017.jpg",
    tecnologias: ["JavaScript", "Tailwind", "Firebase"],
    link: "/",
    projetoStatus: "Projeto Privado",
  },
  {
    titulo: "Sistema de Laudos",
    descricao: "Plataforma com autenticação, upload e exibição de laudos do Google Drive, logs e envio automático de e-mails.",
    imagem: "/projetos/laudos.jpg",
    tecnologias: ["Firebase", "Next.js", "Node.js", "Google Drive"],
    link: "https://laudos.017tag.com",
    projetoStatus: "Projeto em Produção",
  },
  {
    titulo: "WSA Consórcios",
    descricao: "Landing page institucional com área de vendas de veículos e integração via WhatsApp.",
    imagem: "/projetos/wsa.jpg",
    tecnologias: ["WordPress", "Elementor"],
    link: "#",
    projetoStatus: "Projeto Pronto",
  },
]

function getStatusProps(status) {
  switch (status) {
    case "Projeto Privado":
      return {
        color: "bg-red-600 hover:bg-red-700",
        icon: <FaTimes className="text-xs" />,
        tooltip: "Este projeto é privado e por isso não é possível exibi-lo.",
      }
    case "Projeto Pronto":
      return {
        color: "bg-purple-700 hover:bg-purple-800",
        icon: <FaExternalLinkAlt className="text-xs" />,
        tooltip: "Este projeto está pronto e acessível publicamente.",
      }
    default:
      return {
        color: "bg-yellow-500 hover:bg-yellow-600 text-black",
        icon: <FaGithub className="text-xs" />,
        tooltip:
          "Este projeto está em produção e é possível acompanhar atualizações como commits e pull-requests pelo GitHub.",
      }
  }
}

export default function ProjetosSection() {
  return (
    <section className="py-24 px-6 bg-zinc-900 text-gray-100" id="projetos">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-extrabold text-center mb-14 text-purple-400 drop-shadow-md">
          Projetos Recentes
        </h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {projetos.map(({ titulo, descricao, imagem, tecnologias, link, projetoStatus }, i) => {
            const { color, icon, tooltip } = getStatusProps(projetoStatus)

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-zinc-800/70 border border-purple-700 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={imagem}
                    alt={`Imagem do projeto ${titulo}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-2">{titulo}</h3>
                    <p className="text-sm text-gray-300 mb-4">{descricao}</p>

                    <ul className="flex flex-wrap gap-2 text-xs text-purple-400 mb-4">
                      {tecnologias.map((tech, index) => (
                        <li
                          key={index}
                          className="bg-purple-700/20 px-2 py-1 rounded-md border border-purple-500"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-tooltip-id="projetos-tooltip"
                    data-tooltip-content={tooltip}
                    className={`mt-auto inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition ${color}`}
                  >
                    {projetoStatus}
                    {icon}
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Tooltip global - aparece para qualquer botão que use data-tooltip-id="projetos-tooltip" */}
      <Tooltip
        id="projetos-tooltip"
        place="bottom-end"
        effect="solid"
        className="z-50 bg-white text-zinc-800 text-sm px-3 py-2 rounded-md shadow-lg border border-zinc-300 max-w-[220px] text-center"
      />
    </section>
  )
}
