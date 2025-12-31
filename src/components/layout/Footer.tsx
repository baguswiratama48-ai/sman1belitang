import { Link } from "react-router-dom";
import { GraduationCap, MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* School Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">SMAN 1 BELITANG</h3>
                <p className="text-sm opacity-80">OKU Timur, Sumsel</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Menjadi SMA Prima yang berpacu meraih Prestasi Luhur Budi Pekerti
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Kontak Kami</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-accent" />
                <span className="opacity-80">
                  Jln. Marga Pemuka Bangsa Raja No.1001 Gumawang Belitang, Kab. OKU Timur, Sumatera Selatan 32382
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-accent" />
                <span className="opacity-80">0735-450106</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <span className="opacity-80">sman1belitang@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0 text-accent" />
                <span className="opacity-80">Senin - Sabtu: 07:00 - 15:00</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Link Cepat</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Profil Sekolah", href: "/profil/sejarah" },
                { label: "PPDB 2025", href: "/ppdb" },
                { label: "Galeri", href: "/galeri" },
                { label: "Berita & Pengumuman", href: "/informasi/berita" },
                { label: "Portal Siswa", href: "/login" },
                { label: "E-Learning", href: "/login" },
                { label: "Alumni", href: "/alumni" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="opacity-80 hover:opacity-100 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Media Sosial</h4>
            <div className="flex gap-3 mb-6">
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Jam Operasional</p>
              <p className="text-xs opacity-80">Senin - Kamis: 07:00 - 15:00</p>
              <p className="text-xs opacity-80">Jumat: 07:00 - 11:30</p>
              <p className="text-xs opacity-80">Sabtu: 07:00 - 12:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm opacity-80">
            <p>© 2025 SMAN 1 Belitang. Hak Cipta Dilindungi.</p>
            <p>Dikembangkan dengan ❤️ untuk Pendidikan Indonesia</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
