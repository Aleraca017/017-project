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
        <div className="relative z-10 h-screen snap-y snap-mandatory overflow-y-scroll no-scrollbar bg-gradient-to-b from-purple-950/40 to-black-950"> 
        {projetos.map((projeto, idx) => {
          const isEven = idx % 2 === 0

          return (
            <div
              key={idx}
              className="h-screen w-full snap-start flex flex-col items-center justify-center px-6 py-12 text-white"
            >
              <div
                className={`w-90/100 grid md:grid-cols-2 gap-10 items-center ${
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
                      <a href={'https://google.com.br/search?q=O que é '+tech+'?'} target="_blank">
                      <li
                        key={i}
                        className="bg-purple-700/30 hover:bg-purple-700/70 px-3 py-1 rounded-md border-2 border-purple-500 hover:border-purple-300 text-purple-300 hover:text-purple-100 hover:cursor-pointer"
                      >
                        {tech}
                      </li>
                      </a>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
        </div>
      </section>
    </Layout>
  )
}
