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
            Política de Privacidade
          </h1>

         <div className="space-y-8 text-purple-100 text-justify text-sm md:text-base">
  <p>
    Esta Política de Privacidade descreve como coletamos, utilizamos e protegemos os dados fornecidos por você ao acessar nosso site e a área restrita de usuários.
  </p>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">1. Dados Coletados</h2>
    <p>
      Coletamos:
      <ul className="list-disc pl-5 mt-2">
        <li>Nome, e-mail e número de WhatsApp enviados via formulário de contato.</li>
        <li>Credenciais de acesso (e-mail e senha) para usuários com login autorizado pela equipe.</li>
        <li>Informações de solicitações de suporte criadas na área restrita.</li>
        <li>Dados técnicos como endereço IP e data/hora de acesso para fins de segurança.</li>
      </ul>
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">2. Armazenamento e Segurança</h2>
    <p>
      Todos os dados são armazenados no Firebase (Google), que segue padrões internacionais de segurança e criptografia. Apenas a equipe autorizada tem acesso às informações, e o acesso é controlado por autenticação segura.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">3. Finalidade do Uso</h2>
    <p>
      Utilizamos seus dados para:
      <ul className="list-disc pl-5 mt-2">
        <li>Responder solicitações de contato enviadas pelo site.</li>
        <li>Gerenciar seu acesso à área restrita.</li>
        <li>Registrar e acompanhar solicitações de suporte.</li>
        <li>Garantir a segurança da conta e do sistema.</li>
      </ul>
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">4. Compartilhamento</h2>
    <p>
      Não compartilhamos seus dados com terceiros, exceto quando exigido por lei ou para cumprir obrigações legais.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">5. Seus Direitos</h2>
    <p>
      Você pode solicitar a atualização ou exclusão de suas informações entrando em contato com nossa equipe. A exclusão de dados de login implica na perda de acesso à área restrita.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">6. Alterações</h2>
    <p>
      Podemos alterar esta política a qualquer momento. Você receberá um e-mail informando qualquer alteração, porém, recomendamos que você a revise periodicamente.
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
