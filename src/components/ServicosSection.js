// components/ServicosSection.js
"use client"
import { motion } from "framer-motion"

export default function ServicosSection() {
  return (
    <section className="py-20 px-6 bg-purple-600 text-white">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl text-center mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-primary">Serviços</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left mt-8">
          <motion.div whileHover={{ scale: 1.03 }} className="bg-zinc-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Desenvolvimento Web</h3>
            <p className="text-sm text-gray-300">
              Sites institucionais, landing pages e sistemas sob medida.
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="bg-zinc-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Integrações</h3>
            <p className="text-sm text-gray-300">
              Integrações com APIs, bancos de dados e automações.
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="bg-zinc-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Consultoria</h3>
            <p className="text-sm text-gray-300">
              Diagnóstico técnico, estruturação de projetos e otimizações.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}