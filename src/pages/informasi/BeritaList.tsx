import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, Newspaper, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

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
        <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
            <Navbar />

            <main className="flex-1">
                {/* Modern Hero Header */}
                <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                        <img
                            src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1600&q=80"
                            className="w-full h-full object-cover opacity-30"
                            alt=""
                        />
                    </div>
                    <div className="container mx-auto px-4 relative z-10">
                        <nav className="flex items-center gap-2 text-xs font-bold text-white/50 mb-6 tracking-widest uppercase">
                            <Link to="/" className="hover:text-white transition-colors">HOME</Link>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-white">BERITA & INFORMASI</span>
                        </nav>
                        <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-6 leading-tight">
                            Jendela Informasi <br />
                            <span className="text-primary italic">SMAN 1 Belitang</span>
                        </h1>
                        <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
                            Ikuti perkembangan terbaru, prestasi membanggakan, dan seluruh aktivitas civitas akademika kami di sini.
                        </p>
                    </div>
                </section>

                {/* News Grid */}
                <section className="py-20 container mx-auto px-4">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-2xl font-serif font-black text-slate-900 flex items-center gap-3">
                            <span className="w-8 h-1 bg-primary rounded-full"></span>
                            Artikel Terbaru
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-[16/10] bg-slate-100 rounded-3xl mb-6" />
                                    <div className="h-4 bg-slate-100 rounded w-24 mb-4" />
                                    <div className="h-8 bg-slate-100 rounded w-full mb-3" />
                                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : berita && berita.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                            {berita.map((item) => (
                                <article key={item.id} className="group cursor-pointer">
                                    <Link to={`/informasi/berita/${item.slug}`}>
                                        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl mb-6 shadow-xl shadow-slate-200/50">
                                            <img
                                                src={item.image_url || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80"}
                                                alt={item.title}
                                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 border-0 hover:bg-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                {item.category}
                                            </Badge>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 tracking-widest uppercase">
                                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                                <span>
                                                    {item.published_at
                                                        ? format(new Date(item.published_at), 'd MMMM yyyy', { locale: id })
                                                        : 'Baru saja'
                                                    }
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-serif font-black text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed font-medium">
                                                {item.excerpt || item.content.substring(0, 120) + "..."}
                                            </p>
                                            <div className="pt-2 flex items-center text-xs font-black text-primary uppercase tracking-[0.2em]">
                                                BACA SELENGKAPNYA
                                                <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-2" />
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                            <Newspaper className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                            <h2 className="text-3xl font-serif font-black text-slate-900 mb-3">Belum Ada Informasi</h2>
                            <p className="text-slate-500 max-w-md mx-auto">Kami sedang menyiapkan konten-konten menarik untuk Anda. Silakan kembali beberapa saat lagi.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
