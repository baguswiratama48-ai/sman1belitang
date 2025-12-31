import { Target, Eye, Clock, Heart, BookOpen, Sparkles, Users } from "lucide-react";

export function VisiMisiSection() {
  const misi = [
    {
      icon: Clock,
      text: "Membudayakan sikap disiplin",
    },
    {
      icon: Heart,
      text: "Menumbuhkan penghayatan ajaran-ajaran agama dan budaya",
    },
    {
      icon: BookOpen,
      text: "Meningkatkan prestasi akademik",
    },
    {
      icon: Sparkles,
      text: "Membekali keterampilan dan kecakapan hidup",
    },
    {
      icon: Users,
      text: "Mewujudkan fisik sekolah dan warga sekolah berpenampilan menarik",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Visi & <span className="text-accent">Misi</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Komitmen kami dalam menciptakan generasi unggul yang berprestasi dan berakhlak mulia
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Visi */}
          <div className="bg-primary rounded-2xl p-8 text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold">Visi</h3>
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed">
                "Menjadi SMA Prima yang berpacu meraih{" "}
                <span className="text-accent">Prestasi Luhur Budi Pekerti</span>"
              </p>
            </div>
          </div>

          {/* Misi */}
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Misi</h3>
            </div>
            <ul className="space-y-4">
              {misi.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-muted-foreground">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tujuan */}
        <div className="mt-12 bg-muted rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-foreground mb-4">Tujuan Sekolah</h3>
          <p className="text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Meningkatkan <span className="text-primary font-medium">kecerdasan</span>,{" "}
            <span className="text-primary font-medium">pengetahuan</span>,{" "}
            <span className="text-primary font-medium">kepribadian</span>,{" "}
            <span className="text-accent font-medium">imtaq</span>,{" "}
            <span className="text-accent font-medium">akhlak mulia</span>, serta{" "}
            <span className="text-primary font-medium">keterampilan berbasis teknologi informasi</span>{" "}
            untuk hidup mandiri dan mengikuti pendidikan lebih lanjut.
          </p>
        </div>
      </div>
    </section>
  );
}
