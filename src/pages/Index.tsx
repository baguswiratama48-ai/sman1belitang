import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { PPDBSection } from "@/components/home/PPDBSection";
import { VisiMisiSection } from "@/components/home/VisiMisiSection";
import { SambutanSection } from "@/components/home/SambutanSection";
import { StatsSection } from "@/components/home/StatsSection";
import { BeritaSection } from "@/components/home/BeritaSection";
import { GaleriSection } from "@/components/home/GaleriSection";
import { KontakSection } from "@/components/home/KontakSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PPDBSection />
        <VisiMisiSection />
        <SambutanSection />
        <StatsSection />
        <BeritaSection />
        <GaleriSection />
        <KontakSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
