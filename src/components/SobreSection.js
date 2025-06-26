// components/SobreSection.js
"use client"
import { motion } from "framer-motion"

export default function SobreSection() {
  return (
    <section className="py-20 px-6 bg-black text-white">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-primary mb-6">Quem Somos</h2>
        <p className="text-gray-300 text-lg">
          Somos uma equipe especializada em desenvolvimento e integração web. Trabalhamos com tecnologias modernas e soluções sob medida para o seu negócio.
        </p>
      </motion.div>
    </section>
  )
}