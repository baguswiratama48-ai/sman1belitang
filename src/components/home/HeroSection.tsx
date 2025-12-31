import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80",
    title: "Selamat Datang di",
    subtitle: "SMAN 1 BELITANG",
    description: "Menjadi SMA Prima yang berpacu meraih Prestasi Luhur Budi Pekerti",
  },
  {
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=80",
    title: "Pendidikan Berkualitas",
    subtitle: "Untuk Masa Depan Cemerlang",
    description: "Meningkatkan kecerdasan, pengetahuan, kepribadian, dan akhlak mulia",
  },
  {
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=80",
    title: "PPDB 2025",
    subtitle: "Pendaftaran Dibuka!",
    description: "Bergabunglah bersama kami untuk meraih prestasi gemilang",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-primary-foreground">
          <p className="text-lg md:text-xl font-medium mb-2 animate-fade-in">
            {slides[currentSlide].title}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-up">
            {slides[currentSlide].subtitle}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 animate-fade-in">
            {slides[currentSlide].description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/ppdb">Daftar PPDB 2025</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/profil/sejarah">Lihat Profil</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/20 hover:bg-background/40 rounded-full flex items-center justify-center text-primary-foreground transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/20 hover:bg-background/40 rounded-full flex items-center justify-center text-primary-foreground transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-accent" : "bg-primary-foreground/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
