"use client"
import { motion } from "framer-motion"
import { FaExternalLinkAlt } from "react-icons/fa"

const projetos = [
  {
    titulo: "Integrador KDS",
    descricao: "Integradore de sistemas para gestão de pedidos, com painel administrativo e integração com AnotaAi.",
    imagem: "/projetos/project017.jpg",
    tecnologias: ["JavaScript", "Tailwind", "Firebase"],
    link: "https://github.com/017Tag/project017",
  },
  {
    titulo: "Sistema de Laudos",
    descricao: "Plataforma com autenticação, upload e exibição de laudos do Google Drive, logs e envio automático de e-mails.",
    imagem: "/projetos/laudos.jpg",
    tecnologias: ["Firebase", "Next.js", "Node.js", "Google Drive"],
    link: "https://laudos.017tag.com",
  },
  {
    titulo: "WSA Consórcios",
    descricao: "Landing page institucional com área de vendas de veículos e integração via WhatsApp.",
    imagem: "/projetos/wsa.jpg",
    tecnologias: ["WordPress", "Elementor"],
    link: "#", // Pode ser atualizado depois
  },
]

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
          {projetos.map(({ titulo, descricao, imagem, tecnologias, link }, i) => (
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
                  className="mt-auto inline-flex items-center justify-center gap-2 text-sm text-white font-medium bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-xl transition"
                >
                  Ver projeto
                  <FaExternalLinkAlt className="text-xs" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
