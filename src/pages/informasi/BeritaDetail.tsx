import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Tag, ArrowLeft, Loader2, Share2, Award, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BeritaDetailData {
    title: string;
    content: string;
    category: string;
    image_url: string | null;
    gallery_images: string[] | null;
    published_at: string | null;
    created_at: string;
    slug: string;
}

export default function BeritaDetail() {
    const { slug } = useParams();

    const { data: berita, isLoading, error } = useQuery({
        queryKey: ['berita-detail', slug],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('berita')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            return (data as any) as BeritaDetailData;
        },
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col pt-20">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                    <p className="text-slate-500 font-medium tracking-wide">Menyiapkan Artikel...</p>
                </div>
            </div>
        );
    }

    if (error || !berita) {
        return (
            <div className="min-h-screen flex flex-col pt-20">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-slate-50 p-6 rounded-full mb-6 border">
                        <Loader2 className="h-12 w-12 text-slate-200" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Artikel Tidak Diterbitkan</h1>
                    <p className="text-slate-500 mb-8 max-w-md">
                        Maaf, artikel yang Anda cari tidak tersedia atau belum dipublikasikan oleh administrator.
                    </p>
                    <Button asChild className="rounded-full px-8">
                        <Link to="/informasi/berita">Lihat Berita Lainnya</Link>
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    const gallery = (berita.gallery_images as string[]) || [];

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
            <Navbar />

            <main className="flex-1 pt-28 pb-20">
                <div className="container mx-auto px-4 max-w-3xl">
                    {/* Breadcrumbs Navigation */}
                    <nav className="mb-10 flex items-center gap-2 text-xs font-medium text-slate-400 overflow-x-auto whitespace-nowrap pb-2">
                        <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link to="/informasi/berita" className="hover:text-primary transition-colors uppercase tracking-wider">BERITA</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-slate-900 truncate uppercase">DETAIL</span>
                    </nav>

                    {/* Article Header */}
                    <header className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <Badge className="bg-primary/10 text-primary border-0 hover:bg-primary/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest tracking-tighter">
                                {berita.category}
                            </Badge>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold font-sans tracking-widest">
                                <Clock className="h-3.5 w-3.5" />
                                <span>5 MENIT BACA</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
                            {berita.title}
                        </h1>

                        <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-100 mb-10">
                            <div className="flex items-center gap-4">
                                <div className="h-11 w-11 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                    <Award className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900">Admin SMANSA</span>
                                    <span className="text-[11px] text-slate-500 uppercase font-bold tracking-widest">
                                        {format(new Date(berita.published_at || berita.created_at), 'd MMMM yyyy', { locale: id })}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full text-slate-600 border-slate-200 hover:bg-slate-50"
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success("Link berhasil disalin!");
                                }}
                            >
                                <Share2 className="mr-2 h-3.5 w-3.5" /> Bagikan
                            </Button>
                        </div>
                    </header>

                    {/* Feature Image */}
                    {berita.image_url && (
                        <figure className="mb-14 -mx-4 md:-mx-8">
                            <div className="relative aspect-video md:rounded-3xl overflow-hidden shadow-2xl shadow-primary/5 border border-slate-100">
                                <img
                                    src={berita.image_url}
                                    alt={berita.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                            </div>
                            <figcaption className="mt-4 px-4 md:px-8 text-center text-xs text-slate-400 font-medium italic">
                                Ilustrasi/Dokumentasi: {berita.title}
                            </figcaption>
                        </figure>
                    )}

                    {/* Article Body */}
                    <div className="prose prose-slate prose-lg max-w-none prose-p:font-serif prose-p:text-slate-700 prose-p:leading-[1.8] prose-p:text-[1.15rem] prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-2xl prose-blockquote:py-2 prose-blockquote:not-italic prose-strong:text-slate-900 whitespace-pre-wrap">
                        {berita.content}
                    </div>

                    {/* Gallery Section */}
                    {gallery && gallery.length > 0 && (
                        <section className="mt-20 pt-16 border-t border-slate-100">
                            <h2 className="text-2xl font-serif font-black text-slate-900 mb-8 flex items-center gap-3">
                                <span className="w-10 h-1 bg-primary rounded-full"></span>
                                Galeri Kegiatan
                            </h2>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                {gallery.map((img, idx) => (
                                    <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-zoom-in border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                                        <img
                                            src={img}
                                            alt={`Galeri ${idx + 1}`}
                                            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none"></div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Footer Article */}
                    <footer className="mt-20 py-10 border-t border-slate-100 flex flex-col items-center justify-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="h-px w-12 bg-slate-200"></div>
                            <span className="text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">AKHIR ARTIKEL</span>
                            <div className="h-px w-12 bg-slate-200"></div>
                        </div>

                        <Button asChild variant="ghost" className="text-slate-400 hover:text-primary rounded-full group">
                            <Link to="/informasi/berita">
                                <ArrowLeft className="mr-2 h-4 w-4 transform transition-transform group-hover:-translate-x-1" />
                                Kembali ke Daftar Berita
                            </Link>
                        </Button>
                    </footer>
                </div>
            </main>

            <Footer />
        </div>
    );
}
