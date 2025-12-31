import { Target, Eye, CheckCircle2 } from "lucide-react";
import { useSiteSetting, VisiMisiSettings } from "@/hooks/useSiteSettings";

export function VisiMisiSection() {
  const { data: visiMisi, isLoading } = useSiteSetting<VisiMisiSettings>('visi_misi');

  const defaultData: VisiMisiSettings = {
    visi: "Menjadi SMA Prima yang berpacu meraih Prestasi Luhur Budi Pekerti",
    misi: [
      "Membudayakan sikap disiplin",
      "Menumbuhkan penghayatan ajaran-ajaran agama dan budaya",
      "Meningkatkan prestasi akademik",
      "Membekali keterampilan dan kecakapan hidup",
      "Mewujudkan fisik sekolah dan warga sekolah berpenampilan menarik",
    ],
    tujuan: ""
  };

  const data = visiMisi || defaultData;

  if (isLoading) {
    return <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background animate-pulse h-96" />;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4 tracking-wide">
            KOMITMEN KAMI
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Visi & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Misi</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Komitmen kami dalam menciptakan generasi unggul yang berprestasi dan berakhlak mulia
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Visi Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300" />
            <div className="relative bg-gradient-to-br from-primary via-primary to-primary/90 rounded-3xl p-8 md:p-10 text-primary-foreground shadow-2xl shadow-primary/20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full -translate-y-1/4 translate-x-1/4 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg shadow-accent/30">
                    <Eye className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold">Visi</h3>
                    <p className="text-primary-foreground/70 text-sm">Arah Tujuan Kami</p>
                  </div>
                </div>
                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed italic">
                  "{data.visi}"
                </blockquote>
              </div>
            </div>
          </div>

          {/* Misi Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-border to-border/50 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300" />
            <div className="relative bg-card rounded-3xl p-8 md:p-10 border border-border shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Target className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground">Misi</h3>
                  <p className="text-muted-foreground text-sm">Langkah Strategis Kami</p>
                </div>
              </div>
              <ul className="space-y-4">
                {data.misi.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 group/item">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-muted-foreground group-hover/item:text-foreground transition-colors leading-relaxed">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
