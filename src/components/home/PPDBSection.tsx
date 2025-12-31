import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, Users } from "lucide-react";
import { useSiteSetting, PPDBSettings } from "@/hooks/useSiteSettings";

export function PPDBSection() {
  const { data: ppdb, isLoading } = useSiteSetting<PPDBSettings>('ppdb');

  const defaultPPDB: PPDBSettings = {
    year: "2025",
    description: "Penerimaan Peserta Didik Baru SMAN 1 Belitang Tahun Ajaran 2025/2026.",
    registration_start: "1 Juni 2025",
    registration_end: "30 Juni 2025",
    quota: "300",
    registration_url: "https://www.ppdbsman1belitang.sch.id/",
    timeline: [],
  };

  const data = ppdb || defaultPPDB;
  const icons = [FileText, Clock, Users, Calendar];

  if (isLoading) {
    return <section className="py-16 bg-accent/10 animate-pulse h-64" />;
  }

  return (
    <section className="py-16 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-accent/20 text-accent px-4 py-1 rounded-full text-sm font-medium mb-4">
              Pendaftaran Dibuka
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              PPDB Online <span className="text-accent">{data.year}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              {data.description}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-5 w-5 text-accent" />
                <span>{data.registration_start} - {data.registration_end}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-5 w-5 text-accent" />
                <span>Kuota: {data.quota} Siswa</span>
              </div>
            </div>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <a href={data.registration_url} target="_blank" rel="noopener noreferrer">Daftar Sekarang</a>
            </Button>
          </div>

          {/* Right Content - Timeline */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
              <h3 className="font-semibold text-lg mb-4 text-center">Jadwal Pendaftaran</h3>
              <div className="space-y-4">
                {data.timeline.map((item, index) => {
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
