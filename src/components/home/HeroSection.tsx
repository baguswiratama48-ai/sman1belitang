import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteSetting, HeroSlide } from "@/hooks/useSiteSettings";

// Import slider images - Ganti file di src/assets/ untuk mengupdate slider
// Nama file: SLIDE_1.jpg, SLIDE_2.png, SLIDE_3.png, SLIDE_4.png, SLIDE_5.png
// Ukuran optimal: 1920 x 700 px
import SLIDE_1 from "@/assets/SLIDE_1.jpg";
import SLIDE_2 from "@/assets/SLIDE_2.png";
import SLIDE_3 from "@/assets/SLIDE_3.png";
import SLIDE_4 from "@/assets/SLIDE_4.png";
import SLIDE_5 from "@/assets/SLIDE_5.png";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gunakan langsung foto lokal - tidak dari database
  const activeSlides = [
    {
      image: SLIDE_1,
      title: "Selamat Datang di",
      subtitle: "SMAN 1 BELITANG",
      description: "Menjadi SMA Prima yang berpacu meraih Prestasi Luhur Budi Pekerti",
    },
    {
      image: SLIDE_2,
      title: "Paskibra",
      subtitle: "SMAN 1 BELITANG",
      description: "Membentuk karakter disiplin dan semangat nasionalisme",
    },
    {
      image: SLIDE_3,
      title: "Prestasi",
      subtitle: "Marching Band",
      description: "Meraih prestasi gemilang di berbagai kompetisi",
    },
    {
      image: SLIDE_4,
      title: "Prestasi",
      subtitle: "Akademik",
      description: "Siswa berprestasi dalam berbagai bidang akademik",
    },
    {
      image: SLIDE_5,
      title: "Budaya",
      subtitle: "Lokal",
      description: "Melestarikan budaya dan tradisi daerah",
    },
  ];

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % activeSlides.length);

  return (
    <section className="relative w-full aspect-[3/2] md:aspect-[16/9] lg:aspect-[21/9] max-h-[700px] overflow-hidden">
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
              <a href="https://www.ppdbsman1belitang.sch.id/" target="_blank" rel="noopener noreferrer">Daftar PPDB</a>
            </Button>
            <Button asChild size="lg" className="bg-background/20 border-2 border-primary-foreground text-primary-foreground hover:bg-background/30 backdrop-blur-sm">
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
