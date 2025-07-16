"use client"

import { motion } from "framer-motion"
import { FaCogs, FaRocket, FaHeadset } from "react-icons/fa"

export default function SobreSection() {
  return (
    <section
      id="sobre"
      className="py-24 px-6 bg-black text-white"
      aria-label="Seção sobre a empresa"
    >
      {/* Bloco principal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12"
      >
        {/* Conteúdo textual */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-purple-500 mb-6">
            Quem Somos
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            A <strong className="text-white">017Tag</strong> é uma empresa de soluções tecnológicas especializada em desenvolvimento web, integração de sistemas e produtos digitais sob medida. 
          </p>
          <p className="text-gray-400 text-base leading-relaxed">
            Combinamos estratégia, design e engenharia de software para transformar desafios em soluções inteligentes e escaláveis. Nosso time é formado por profissionais apaixonados por inovação, performance e boas práticas.
          </p>
        </div>

        {/* Imagem ilustrativa */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1"
        >
          <img
            src="/images/sobre.svg"
            alt="Equipe de desenvolvimento da 017Tag"
            className="w-full max-w-md mx-auto"
          />
        </motion.div>
      </motion.div>

      {/* Diferenciais */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-20 max-w-6xl mx-auto text-center"
      >
        <h3 className="text-3xl font-bold text-white mb-12">Nossos diferenciais</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-zinc-800/70 p-6 rounded-2xl border-2 border-purple-600 shadow-lg"
          >
            <FaCogs className="text-purple-400 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Soluções sob medida</h4>
            <p className="text-gray-300 text-sm">
              Desenvolvemos sistemas personalizados, adaptados à realidade e aos objetivos do seu negócio.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-zinc-800/70 p-6 rounded-2xl border-2 border-purple-600 shadow-lg"
          >
            <FaRocket className="text-purple-400 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Alta performance</h4>
            <p className="text-gray-300 text-sm">
              Utilizamos tecnologias modernas como Next.js, React e Tailwind para garantir velocidade e eficiência.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-zinc-800/70 p-6 rounded-2xl border-2 border-purple-600 shadow-lg"
          >
            <FaHeadset className="text-purple-400 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-semibold mb-2">Suporte próximo</h4>
            <p className="text-gray-300 text-sm">
              Acompanhamos todo o processo e oferecemos suporte humanizado, claro e ágil.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
