// components/ProjetosSection.js
"use client"
import { motion } from "framer-motion"

export default function ProjetosSection() {
  return (
    <section className="py-20 px-6 bg-white text-purple-600">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-5xl w-full mx-auto">
        <h2 className="text-3xl font-bold text-primary text-center mb-10">Projetos Recentes</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div whileHover={{ translateY: -4 }} className="bg-gray-800 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Project 017</h3>
            <p className="text-sm text-gray-300">Portfólio pessoal com animações e design moderno.</p>
          </motion.div>
          <motion.div whileHover={{ translateY: -4 }} className="bg-gray-800 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Sistema de Laudos</h3>
            <p className="text-sm text-gray-300">Plataforma para emissão e visualização de laudos online.</p>
          </motion.div>
          <motion.div whileHover={{ translateY: -4 }} className="bg-gray-800 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">WSA Consórcios</h3>
            <p className="text-sm text-gray-300">Landing institucional e página de vendas de veículos.</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}