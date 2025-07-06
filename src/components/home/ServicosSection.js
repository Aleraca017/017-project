"use client"

import { motion } from "framer-motion"
import { FaCode, FaSyncAlt, FaLightbulb, FaDatabase, FaRocket, FaMobileAlt, FaWhatsapp } from "react-icons/fa"
import Link from "next/link"

export default function ServicosSection() {
  return (
    <section
      id="servicos"
      className="py-24 px-6 bg-gradient-to-b to-purple-500 from-purple-700 text-white"
      aria-label="Seção de serviços oferecidos"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl font-extrabold mb-4">O que fazemos</h2>
        <p className="text-lg text-purple-100 mb-12 max-w-2xl mx-auto">
          Atuamos com soluções completas para transformar sua ideia em um produto digital de alta performance.
        </p>

        {/* Grid de serviços */}
        <div className="grid gap-8 md:grid-cols-3 text-left">
          {/* Serviço 1 */}
          <motion.div whileHover={{ scale: 1.03 }} className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-lg">
            <FaCode className="text-white text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Desenvolvimento Web</h3>
            <p className="text-sm text-purple-100">
              Sites, sistemas, painéis administrativos e produtos sob medida com foco em performance e usabilidade.
            </p>
          </motion.div>

          {/* Serviço 2 */}
          <motion.div whileHover={{ scale: 1.03 }} className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-lg">
            <FaSyncAlt className="text-white text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Integrações Inteligentes</h3>
            <p className="text-sm text-purple-100">
              Conectamos APIs, bancos de dados e sistemas legados, automatizando processos e acelerando resultados.
            </p>
          </motion.div>

          {/* Serviço 3 */}
          <motion.div whileHover={{ scale: 1.03 }} className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-lg">
            <FaLightbulb className="text-white text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Consultoria Técnica</h3>
            <p className="text-sm text-purple-100">
              Ajudamos você a estruturar seu projeto, validar ideias e melhorar a eficiência técnica do seu time.
            </p>
          </motion.div>

          {/* Serviço 4 */}
          <motion.div whileHover={{ scale: 1.03 }} className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-lg">
            <FaRocket className="text-white text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lançamentos Digitais</h3>
            <p className="text-sm text-purple-100">
              Criamos landing pages e estrutura de marketing digital para apoiar lançamentos e campanhas online.
            </p>
          </motion.div>

          {/* Serviço 5 */}
          <motion.div whileHover={{ scale: 1.03 }} className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-lg">
            <FaMobileAlt className="text-white text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Responsividade & UX</h3>
            <p className="text-sm text-purple-100">
              Garantimos que seu projeto seja adaptável, acessível e intuitivo em qualquer dispositivo.
            </p>
          </motion.div>

          {/* Serviço 6 */}
          <motion.div whileHover={{ scale: 1.03 }} className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-lg">
            <FaDatabase className="text-white text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Banco de Dados & Otimização</h3>
            <p className="text-sm text-purple-100">
              Estruturamos, otimizamos e mantemos bancos de dados seguros, escaláveis e eficientes.
            </p>
          </motion.div>
        </div>

        {/* CTA final */}
        <div className="mt-20">
          <h4 className="text-2xl font-bold mb-4">
            Tem um projeto em mente? Vamos conversar!
          </h4>
          <p className="text-purple-100 mb-6">
            Estamos prontos para entender suas necessidades e oferecer a melhor solução tecnológica.
          </p>
          <div className="flex justify-center">
  <Link
    href="https://wa.me/5511999999999"
    target="_blank"
    rel="noopener noreferrer"
  >
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-3 bg-white text-purple-700 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition"
      aria-label="Iniciar conversa no WhatsApp"
    >
      <FaWhatsapp className="text-xl" />
      Falar no WhatsApp
    </motion.button>
  </Link>
</div>
        </div>
      </motion.div>
    </section>
  )
}
