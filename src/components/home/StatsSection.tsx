import { useEffect, useState, useRef } from "react";
import { Users, Building, Trophy, Calendar } from "lucide-react";
import { useSiteSetting, StatsSettings } from "@/hooks/useSiteSettings";

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data: statsData, isLoading } = useSiteSetting<StatsSettings>('stats');

  const defaultStats: StatsSettings = {
    jumlah_siswa: 1200,
    fasilitas: 50,
    prestasi: 100,
    tahun_berdiri: 1985,
  };

  const data = statsData || defaultStats;

  const stats = [
    { icon: Users, value: data.jumlah_siswa, suffix: "+", label: "Jumlah Siswa" },
    { icon: Building, value: data.fasilitas, suffix: "+", label: "Fasilitas" },
    { icon: Trophy, value: data.prestasi, suffix: "+", label: "Prestasi" },
    { icon: Calendar, value: data.tahun_berdiri, suffix: "", label: "Tahun Berdiri" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return <section className="py-16 bg-primary animate-pulse h-48" />;
  }

  return (
    <section ref={sectionRef} className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                <stat.icon className="h-8 w-8 text-accent-foreground" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">
                <AnimatedNumber value={stat.value} isVisible={isVisible} suffix={stat.suffix} />
              </div>
              <p className="text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({ value, isVisible, suffix }: { value: number; isVisible: boolean; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}
