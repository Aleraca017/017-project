"use client"
import Layout from "@/components/Layout"
import CarouselProjeto from "@/components/projetos/carousel"

const projetos = [
  {
    titulo: "Integrador KDS",
    descricao:
      "Sistema de integração entre PDVs e plataforma AnotaAi com painel de controle e autenticação.",
    imagens: [
      "/images/examples/1.jpg",
      "/images/examples/2.jpg",
      "/images/examples/3.jpg",
    ],
    tecnologias: ["JavaScript", "Tailwind", "Firebase"],
  },
  {
    titulo: "Sistema de Laudos",
    descricao:
      "Upload e visualização de laudos, autenticação segura e notificações por email.",
    imagens: ["/images/examples/4.jpg", "/images/examples/2.jpg"],
    tecnologias: ["Next.js", "Node.js", "Google Drive"],
  },
  
]

export default function ProjetosPage() {
  return (
    <Layout>
      {/* Conteúdo scrollável acima do fundo */}
      <section className="relative z-10 h-screen snap-y snap-mandatory overflow-y-scroll no-scrollbar bg-gradient-to-b from-black to-zinc-900">
        {projetos.map((projeto, idx) => {
          const isEven = idx % 2 === 0

          return (
            <div
              key={idx}
              className="h-screen snap-start flex flex-col items-center justify-center px-6 py-12 text-white"
            >
              <div
                className={`max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center ${
                  isEven ? "" : "md:flex-row-reverse md:[&>*:first-child]:order-last"
                }`}
              >
                <div>
                  <CarouselProjeto imagens={projeto.imagens} />
                </div>

                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-purple-400 mb-4">
                    {projeto.titulo}
                  </h2>
                  <p className="text-gray-300 mb-6">{projeto.descricao}</p>

                  <ul className="flex flex-wrap gap-2 text-sm">
                    {projeto.tecnologias.map((tech, i) => (
                      <li
                        key={i}
                        className="bg-purple-700/20 px-3 py-1 rounded-md border border-purple-500 text-purple-300"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </section>
    </Layout>
  )
}
