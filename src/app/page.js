import Layout from "../components/Layout"
import HeroSection from "../components/home/HeroSection"
import SobreSection from "../components/SobreSection"
import ServicosSection from "../components/ServicosSection"
import ProjetosSection from "../components/ProjetosSection"
import DepoimentosSection from "../components/DepoimentosSection"


export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <div id="sobre">
        <SobreSection />
      </div>
      <div id="servicos" className="scroll-mt-60">
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
