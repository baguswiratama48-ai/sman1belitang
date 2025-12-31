import { Quote } from "lucide-react";
import { useSiteSetting, SambutanSettings } from "@/hooks/useSiteSettings";
import kepalaSekolahImg from "@/assets/kepala-sekolah.jpg";

export function SambutanSection() {
  const { data: sambutan, isLoading } = useSiteSetting<SambutanSettings>('sambutan');

  const defaultData: SambutanSettings = {
    nama: "H. Prioyitno, S.Pd. MM",
    jabatan: "Kepala SMAN 1 Belitang",
    foto: kepalaSekolahImg,
    konten: "Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nSelamat datang di website resmi SMAN 1 Belitang. Website ini merupakan media informasi dan komunikasi antara sekolah dengan seluruh stakeholder pendidikan.\n\nKami berkomitmen untuk terus meningkatkan kualitas pendidikan dan menghasilkan lulusan yang berakhlak mulia, cerdas, dan kompetitif.\n\nSemoga website ini dapat memberikan informasi yang bermanfaat bagi semua pihak.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh."
  };

  const data = sambutan || defaultData;

  if (isLoading) {
    return <section className="py-16 bg-muted/30 animate-pulse h-96" />;
  }

  // Split content by newlines for proper rendering
  const contentParagraphs = data.konten.split('\n').filter(p => p.trim());

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Photo */}
            <div className="shrink-0">
              <div className="relative">
                <div className="w-48 h-56 md:w-56 md:h-64 bg-gradient-to-br from-primary to-primary/80 rounded-2xl overflow-hidden">
                  {data.foto ? (
                    <img
                      src={data.foto}
                      alt={data.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
                        alt="Kepala Sekolah"
                        className="w-full h-full object-cover mix-blend-overlay opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-primary-foreground text-center">
                          <div className="w-20 h-20 mx-auto mb-2 border-4 border-primary-foreground/50 rounded-full flex items-center justify-center text-3xl font-bold">
                            {data.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-accent rounded-full flex items-center justify-center">
                  <Quote className="h-8 w-8 text-accent-foreground" />
                </div>
              </div>
              <div className="text-center mt-6">
                <h4 className="font-bold text-lg text-foreground">{data.nama}</h4>
                <p className="text-sm text-muted-foreground">{data.jabatan}</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Sambutan <span className="text-accent">Kepala Sekolah</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {contentParagraphs.map((paragraph, index) => (
                  <p key={index} className={paragraph.includes("Wassalamu") || paragraph.includes("Assalamu") ? "font-medium text-foreground" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
