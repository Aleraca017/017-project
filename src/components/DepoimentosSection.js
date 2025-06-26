// components/DepoimentosSection.js
"use client"
import { motion } from "framer-motion"

const depoimentos = [
  {
    nome: "João Silva",
    empresa: "JS Tech",
    texto: "A equipe da 017Tag foi fundamental para o sucesso do nosso projeto. Profissionalismo e dedicação excepcionais!",
  },
  {
    nome: "Maria Oliveira",
    empresa: "Agência MO",
    texto: "Serviço excelente, entrega dentro do prazo e suporte impecável. Recomendo sem dúvidas!",
  },
  {
    nome: "Carlos Pereira",
    empresa: "CP Solutions",
    texto: "Desenvolvimento moderno e atendimento personalizado. Fiquei muito satisfeito com o resultado.",
  },
]

export default function DepoimentosSection() {
  return (
    <section
      id="depoimentos"
      className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 py-20 text-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/dinamico1.jpg')" }}
    >
      {/* Overlay para escurecer e blur */}
      <div className="absolute inset-0 bg-opacity-40 backdrop-blur-sm backdrop-brightness-50" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl w-full"
      >
        <h2 className="text-4xl font-bold text-purple-400 mb-12">O que nossos clientes dizem</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {depoimentos.map(({ nome, empresa, texto }, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-900 bg-opacity-70 rounded-lg p-6 text-white shadow-lg flex flex-col justify-between h-full"
            >
              <div className="mb-6">
                <p className="italic text-sm md:text-base">“{texto}”</p>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-semibold text-purple-400 text-base md:text-lg">{nome}</h3>
                <p className="text-sm text-gray-300">{empresa}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
