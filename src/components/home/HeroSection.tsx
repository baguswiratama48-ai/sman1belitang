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
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-black/20" /> {/* Subtle darkening for overall contrast */}
        </div>
      ))}

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-primary-foreground">
          <p className="text-lg md:text-xl font-medium mb-2 animate-in fade-in slide-in-from-left-4 duration-700">
            {activeSlides[currentSlide]?.title}
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {activeSlides[currentSlide]?.subtitle}
          </h1>
          <p className="text-lg md:text-2xl opacity-90 mb-8 max-w-lg leading-relaxed animate-in fade-in duration-1000 delay-300">
            {activeSlides[currentSlide]?.description}
          </p>
          <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
              <a href="https://www.ppdbsman1belitang.sch.id/" target="_blank" rel="noopener noreferrer">Daftar PPDB</a>
            </Button>
            <Button asChild size="lg" className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-md px-8 py-6 text-lg font-semibold transition-all shadow-lg hover:border-white/60">
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
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-accent" : "bg-primary-foreground/50"
                }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
