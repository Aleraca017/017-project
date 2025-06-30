// components/HeroSection.js
"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const fullText = "const developer = '017Tag'"
  const [text, setText] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText[index])
        setIndex(index + 1)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [index])

  return (
    <section
  className="relative h-120 flex items-center justify-center px-6 text-center bg-cover bg-center bg-fixed"
  style={{ backgroundImage: "url('/images/hero.jpg')" }}
>
  <div className="absolute inset-0 bg-opacity-60 backdrop-brightness-90 backdrop-blur-[3px]" />
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="relative z-10"
  >
    <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
      Bem-vindo ao <span className="text-yellow-300">017Tag</span>
    </h1>
    <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-6">
      Desenvolvimento moderno com Next.js, React, Tailwind e Turbopack.
    </p>
    <p className="text-green-400 font-mono text-xl">
      {text}
      <span className="animate-pulse">_</span>
    </p>
  </motion.div>
</section>

  )
}