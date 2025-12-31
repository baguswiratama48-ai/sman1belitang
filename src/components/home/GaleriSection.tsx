import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const defaultImages = [
  { src: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=300&fit=crop", alt: "Gedung Sekolah" },
  { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop", alt: "Ruang Kelas" },
  { src: "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop", alt: "Laboratorium" },
  { src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&h=300&fit=crop", alt: "Perpustakaan" },
  { src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop", alt: "Lapangan Olahraga" },
  { src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=400&h=300&fit=crop", alt: "Kegiatan Ekstrakurikuler" },
];

export function GaleriSection() {
  const { data: galeriData, isLoading } = useQuery({
    queryKey: ['galeri-published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('galeri')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  const images = galeriData && galeriData.length > 0 
    ? galeriData.map(g => ({ src: g.image_url, alt: g.title }))
    : defaultImages;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Galeri <span className="text-accent">Sekolah</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Lihat berbagai kegiatan dan fasilitas yang ada di SMAN 1 Belitang
          </p>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/3] bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-xl aspect-[4/3]"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-sm md:text-base">
                    {image.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/galeri">Lihat Galeri Lengkap</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
