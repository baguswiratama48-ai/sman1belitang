import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Image, Megaphone, TrendingUp, Eye, Clock, ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Stats {
  totalBerita: number;
  publishedBerita: number;
  totalGaleri: number;
  publishedGaleri: number;
  totalPengumuman: number;
  activePengumuman: number;
}

interface RecentActivity {
  id: string;
  type: "berita" | "galeri" | "pengumuman";
  title: string;
  created_at: string;
}

const mockChartData = [
  { name: "Jan", berita: 4, galeri: 6, pengumuman: 3 },
  { name: "Feb", berita: 3, galeri: 8, pengumuman: 5 },
  { name: "Mar", berita: 5, galeri: 4, pengumuman: 2 },
  { name: "Apr", berita: 7, galeri: 5, pengumuman: 6 },
  { name: "Mei", berita: 2, galeri: 9, pengumuman: 4 },
  { name: "Jun", berita: 6, galeri: 7, pengumuman: 3 },
];

const visitorData = [
  { name: "Sen", visitors: 120 },
  { name: "Sel", visitors: 180 },
  { name: "Rab", visitors: 150 },
  { name: "Kam", visitors: 220 },
  { name: "Jum", visitors: 200 },
  { name: "Sab", visitors: 90 },
  { name: "Min", visitors: 60 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalBerita: 0,
    publishedBerita: 0,
    totalGaleri: 0,
    publishedGaleri: 0,
    totalPengumuman: 0,
    activePengumuman: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: totalBerita } = await supabase
        .from("berita")
        .select("*", { count: "exact", head: true });

      const { count: publishedBerita } = await supabase
        .from("berita")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);

      const { count: totalGaleri } = await supabase
        .from("galeri")
        .select("*", { count: "exact", head: true });

      const { count: publishedGaleri } = await supabase
        .from("galeri")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true);

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

  const fetchRecentActivities = async () => {
    try {
      const [beritaRes, galeriRes, pengumumanRes] = await Promise.all([
        supabase.from("berita").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("galeri").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
        supabase.from("pengumuman").select("id, title, created_at").order("created_at", { ascending: false }).limit(3),
      ]);

      const activities: RecentActivity[] = [
        ...(beritaRes.data || []).map(b => ({ ...b, type: "berita" as const })),
        ...(galeriRes.data || []).map(g => ({ ...g, type: "galeri" as const })),
        ...(pengumumanRes.data || []).map(p => ({ ...p, type: "pengumuman" as const })),
      ];

      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentActivities(activities.slice(0, 6));
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error fetching activities:", error);
    }
  };

  const statCards = [
    {
      title: "Total Berita",
      value: stats.totalBerita,
      subtitle: `${stats.publishedBerita} dipublikasikan`,
      icon: Newspaper,
      gradient: "from-[hsl(var(--admin-card-blue))] to-[hsl(231,91%,55%)]",
      progress: stats.totalBerita > 0 ? (stats.publishedBerita / stats.totalBerita) * 100 : 0,
    },
    {
      title: "Total Galeri",
      value: stats.totalGaleri,
      subtitle: `${stats.publishedGaleri} dipublikasikan`,
      icon: Image,
      gradient: "from-[hsl(var(--admin-card-teal))] to-[hsl(174,83%,35%)]",
      progress: stats.totalGaleri > 0 ? (stats.publishedGaleri / stats.totalGaleri) * 100 : 0,
    },
    {
      title: "Pengumuman",
      value: stats.totalPengumuman,
      subtitle: `${stats.activePengumuman} aktif`,
      icon: Megaphone,
      gradient: "from-[hsl(var(--admin-card-orange))] to-[hsl(27,96%,50%)]",
      progress: stats.totalPengumuman > 0 ? (stats.activePengumuman / stats.totalPengumuman) * 100 : 0,
    },
    {
      title: "Total Konten",
      value: stats.totalBerita + stats.totalGaleri + stats.totalPengumuman,
      subtitle: "Semua jenis konten",
      icon: TrendingUp,
      gradient: "from-[hsl(var(--admin-card-pink))] to-[hsl(339,81%,53%)]",
      progress: 100,
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "berita":
        return <Newspaper className="h-4 w-4" />;
      case "galeri":
        return <Image className="h-4 w-4" />;
      case "pengumuman":
        return <Megaphone className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "berita":
        return "bg-[hsl(var(--admin-card-blue))]/10 text-[hsl(var(--admin-card-blue))]";
      case "galeri":
        return "bg-[hsl(var(--admin-card-teal))]/10 text-[hsl(var(--admin-card-teal))]";
      case "pengumuman":
        return "bg-[hsl(var(--admin-card-orange))]/10 text-[hsl(var(--admin-card-orange))]";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Selamat datang di Panel Admin SMAN 1 Belitang</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-xl border border-border">
          <Clock className="h-4 w-4" />
          <span>{format(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}</span>
        </div>
      </div>

      {/* Stat Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 bg-muted rounded-xl w-12 mb-4"></div>
                <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card 
              key={stat.title} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 relative">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-300`}></div>
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{stat.subtitle}</span>
                    <span className="font-semibold text-[hsl(var(--admin-success))]">
                      {Math.round(stat.progress)}%
                    </span>
                  </div>
                  <Progress value={stat.progress} className="h-1.5 mt-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Chart */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Statistik Konten</CardTitle>
                <p className="text-sm text-muted-foreground">Publikasi per bulan</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--admin-card-blue))]"></div>
                  <span className="text-muted-foreground">Berita</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--admin-card-teal))]"></div>
                  <span className="text-muted-foreground">Galeri</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(var(--admin-card-orange))]"></div>
                  <span className="text-muted-foreground">Pengumuman</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }} 
                  />
                  <Bar dataKey="berita" fill="hsl(var(--admin-card-blue))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="galeri" fill="hsl(var(--admin-card-teal))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="pengumuman" fill="hsl(var(--admin-card-orange))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Visitor Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Pengunjung</CardTitle>
                <p className="text-sm text-muted-foreground">Minggu ini</p>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-[hsl(var(--admin-success))]">
                <ArrowUpRight className="h-4 w-4" />
                <span>+18%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">1,020</div>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorData}>
                  <defs>
                    <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--admin-card-teal))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--admin-card-teal))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="hsl(var(--admin-card-teal))" 
                    strokeWidth={2}
                    fill="url(#visitorGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Aktivitas Terbaru</CardTitle>
              <button className="text-sm text-[hsl(var(--admin-primary))] hover:underline font-medium">
                Lihat Semua
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={activity.id} className="flex items-start gap-4 group">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-[hsl(var(--admin-primary))] transition-colors">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {activity.type} • {format(new Date(activity.created_at), "dd MMM yyyy, HH:mm", { locale: id })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Belum ada aktivitas</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Panduan Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: Newspaper, title: "Kelola Berita", desc: "Buat dan edit artikel untuk ditampilkan di website" },
                { icon: Image, title: "Unggah Galeri", desc: "Tambahkan foto kegiatan sekolah ke galeri" },
                { icon: Megaphone, title: "Buat Pengumuman", desc: "Publikasikan informasi penting untuk siswa dan wali" },
                { icon: Eye, title: "Preview", desc: "Lihat tampilan website untuk memastikan konten tampil dengan baik" },
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-[hsl(var(--admin-sidebar))] transition-colors cursor-pointer group">
                  <div className="p-2 rounded-lg bg-[hsl(var(--admin-primary))]/10 text-[hsl(var(--admin-primary))] group-hover:bg-[hsl(var(--admin-primary))] group-hover:text-white transition-colors">
                    <tip.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tip.title}</p>
                    <p className="text-xs text-muted-foreground">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}