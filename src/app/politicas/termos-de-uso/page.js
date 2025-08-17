"use client"

import Layout from "@/components/Layout"

export default function PoliticaPage() {
  return (
    <Layout>
      <section className="relative min-h-screen py-20 px-4 text-white overflow-hidden">
        {/* Fundo com blur */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/mobile/servoces.png')] md:bg-[url('/images/servoces.png')] blur-[px] bg-cover bg-center z-0" />
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10" />

        {/* Conteúdo */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-10 backdrop-blur-2xl py-16 rounded-2xl border-2 border-purple-700">
          <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-white">
            Termos de Uso
          </h1>

         <div className="space-y-8 text-purple-100 text-justify text-sm md:text-base">
  <p>
    Estes Termos de Uso regulam o acesso ao nosso site e à área restrita para usuários autorizados.
  </p>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">1. Cadastro e Acesso</h2>
    <p>
      O acesso à área restrita é concedido apenas a usuários cadastrados pela nossa equipe. Não é permitido criar contas por conta própria. É proibido compartilhar suas credenciais de acesso com terceiros.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">2. Uso da Área Restrita</h2>
    <p>
      Usuários autenticados podem visualizar e criar solicitações de suporte. Todas as informações inseridas devem ser verdadeiras e relacionadas ao atendimento solicitado.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">3. Responsabilidade do Usuário</h2>
    <p>
      Você é responsável por manter a confidencialidade da sua senha e pelas ações realizadas na sua conta. Em caso de suspeita de uso indevido, informe imediatamente a equipe.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">4. Limitação de Responsabilidade</h2>
    <p>
      Nos esforçamos para manter o sistema disponível e seguro, mas não garantimos funcionamento ininterrupto. Não nos responsabilizamos por perdas resultantes de falhas técnicas, manutenção ou uso incorreto do sistema.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">5. Alterações nos Termos</h2>
    <p>
      Podemos atualizar estes termos a qualquer momento. A continuidade do uso após alterações implica na aceitação da nova versão.
    </p>
  </div>

  <p className="text-purple-300">
    Última atualização: 13 de agosto de 2025
  </p>
</div>


        </div>
      </section>
    </Layout>
  )
}
