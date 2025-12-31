import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function BeritaSection() {
  const { data: beritaData, isLoading } = useQuery({
    queryKey: ['berita-published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('berita')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const defaultBerita = [
    {
      id: "1",
      title: "Berita Terbaru dari SMAN 1 Belitang",
      excerpt: "Ikuti perkembangan terkini seputar kegiatan dan prestasi sekolah...",
      image_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=250&fit=crop",
      published_at: new Date().toISOString(),
      category: "Umum",
      slug: "#",
    },
  ];

  const berita = beritaData && beritaData.length > 0 ? beritaData : defaultBerita;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Berita <span className="text-accent">Terbaru</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ikuti perkembangan terkini seputar kegiatan dan prestasi SMAN 1 Belitang
          </p>
        </div>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {berita.map((item) => (
              <Card key={item.id} className="overflow-hidden hover-lift border-border">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=250&fit=crop"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {item.published_at 
                        ? format(new Date(item.published_at), 'd MMMM yyyy', { locale: id })
                        : 'Tanggal tidak tersedia'
                      }
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                    <Link to={`/informasi/berita/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Link
                    to={`/informasi/berita/${item.slug}`}
                    className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/informasi/berita">Lihat Semua Berita</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
