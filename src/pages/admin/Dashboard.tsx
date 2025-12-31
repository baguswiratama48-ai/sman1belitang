import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Image, Megaphone, Users } from "lucide-react";

interface Stats {
  totalBerita: number;
  publishedBerita: number;
  totalGaleri: number;
  publishedGaleri: number;
  totalPengumuman: number;
  activePengumuman: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBerita: 0,
    publishedBerita: 0,
    totalGaleri: 0,
    publishedGaleri: 0,
    totalPengumuman: 0,
    activePengumuman: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch berita stats
      const { count: totalBerita } = await supabase
        .from("berita")
        .select("*", { count: "exact", head: true });

      const { count: publishedBerita } = await supabase
        .from("berita")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);

      // Fetch galeri stats
      const { count: totalGaleri } = await supabase
        .from("galeri")
        .select("*", { count: "exact", head: true });

      const { count: publishedGaleri } = await supabase
        .from("galeri")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);

      // Fetch pengumuman stats
      const { count: totalPengumuman } = await supabase
        .from("pengumuman")
        .select("*", { count: "exact", head: true });

      const { count: activePengumuman } = await supabase
        .from("pengumuman")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);

      setStats({
        totalBerita: totalBerita || 0,
        publishedBerita: publishedBerita || 0,
        totalGaleri: totalGaleri || 0,
        publishedGaleri: publishedGaleri || 0,
        totalPengumuman: totalPengumuman || 0,
        activePengumuman: activePengumuman || 0,
      });
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Berita",
      value: stats.totalBerita,
      subtitle: `${stats.publishedBerita} dipublikasikan`,
      icon: Newspaper,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Galeri",
      value: stats.totalGaleri,
      subtitle: `${stats.publishedGaleri} dipublikasikan`,
      icon: Image,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Pengumuman",
      value: stats.totalPengumuman,
      subtitle: `${stats.activePengumuman} aktif`,
      icon: Megaphone,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard Admin</h1>
        <p className="text-muted-foreground">Selamat datang di Panel Admin SMAN 1 Belitang</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Panduan Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Gunakan menu <strong>Berita</strong> untuk mengelola artikel dan informasi sekolah</p>
            <p>• Gunakan menu <strong>Galeri</strong> untuk mengunggah foto-foto kegiatan sekolah</p>
            <p>• Gunakan menu <strong>Pengumuman</strong> untuk membuat pengumuman penting</p>
            <p>• Konten yang dipublikasikan akan langsung tampil di website</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
