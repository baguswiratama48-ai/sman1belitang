import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import logoSmansa from "@/assets/logo-smansa.png";
import { useSiteSetting, FooterSettings, KontakSettings } from "@/hooks/useSiteSettings";

export function Footer() {
  const { data: footer } = useSiteSetting<FooterSettings>('footer');
  const { data: kontak } = useSiteSetting<KontakSettings>('kontak');

  const defaultFooter: FooterSettings = {
    tagline: "Menjadi SMA Prima yang berpacu meraih Prestasi Luhur Budi Pekerti",
    facebook: "",
    instagram: "",
    youtube: "",
    jam_senin_kamis: "07:00 - 15:00",
    jam_jumat: "07:00 - 11:30",
    jam_sabtu: "07:00 - 12:00",
    copyright: "© 2025 SMAN 1 Belitang. Hak Cipta Dilindungi.",
  };

  const defaultKontak: KontakSettings = {
    alamat: "Jln. Marga Pemuka Bangsa Raja No.1001 Gumawang Belitang, Kab. OKU Timur, Sumatera Selatan 32382",
    telepon: "0735-450106",
    email: "sman1belitang@gmail.com",
    jam_operasional: "Senin - Sabtu: 07:00 - 15:00 WIB",
    maps_embed: "",
  };

  const footerData = footer || defaultFooter;
  const kontakData = kontak || defaultKontak;

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logoSmansa} alt="Logo SMAN 1 Belitang" className="w-14 h-16 object-contain bg-white rounded-lg p-1" />
              <div>
                <h3 className="font-bold text-lg">SMAN 1 BELITANG</h3>
                <p className="text-sm opacity-80">OKU Timur, Sumsel</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              {footerData.tagline}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Kontak Kami</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-accent" />
                <span className="opacity-80">{kontakData.alamat}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-accent" />
                <span className="opacity-80">{kontakData.telepon}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <span className="opacity-80">{kontakData.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0 text-accent" />
                <span className="opacity-80">{kontakData.jam_operasional}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Link Cepat</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Profil Sekolah", href: "/profil/sejarah" },
                { label: "PPDB 2025", href: "https://www.ppdbsman1belitang.sch.id/", external: true },
                { label: "Galeri", href: "/galeri" },
                { label: "Berita & Pengumuman", href: "/informasi/berita" },
                { label: "Portal Siswa", href: "/login" },
                { label: "E-Learning", href: "/login" },
                { label: "Alumni", href: "/alumni" },
              ].map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-80 hover:opacity-100 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="opacity-80 hover:opacity-100 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Media Sosial</h4>
            <div className="flex gap-3 mb-6">
              {footerData.facebook && (
                <a
                  href={footerData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {footerData.instagram && (
                <a
                  href={footerData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {footerData.youtube && (
                <a
                  href={footerData.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {!footerData.facebook && !footerData.instagram && !footerData.youtube && (
                <>
                  <span className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center">
                    <Facebook className="h-5 w-5" />
                  </span>
                  <span className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center">
                    <Instagram className="h-5 w-5" />
                  </span>
                  <span className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center">
                    <Youtube className="h-5 w-5" />
                  </span>
                </>
              )}
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Jam Operasional</p>
              <p className="text-xs opacity-80">Senin - Kamis: {footerData.jam_senin_kamis}</p>
              <p className="text-xs opacity-80">Jumat: {footerData.jam_jumat}</p>
              <p className="text-xs opacity-80">Sabtu: {footerData.jam_sabtu}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm opacity-80">
            <p>{footerData.copyright}</p>
            <p>Dikembangkan dengan ❤️ untuk Pendidikan Indonesia</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
