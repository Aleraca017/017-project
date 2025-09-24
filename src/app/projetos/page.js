"use client"
import Layout from "@/components/Layout"
import CarouselProjeto from "@/components/projetos/carousel"

const projetos = [
  {
    titulo: "Integrador KDS",
    id: "integrador-kds",
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
    id: "sistema-de-laudos",
    descricao:
      "Upload e visualização de laudos, autenticação segura e notificações por email.",
    imagens: ["/images/examples/4.jpg", "/images/examples/2.jpg"],
    tecnologias: ["Next.js", "Node.js", "Google Drive"],
  },
]

export default function ProjetosPage() {
  return (
    <Layout>
      <section className="relative min-h-screen snap-y snap-mandatory overflow-y-auto no-scrollbar bg-gradient-to-b from-black to-zinc-900">
        {/* Fundo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none  brightness-[0.5]"
        >
          <source src="/videos/projetos.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos em HTML5.
        </video>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 space-y-24">
          {projetos.map((projeto, idx) => {
            const isEven = idx % 2 === 0

            return (
              <section
                key={idx}
                id={projeto.id}
                className={`snap-start flex flex-col items-center justify-center gap-12 text-white ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
              >
                <div className="w-full md:w-1/2">
                  <CarouselProjeto imagens={projeto.imagens} />
                </div>

                <div className="w-full md:w-1/2">
                  <h2 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4">
                    {projeto.titulo}
                  </h2>
                  <p className="text-gray-100 mb-6">{projeto.descricao}</p>

                  <ul className="flex flex-wrap gap-2 text-sm">
                    {projeto.tecnologias.map((tech, i) => (
                      <li
                        key={i}
                        className="bg-purple-700/30 hover:bg-purple-700/70 px-3 py-1 rounded-md border-2 border-purple-500 hover:border-purple-300 text-purple-300 hover:text-purple-100 hover:cursor-pointer"
                      >
                        <a
                          href={`https://google.com.br/search?q=O que é ${encodeURIComponent(
                            tech
                          )}?`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {tech}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )
          })}
        </div>

      </section>
    </Layout>
  )
}
