"use client"

import Layout from "@/components/Layout"

export default function SobrePage() {
  return (
    <Layout>
      <section className="relative min-h-screen py-20 px-4 text-white overflow-hidden">
        {/* VÍDEO DE FUNDO */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-0 w-full h-full object-cover pointer-events-none  brightness-[0.5]"
        >
          <source src="/videos/sobre.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos em HTML5.
        </video>

        

        {/* CONTEÚDO */}
        <div className="relative z-20 max-w-6xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-400 drop-shadow-lg mb-6">
            Sobre Nós
          </h1>
          <p className="text-white/80 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
            Somos uma equipe apaixonada por tecnologia e inovação. Desenvolvemos soluções digitais com propósito, conectando ideias à experiência do usuário.
          </p>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Missão */}
            <div className="bg-white/5 border border-purple-500 rounded-xl p-6 backdrop-blur-md shadow-lg hover:shadow-purple-500/40 transition-all duration-300">
              <h2 className="text-xl font-semibold text-purple-300 mb-2">
                Missão
              </h2>
              <p className="text-white/90 text-sm">
                Transformar ideias em experiências digitais de alto impacto com qualidade, eficiência e foco no usuário.
              </p>
            </div>

            {/* Visão */}
            <div className="bg-white/5 border border-purple-500 rounded-xl p-6 backdrop-blur-md shadow-lg hover:shadow-purple-400/40 transition-all duration-300">
              <h2 className="text-xl font-semibold text-purple-300 mb-2">
                Visão
              </h2>
              <p className="text-white/90 text-sm">
                Ser reconhecida como referência em soluções tecnológicas personalizadas e sustentáveis.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-white/5 border border-purple-500 rounded-xl p-6 backdrop-blur-md shadow-lg hover:shadow-purple-600/40 transition-all duration-300">
              <h2 className="text-xl font-semibold text-purple-300 mb-2">
                Valores
              </h2>
              <ul className="text-white/90 text-sm list-disc list-inside text-left space-y-1">
                <li>Transparência e ética</li>
                <li>Foco no cliente</li>
                <li>Inovação constante</li>
                <li>Excelência técnica</li>
                <li>Trabalho em equipe</li>
              </ul>
            </div>
          </div>

          {/* DESTAQUES FUTURISTAS */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* História */}
            <div className="bg-white/5 border-l-4 border-purple-500 p-6 rounded-xl backdrop-blur-md">
              <h3 className="text-2xl text-purple-300 font-semibold mb-3">Nossa História</h3>
              <p className="text-white/80 text-sm">
                Fundada por profissionais experientes em desenvolvimento e design, nossa empresa cresceu com o propósito de oferecer soluções digitais sob medida, aliando criatividade e tecnologia em cada projeto.
              </p>
            </div>

            {/* Diferenciais */}
            <div className="bg-white/5 border-l-4 border-purple-500 p-6 rounded-xl backdrop-blur-md">
              <h3 className="text-2xl text-purple-300 font-semibold mb-3">O Que Nos Torna Únicos</h3>
              <ul className="text-white/80 text-sm list-disc list-inside space-y-1">
                <li>Atendimento personalizado</li>
                <li>Projetos sob medida</li>
                <li>Design centrado no usuário</li>
                <li>Performance e segurança como prioridade</li>
              </ul>
            </div>
          </div>

          {/* FRASE FINAL */}
          <div className="mt-20 border-t border-white/20 pt-8">
            <h3 className="text-2xl text-purple-300 font-semibold mb-4">
              “Tecnologia é o presente. Inovação é o nosso futuro.”
            </h3>
            <p className="text-white/70 text-sm">
              Estamos sempre prontos para o próximo desafio. Vamos construir algo incrível juntos.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
