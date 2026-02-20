import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function BeritaList() {
    const { data: berita, isLoading } = useQuery({
        queryKey: ['berita-all-published'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('berita')
                .select('*')
                .eq('is_published', true)
                .order('published_at', { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1">
                {/* Header */}
                <section className="bg-primary py-20 text-primary-foreground text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <Newspaper className="absolute -right-20 -top-20 h-64 w-64 rotate-12" />
                    </div>
                    <div className="container mx-auto px-4 relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Berita Terbaru</h1>
                        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                            Informasi terkini mengenai kegiatan, prestasi, dan pengumuman resmi SMAN 1 Belitang.
                        </p>
                    </div>
                </section>

                {/* List Berita */}
                <section className="py-16 container mx-auto px-4">
                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Card key={i} className="overflow-hidden animate-pulse border-none shadow-md">
                                    <div className="h-48 bg-slate-200" />
                                    <CardContent className="p-6 space-y-4">
                                        <div className="h-4 bg-slate-200 rounded w-24" />
                                        <div className="h-6 bg-slate-200 rounded w-full" />
                                        <div className="h-4 bg-slate-200 rounded w-3/4" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : berita && berita.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {berita.map((item) => (
                                <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-none shadow-md flex flex-col group">
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={item.image_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80"}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                            {item.category}
                                        </span>
                                    </div>
                                    <CardContent className="p-6 flex-1">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {item.published_at
                                                    ? format(new Date(item.published_at), 'd MMMM yyyy', { locale: id })
                                                    : 'Baru saja'
                                                }
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 transition-colors group-hover:text-primary">
                                            <Link to={`/informasi/berita/${item.slug}`}>{item.title}</Link>
                                        </h3>
                                        <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed">
                                            {item.excerpt || item.content.substring(0, 150) + "..."}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-6 pt-0">
                                        <Link
                                            to={`/informasi/berita/${item.slug}`}
                                            className="text-sm text-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all"
                                        >
                                            Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                            <Newspaper className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-slate-900">Belum ada berita</h2>
                            <p className="text-slate-500 mt-2">Silakan kembali lagi nanti untuk informasi terbaru.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
