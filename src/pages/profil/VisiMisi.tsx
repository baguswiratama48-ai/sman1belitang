import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Target, CheckCircle2, Award, Zap, Heart, ShieldCheck } from "lucide-react";

const VisiMisi = () => {
    const missions = [
        {
            icon: <ShieldCheck className="h-6 w-6" />,
            text: "Membudayakan sikap disiplin dalam seluruh aspek kehidupan sekolah."
        },
        {
            icon: <Heart className="h-6 w-6" />,
            text: "Menumbuhkan penghayatan ajaran-ajaran agama dan budaya luhur bangsa."
        },
        {
            icon: <Zap className="h-6 w-6" />,
            text: "Meningkatkan prestasi akademik melalui proses pembelajaran yang berkualitas."
        },
        {
            icon: <Award className="h-6 w-6" />,
            text: "Membekali siswa dengan keterampilan dan kecakapan hidup (life skills)."
        },
        {
            icon: <CheckCircle2 className="h-6 w-6" />,
            text: "Mewujudkan fisik sekolah dan warga sekolah yang berpenampilan menarik dan tertata."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-primary py-20 text-primary-foreground text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                    <div className="container mx-auto px-4 relative z-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Visi & Misi</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Arah dan tujuan perjuangan kami dalam membentuk masa depan cerah.
                        </p>
                    </div>
                </section>

                {/* Visi Section */}
                <section className="py-20 container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-xl border border-slate-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Target className="h-40 w-40" />
                            </div>

                            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl text-accent mb-6">
                                <Target className="h-8 w-8" />
                            </div>

                            <h2 className="text-3xl font-bold text-slate-900 mb-8">Visi Sekolah</h2>
                            <blockquote className="text-2xl md:text-3xl font-semibold text-primary italic leading-relaxed">
                                "Menjadi SMA Prima yang berpacu meraih Prestasi Luhur Budi Pekerti"
                            </blockquote>
                        </div>
                    </div>
                </section>

                {/* Misi Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Misi Sekolah</h2>
                            <p className="text-slate-600 max-w-xl mx-auto">
                                Langkah-langkah strategis yang kami tempuh untuk mewujudkan visi sekolah.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {missions.map((mission, index) => (
                                <div key={index} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-primary transition-all duration-300 hover:shadow-2xl">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-accent mb-6 shadow-sm group-hover:text-primary transition-colors">
                                        {mission.icon}
                                    </div>
                                    <p className="text-slate-700 font-medium leading-relaxed group-hover:text-white transition-colors">
                                        {mission.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default VisiMisi;
