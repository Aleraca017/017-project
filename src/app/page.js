import Layout from "../components/Layout"
import HeroSection from "../components/home/HeroSection"
import SobreSection from "../components/home/SobreSection"
import ServicosSection from "../components/home/ServicosSection"
import ProjetosSection from "../components/home/ProjetosSection"
import DepoimentosSection from "../components/home/DepoimentosSection"


export default function Home() {
  return (
    <Layout>
      <HeroSection id="home"/>
      <div id="sobre" className="scroll-mt-60">
        <SobreSection />
      </div>
      <div id="servicos" className="scroll-mt-0">
        <ServicosSection />
      </div>
      <div id="depoimentos">
        <DepoimentosSection />
      </div>
      <div id="projetos">
        <ProjetosSection />
      </div>
    </Layout>
  )
}
