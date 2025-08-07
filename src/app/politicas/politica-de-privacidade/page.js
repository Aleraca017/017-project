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
    Esta Política de Privacidade descreve como tratamos os dados fornecidos por você ao utilizar o formulário de contato disponível em nosso site.
  </p>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">1. Coleta de Dados</h2>
    <p>
      Coletamos apenas os dados inseridos voluntariamente por você no formulário de contato: nome, e-mail e número de WhatsApp. Nenhuma outra informação pessoal é coletada automaticamente durante sua navegação.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">2. Armazenamento</h2>
    <p>
      As informações enviadas por meio do formulário são armazenadas de forma segura em nossa base de dados no Firebase, um serviço de computação em nuvem fornecido pelo Google. Esse serviço segue padrões internacionais de segurança e proteção de dados.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">3. Finalidade do Uso</h2>
    <p>
      Utilizamos os dados exclusivamente para responder suas mensagens, prestar suporte, ou fornecer informações sobre nossos serviços. Não enviamos newsletters, propagandas ou qualquer comunicação automatizada sem sua solicitação.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">4. Compartilhamento de Dados</h2>
    <p>
      Seus dados não são vendidos, compartilhados ou repassados a terceiros. O acesso é restrito à nossa equipe responsável pelo atendimento, e os dados são utilizados apenas para os fins informados nesta política.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">5. Segurança</h2>
    <p>
      Adotamos medidas técnicas e organizacionais para proteger seus dados pessoais contra acesso não autorizado, perda ou alteração. O Firebase utiliza criptografia e autenticação para garantir a integridade e confidencialidade das informações.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">6. Seus Direitos</h2>
    <p>
      Você pode solicitar a exclusão ou revisão de seus dados a qualquer momento, entrando em contato conosco pelos canais disponíveis no site. Responderemos o mais breve possível.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">7. Cookies e Rastreamento</h2>
    <p>
      Nosso site não utiliza cookies de rastreamento nem serviços de análise de navegação (como Google Analytics). A sua navegação é livre e anônima.
    </p>
  </div>

  <div>
    <h2 className="text-xl font-semibold text-white mb-2">8. Alterações nesta Política</h2>
    <p>
      Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças nos nossos processos ou serviços. A data da última atualização será sempre informada ao final desta página.
    </p>
  </div>

  <p className="text-purple-300">
    Última atualização: 07 de agosto de 2025
  </p>
</div>  
        </div>
      </section>
    </Layout>
  )
}
