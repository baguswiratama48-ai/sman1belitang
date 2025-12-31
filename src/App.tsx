import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { PlaceholderPage } from "./components/layout/PlaceholderPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/galeri" element={<PlaceholderPage title="Galeri" />} />
          <Route path="/profil/sejarah" element={<PlaceholderPage title="Sejarah" />} />
          <Route path="/profil/visi-misi" element={<PlaceholderPage title="Visi & Misi" />} />
          <Route path="/profil/struktur" element={<PlaceholderPage title="Struktur Organisasi" />} />
          <Route path="/guru-staff/guru" element={<PlaceholderPage title="Daftar Guru" />} />
          <Route path="/guru-staff/tendik" element={<PlaceholderPage title="Tenaga Kependidikan" />} />
          <Route path="/siswa" element={<PlaceholderPage title="Siswa" />} />
          <Route path="/fasilitas" element={<PlaceholderPage title="Fasilitas" />} />
          <Route path="/prestasi" element={<PlaceholderPage title="Prestasi" />} />
          <Route path="/agenda/kalender" element={<PlaceholderPage title="Kalender Akademik" />} />
          <Route path="/agenda/kegiatan" element={<PlaceholderPage title="Kegiatan Sekolah" />} />
          <Route path="/informasi/pengumuman" element={<PlaceholderPage title="Pengumuman" />} />
          <Route path="/informasi/berita" element={<PlaceholderPage title="Berita Terbaru" />} />
          <Route path="/ppdb" element={<PlaceholderPage title="PPDB 2025" />} />
          <Route path="/ekskul" element={<PlaceholderPage title="Organisasi & Ekskul" />} />
          <Route path="/osis" element={<PlaceholderPage title="OSIS" />} />
          <Route path="/alumni" element={<PlaceholderPage title="Alumni" />} />
          <Route path="/login" element={<PlaceholderPage title="Login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
