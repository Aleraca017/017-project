"use client"

import { motion } from "framer-motion"

const depoimentos = [
  {
    nome: "Eduardo Mendonça",
    empresa: "SuperDog do Luiz",
    cargo: "Business Intelligence",
    texto:
      "A equipe da 017Tag foi fundamental para o sucesso do nosso projeto. Profissionalismo e dedicação excepcionais!",
    avatar: "/images/clients/eduardo-SDL.png",
  },
  {
    nome: "Gerson Viana",
    empresa: "Laborativa Seglabor",
    cargo: "Diretor Geral",
    texto:
      "Desenvolvimento moderno e atendimento personalizado. Fiquei muito satisfeito com o resultado.",
    avatar: "/avatars/carlos.jpg",
  },
  {
    nome: "Matheus Neves",
    empresa: "WSA Administrdora de Consórcios",
    cargo: "Gerente de negócios",
    texto:
      "Serviço excelente, entrega dentro do prazo e suporte impecável. Recomendo sem dúvidas!",
    avatar: "/images/clients/matheus-WSA.png",
  }
]

export default function DepoimentosSection() {
  return (
    <section
      id="depoimentos"
      className="relative py-24 px-6 text-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/dinamico1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/70  z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-14 drop-shadow-lg">
          O que nossos clientes dizem
        </h2>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {depoimentos.map(({ nome, empresa, cargo, texto, avatar }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 text-white shadow-lg shadow-purple-500 border-3 border-purple-500 max-w-md mx-auto hover:scale-105 hover:shadow-2xl transition-transform duration-300 flex flex-col items-center"
              style={{ minHeight: "360px" }}
            >
              <img
                src={avatar}
                alt={`Foto de ${nome}`}
                className="w-20 h-20 rounded-full border-4 border-purple-500 object-cover shadow-md mb-4"
              />
              <h3 className="font-semibold text-purple-300 text-xl">{nome}</h3>
              <p className="text-sm text-zinc-400 italic mb-1">{cargo}</p>  {/* cargo */}
              <p className="text-sm text-purple-200 mb-6">{empresa}</p>
              
              <p className="text-sm md:text-base text-left text-purple-100 leading-relaxed tracking-wide relative before:content-['“'] before:text-purple-400 before:text-3xl before:absolute before:-left-4 before:-top-2 after:content-['”'] after:text-purple-400 after:text-3xl after:ml-1 block max-w-[90%]">
                {texto}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
