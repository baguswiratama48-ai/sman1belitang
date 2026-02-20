import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Tag, ArrowLeft, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
            return data;
        },
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col pt-20">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Memuat Berita...</p>
                </div>
            </div>
        );
    }

    if (error || !berita) {
        return (
            <div className="min-h-screen flex flex-col pt-20">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-slate-100 p-6 rounded-full mb-6">
                        <Loader2 className="h-12 w-12 text-slate-300" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Berita Tidak Ditemukan</h1>
                    <p className="text-slate-500 mb-8 max-w-md">
                        Maaf, berita yang Anda cari mungkin telah dihapus atau link yang Anda gunakan salah.
                    </p>
                    <Button asChild>
                        <Link to="/informasi/berita">Kembali ke Daftar Berita</Link>
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-1 pt-24 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Breadcrumbs & Back */}
                    <div className="mb-8 flex items-center justify-between">
                        <Link to="/informasi/berita" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Berita
                        </Link>
                        <Button variant="ghost" size="sm" className="text-slate-500" onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link berhasil disalin ke clipboard!");
                        }}>
                            <Share2 className="mr-2 h-4 w-4" /> Bagikan
                        </Button>
                    </div>

                    {/* Article Header */}
                    <header className="mb-10">
                        <Badge className="mb-4 px-3 py-1 rounded-full">{berita.category}</Badge>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                            {berita.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>
                                    {berita.published_at
                                        ? format(new Date(berita.published_at), 'EEEE, d MMMM yyyy', { locale: id })
                                        : format(new Date(berita.created_at), 'EEEE, d MMMM yyyy', { locale: id })
                                    }
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-primary" />
                                <span className="capitalize">{berita.category}</span>
                            </div>
                        </div>
                    </header>

                    {/* Feature Image */}
                    {berita.image_url && (
                        <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src={berita.image_url}
                                alt={berita.title}
                                className="w-full h-auto object-cover max-h-[500px]"
                            />
                        </div>
                    )}

                    {/* Article Body */}
                    <article className="prose prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                        {berita.content}
                    </article>

                    {/* Footer Article */}
                    <div className="mt-16 pt-8 border-t border-slate-100 italic text-slate-400 text-sm">
                        Sumber: SMAN 1 Belitang Official
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
