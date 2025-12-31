import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";

const beritaData = [
  {
    id: 1,
    title: "SMAN 1 Belitang Raih Juara Umum OSN Tingkat Kabupaten",
    excerpt: "Siswa-siswi SMAN 1 Belitang berhasil meraih prestasi gemilang dalam Olimpiade Sains Nasional...",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=250&fit=crop",
    date: "15 Desember 2024",
    category: "Prestasi",
  },
  {
    id: 2,
    title: "Peluncuran Program E-Learning untuk Pembelajaran Daring",
    excerpt: "Dalam rangka meningkatkan kualitas pembelajaran, SMAN 1 Belitang meluncurkan platform e-learning...",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=250&fit=crop",
    date: "10 Desember 2024",
    category: "Akademik",
  },
  {
    id: 3,
    title: "Upacara Peringatan Hari Guru Nasional 2024",
    excerpt: "SMAN 1 Belitang menggelar upacara peringatan Hari Guru Nasional dengan berbagai rangkaian acara...",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=250&fit=crop",
    date: "25 November 2024",
    category: "Kegiatan",
  },
];

export function BeritaSection() {
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {beritaData.map((berita) => (
            <Card key={berita.id} className="overflow-hidden hover-lift border-border">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={berita.image}
                  alt={berita.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                  {berita.category}
                </span>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{berita.date}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                  <Link to={`/informasi/berita/${berita.id}`}>{berita.title}</Link>
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{berita.excerpt}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link
                  to={`/informasi/berita/${berita.id}`}
                  className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

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
