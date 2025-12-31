import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import logoSmansa from "@/assets/logo-smansa.png";

const menuItems = [
  { label: "BERANDA", href: "/" },
  { label: "GALERI", href: "/galeri" },
  {
    label: "PROFIL",
    children: [
      { label: "Sejarah", href: "/profil/sejarah" },
      { label: "Visi & Misi", href: "/profil/visi-misi" },
      { label: "Struktur Organisasi", href: "/profil/struktur" },
    ],
  },
  {
    label: "GURU & STAFF",
    children: [
      { label: "Daftar Guru", href: "/guru-staff/guru" },
      { label: "Tenaga Kependidikan", href: "/guru-staff/tendik" },
    ],
  },
  { label: "SISWA", href: "/siswa" },
  { label: "FASILITAS", href: "/fasilitas" },
  { label: "PRESTASI", href: "/prestasi" },
  {
    label: "AGENDA",
    children: [
      { label: "Kalender Akademik", href: "/agenda/kalender" },
      { label: "Kegiatan Sekolah", href: "/agenda/kegiatan" },
    ],
  },
  {
    label: "INFORMASI",
    children: [
      { label: "Pengumuman", href: "/informasi/pengumuman" },
      { label: "Berita Terbaru", href: "/informasi/berita" },
    ],
  },
  { label: "PPDB 2025", href: "https://www.ppdbsman1belitang.sch.id/", highlight: true, external: true },
  {
    label: "LINK PENDIDIKAN",
    children: [
      { label: "Kemendikbud", href: "https://kemdikbud.go.id", external: true },
      { label: "Dinas Pendidikan Sumsel", href: "https://disdik.sumselprov.go.id", external: true },
      { label: "LTMPT", href: "https://ltmpt.ac.id", external: true },
    ],
  },
  { label: "EKSKUL", href: "/ekskul" },
  { label: "OSIS", href: "/osis" },
  { label: "ALUMNI", href: "/alumni" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>📞 0735-450106</span>
            <span className="hidden sm:inline">📧 sman1belitang@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="flex items-center gap-1 hover:text-accent transition-colors">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logoSmansa} alt="Logo SMAN 1 Belitang" className="w-12 h-14 object-contain" />
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-primary leading-tight">SMAN 1 BELITANG</h1>
              <p className="text-xs text-muted-foreground">OKU Timur, Sumatera Selatan</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.slice(0, 7).map((item) => (
              <NavItem key={item.label} item={item} isActive={isActive} />
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  LAINNYA <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-4 bg-popover shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  {/* Kolom Kiri */}
                  <div className="space-y-4">
                    {/* Agenda */}
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agenda</span>
                      <div className="mt-2 space-y-1">
                        <Link to="/agenda/kalender" className="block text-sm py-1 hover:text-primary transition-colors">
                          Kalender Akademik
                        </Link>
                        <Link to="/agenda/kegiatan" className="block text-sm py-1 hover:text-primary transition-colors">
                          Kegiatan Sekolah
                        </Link>
                      </div>
                    </div>
                    
                    {/* Informasi */}
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Informasi</span>
                      <div className="mt-2 space-y-1">
                        <Link to="/informasi/pengumuman" className="block text-sm py-1 hover:text-primary transition-colors">
                          Pengumuman
                        </Link>
                        <Link to="/informasi/berita" className="block text-sm py-1 hover:text-primary transition-colors">
                          Berita Terbaru
                        </Link>
                      </div>
                    </div>

                    {/* PPDB */}
                    <a 
                      href="https://www.ppdbsman1belitang.sch.id/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-sm font-semibold text-accent hover:text-accent/80 transition-colors py-1"
                    >
                      PPDB 2025
                    </a>
                  </div>

                  {/* Kolom Kanan */}
                  <div className="space-y-4">
                    {/* Link Pendidikan */}
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Link Pendidikan</span>
                      <div className="mt-2 space-y-1">
                        <a href="https://kemdikbud.go.id" target="_blank" rel="noopener noreferrer" className="block text-sm py-1 hover:text-primary transition-colors">
                          Kemendikbud
                        </a>
                        <a href="https://disdik.sumselprov.go.id" target="_blank" rel="noopener noreferrer" className="block text-sm py-1 hover:text-primary transition-colors">
                          Dinas Pendidikan Sumsel
                        </a>
                        <a href="https://ltmpt.ac.id" target="_blank" rel="noopener noreferrer" className="block text-sm py-1 hover:text-primary transition-colors">
                          LTMPT
                        </a>
                      </div>
                    </div>

                    {/* Organisasi */}
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Organisasi</span>
                      <div className="mt-2 space-y-1">
                        <Link to="/ekskul" className="block text-sm py-1 hover:text-primary transition-colors">
                          Ekstrakurikuler
                        </Link>
                        <Link to="/osis" className="block text-sm py-1 hover:text-primary transition-colors">
                          OSIS
                        </Link>
                        <Link to="/alumni" className="block text-sm py-1 hover:text-primary transition-colors">
                          Alumni
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-1">
              {menuItems.map((item) => (
                <MobileNavItem
                  key={item.label}
                  item={item}
                  isActive={isActive}
                  onClose={() => setIsOpen(false)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

interface NavItemProps {
  item: typeof menuItems[0];
  isActive: (href: string) => boolean;
}

function NavItem({ item, isActive }: NavItemProps) {
  if (item.children) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-sm font-medium">
            {item.label} <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-popover">
          {item.children.map((child) => (
            <DropdownMenuItem key={child.href} asChild>
              {child.external ? (
                <a href={child.href} target="_blank" rel="noopener noreferrer" className="w-full">
                  {child.label}
                </a>
              ) : (
                <Link to={child.href} className="w-full">
                  {child.label}
                </Link>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (item.external) {
    return (
      <a href={item.href!} target="_blank" rel="noopener noreferrer">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-sm font-medium",
            item.highlight && "bg-accent text-accent-foreground hover:bg-accent/90"
          )}
        >
          {item.label}
        </Button>
      </a>
    );
  }

  return (
    <Link to={item.href!}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "text-sm font-medium",
          isActive(item.href!) && "bg-primary/10 text-primary",
          item.highlight && "bg-accent text-accent-foreground hover:bg-accent/90"
        )}
      >
        {item.label}
      </Button>
    </Link>
  );
}

interface MobileNavItemProps extends NavItemProps {
  onClose: () => void;
}

function MobileNavItem({ item, isActive, onClose }: MobileNavItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
        >
          {item.label}
          <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
        </button>
        {isExpanded && (
          <div className="pl-6 space-y-1">
            {item.children.map((child) => (
              child.external ? (
                <a
                  key={child.href}
                  href={child.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary"
                  onClick={onClose}
                >
                  {child.label}
                </a>
              ) : (
                <Link
                  key={child.href}
                  to={child.href}
                  className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary"
                  onClick={onClose}
                >
                  {child.label}
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.href!}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className={cn(
          "block px-4 py-2 text-sm font-medium rounded-md hover:bg-muted",
          item.highlight && "bg-accent text-accent-foreground"
        )}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      to={item.href!}
      onClick={onClose}
      className={cn(
        "block px-4 py-2 text-sm font-medium rounded-md",
        isActive(item.href!) ? "bg-primary/10 text-primary" : "hover:bg-muted",
        item.highlight && "bg-accent text-accent-foreground"
      )}
    >
      {item.label}
    </Link>
  );
}
