import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { PlaceholderPage } from "./components/layout/PlaceholderPage";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import BeritaAdmin from "./pages/admin/BeritaAdmin";
import GaleriAdmin from "./pages/admin/GaleriAdmin";
import PengumumanAdmin from "./pages/admin/PengumumanAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Auth />} />
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
            <Route path="/ekskul" element={<PlaceholderPage title="Organisasi & Ekskul" />} />
            <Route path="/osis" element={<PlaceholderPage title="OSIS" />} />
            <Route path="/alumni" element={<PlaceholderPage title="Alumni" />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="berita" element={<BeritaAdmin />} />
              <Route path="galeri" element={<GaleriAdmin />} />
              <Route path="pengumuman" element={<PengumumanAdmin />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
