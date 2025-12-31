import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteSetting, HeroSlide } from "@/hooks/useSiteSettings";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: slides, isLoading } = useSiteSetting<HeroSlide[]>('hero_slides');

  const defaultSlides: HeroSlide[] = [
    {
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80",
      title: "Selamat Datang di",
      subtitle: "SMAN 1 BELITANG",
      description: "Menjadi SMA Prima yang berpacu meraih Prestasi Luhur Budi Pekerti",
    },
  ];

  const activeSlides = slides && slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % activeSlides.length);

  if (isLoading) {
    return (
      <section className="relative h-[600px] lg:h-[700px] bg-primary animate-pulse" />
    );
  }

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
      {/* Slides */}
      {activeSlides.map((slide, index) => (
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
            {activeSlides[currentSlide]?.title}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-up">
            {activeSlides[currentSlide]?.subtitle}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 animate-fade-in">
            {activeSlides[currentSlide]?.description}
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
      {activeSlides.length > 1 && (
        <>
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
        </>
      )}

      {/* Dots */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-accent" : "bg-primary-foreground/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
