import Architecture from "../../components/Architecture";
import CloudConsole from "../../components/CloudConsole";
import CTA from "../../components/CTA";
import Features from "../../components/Features";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import TargetAudience from "../../components/TargetAudience";
import TrustCompliance from "../../components/TrustCompliance";


function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <CloudConsole />
      <TargetAudience />
      <Architecture />
      <TrustCompliance />
      <CTA />
      <Footer />
    </div>
  );
}

export default Landing;