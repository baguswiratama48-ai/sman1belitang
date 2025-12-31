import { Quote } from "lucide-react";

export function SambutanSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Photo */}
            <div className="shrink-0">
              <div className="relative">
                <div className="w-48 h-56 md:w-56 md:h-64 bg-gradient-to-br from-primary to-primary/80 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
                    alt="Kepala Sekolah"
                    className="w-full h-full object-cover mix-blend-overlay opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-primary-foreground text-center">
                      <div className="w-20 h-20 mx-auto mb-2 border-4 border-primary-foreground/50 rounded-full flex items-center justify-center text-3xl font-bold">
                        HP
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-accent rounded-full flex items-center justify-center">
                  <Quote className="h-8 w-8 text-accent-foreground" />
                </div>
              </div>
              <div className="text-center mt-6">
                <h4 className="font-bold text-lg text-foreground">H. Prioyitno, S.Pd. MM</h4>
                <p className="text-sm text-muted-foreground">Kepala SMAN 1 Belitang</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Sambutan <span className="text-accent">Kepala Sekolah</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Assalamu'alaikum Warahmatullahi Wabarakatuh.
                </p>
                <p>
                  Selamat datang di website resmi SMAN 1 Belitang. Puji syukur kita panjatkan 
                  kehadirat Allah SWT atas segala rahmat dan karunia-Nya.
                </p>
                <p>
                  SMAN 1 Belitang berkomitmen untuk terus meningkatkan mutu pendidikan dan 
                  menghasilkan lulusan yang tidak hanya unggul dalam akademik, tetapi juga 
                  memiliki akhlak mulia dan siap berkontribusi untuk bangsa.
                </p>
                <p>
                  Semoga website ini dapat menjadi sarana informasi yang bermanfaat bagi 
                  seluruh civitas akademika dan masyarakat.
                </p>
                <p className="font-medium text-foreground">
                  Wassalamu'alaikum Warahmatullahi Wabarakatuh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
