import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { LeaderboardPreview } from "@/components/landing/LeaderboardPreview";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <Hero />
      <HowItWorks />
      <Pricing />
      <LeaderboardPreview />
      <FAQ />
    </main>
    <Footer />
  </div>
);

export default Index;
