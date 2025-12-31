import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { 
  Image, 
  FileText, 
  Target, 
  User, 
  BarChart3, 
  MapPin, 
  Layout,
  Plus,
  Trash2,
  Save,
  Loader2
} from "lucide-react";

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

interface PPDBTimeline {
  label: string;
  date: string;
}


export default function KontenAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, unknown>);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: unknown }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('site_settings')
        .update({ value: value as any })
        .eq('key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site_settings'] });
      toast({ title: "Berhasil", description: "Konten berhasil diperbarui" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal memperbarui konten", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manajemen Konten</h1>
          <p className="text-muted-foreground">Kelola semua konten halaman beranda</p>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2 h-auto p-1">
          <TabsTrigger value="hero" className="flex items-center gap-2 text-xs">
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Slider</span>
          </TabsTrigger>
          <TabsTrigger value="ppdb" className="flex items-center gap-2 text-xs">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">PPDB</span>
          </TabsTrigger>
          <TabsTrigger value="visi_misi" className="flex items-center gap-2 text-xs">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Visi Misi</span>
          </TabsTrigger>
          <TabsTrigger value="sambutan" className="flex items-center gap-2 text-xs">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Sambutan</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2 text-xs">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Statistik</span>
          </TabsTrigger>
          <TabsTrigger value="kontak" className="flex items-center gap-2 text-xs">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Kontak</span>
          </TabsTrigger>
          <TabsTrigger value="footer" className="flex items-center gap-2 text-xs">
            <Layout className="h-4 w-4" />
            <span className="hidden sm:inline">Footer</span>
          </TabsTrigger>
        </TabsList>

        {/* Hero Slider */}
        <TabsContent value="hero">
          <HeroSliderEditor 
            slides={settings?.hero_slides as HeroSlide[] || []} 
            onSave={(value) => updateMutation.mutate({ key: 'hero_slides', value })}
            isSaving={updateMutation.isPending}
          />
        </TabsContent>

        {/* PPDB */}
        <TabsContent value="ppdb">
          <PPDBEditor 
            data={settings?.ppdb as Record<string, unknown> || {}} 
            onSave={(value) => updateMutation.mutate({ key: 'ppdb', value })}
            isSaving={updateMutation.isPending}
          />
        </TabsContent>

        {/* Visi Misi */}
        <TabsContent value="visi_misi">
          <VisiMisiEditor 
            data={settings?.visi_misi as Record<string, unknown> || {}} 
            onSave={(value) => updateMutation.mutate({ key: 'visi_misi', value })}
            isSaving={updateMutation.isPending}
          />
        </TabsContent>

        {/* Sambutan */}
        <TabsContent value="sambutan">
          <SambutanEditor 
            data={settings?.sambutan as Record<string, unknown> || {}} 
            onSave={(value) => updateMutation.mutate({ key: 'sambutan', value })}
            isSaving={updateMutation.isPending}
          />
        </TabsContent>

        {/* Stats */}
        <TabsContent value="stats">
          <StatsEditor 
            data={settings?.stats as Record<string, number> || {}} 
            onSave={(value) => updateMutation.mutate({ key: 'stats', value })}
            isSaving={updateMutation.isPending}
          />
        </TabsContent>

        {/* Kontak */}
        <TabsContent value="kontak">
          <KontakEditor 
            data={settings?.kontak as Record<string, unknown> || {}} 
            onSave={(value) => updateMutation.mutate({ key: 'kontak', value })}
            isSaving={updateMutation.isPending}
          />
        </TabsContent>

        {/* Footer */}
        <TabsContent value="footer">
          <FooterEditor 
            data={settings?.footer as Record<string, unknown> || {}} 
            onSave={(value) => updateMutation.mutate({ key: 'footer', value })}
            isSaving={updateMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Hero Slider Editor
function HeroSliderEditor({ 
  slides, 
  onSave, 
  isSaving 
}: { 
  slides: HeroSlide[]; 
  onSave: (value: HeroSlide[]) => void;
  isSaving: boolean;
}) {
  // Initialize with 5 empty slots if no slides exist
  const initialSlides: HeroSlide[] = Array.from({ length: 5 }, (_, i) => 
    slides[i] || { image: "", title: "", subtitle: "", description: "" }
  );
  const [localSlides, setLocalSlides] = useState<HeroSlide[]>(initialSlides);

  const updateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const updated = [...localSlides];
    updated[index] = { ...updated[index], [field]: value };
    setLocalSlides(updated);
  };

  // Filter out empty slides when saving
  const handleSave = () => {
    const filledSlides = localSlides.filter(slide => slide.image || slide.title || slide.subtitle || slide.description);
    onSave(filledSlides.length > 0 ? filledSlides : localSlides.slice(0, 1));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Slider Beranda (5 Slide)
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Kelola hingga 5 slide untuk hero section beranda
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Size Recommendation */}
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
          <h4 className="font-semibold text-accent-foreground mb-2 flex items-center gap-2">
            📐 Ukuran Gambar yang Direkomendasikan
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Resolusi Optimal:</p>
              <p className="text-muted-foreground">• <strong>1920 x 700 px</strong> (Lebar x Tinggi)</p>
              <p className="text-muted-foreground">• Rasio aspek: 2.74:1</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Alternatif:</p>
              <p className="text-muted-foreground">• <strong>1600 x 600 px</strong> (Medium)</p>
              <p className="text-muted-foreground">• <strong>1280 x 480 px</strong> (Minimum)</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 border-t pt-2">
            💡 Tips: Gunakan gambar landscape dengan format JPG atau WebP untuk hasil terbaik. Maksimal ukuran file 2MB.
          </p>
        </div>

        {localSlides.map((slide, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                Slide {index + 1}
                {!slide.image && !slide.title && !slide.subtitle && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">(Kosong)</span>
                )}
              </h4>
            </div>
            <ImageUpload
              value={slide.image}
              onChange={(url) => updateSlide(index, 'image', url)}
              folder="hero"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Judul Kecil</label>
                <Input
                  value={slide.title}
                  onChange={(e) => updateSlide(index, 'title', e.target.value)}
                  placeholder="Selamat Datang di"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Judul Besar</label>
                <Input
                  value={slide.subtitle}
                  onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                  placeholder="SMAN 1 BELITANG"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Deskripsi</label>
              <Textarea
                value={slide.description}
                onChange={(e) => updateSlide(index, 'description', e.target.value)}
                placeholder="Deskripsi slide..."
              />
            </div>
          </div>
        ))}
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </CardContent>
    </Card>
  );
}

// PPDB Editor
function PPDBEditor({ 
  data, 
  onSave, 
  isSaving 
}: { 
  data: Record<string, unknown>; 
  onSave: (value: unknown) => void;
  isSaving: boolean;
}) {
  const [localData, setLocalData] = useState({
    year: (data.year as string) || "2025",
    description: (data.description as string) || "",
    registration_start: (data.registration_start as string) || "",
    registration_end: (data.registration_end as string) || "",
    quota: (data.quota as string) || "",
    registration_url: (data.registration_url as string) || "",
    timeline: (data.timeline as PPDBTimeline[]) || [],
  });

  const addTimeline = () => {
    setLocalData({
      ...localData,
      timeline: [...localData.timeline, { label: "", date: "" }],
    });
  };

  const removeTimeline = (index: number) => {
    setLocalData({
      ...localData,
      timeline: localData.timeline.filter((_, i) => i !== index),
    });
  };

  const updateTimeline = (index: number, field: keyof PPDBTimeline, value: string) => {
    const updated = [...localData.timeline];
    updated[index] = { ...updated[index], [field]: value };
    setLocalData({ ...localData, timeline: updated });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Informasi PPDB
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Tahun Ajaran</label>
            <Input
              value={localData.year}
              onChange={(e) => setLocalData({ ...localData, year: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Kuota Siswa</label>
            <Input
              value={localData.quota}
              onChange={(e) => setLocalData({ ...localData, quota: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Deskripsi</label>
          <Textarea
            value={localData.description}
            onChange={(e) => setLocalData({ ...localData, description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Tanggal Mulai</label>
            <Input
              value={localData.registration_start}
              onChange={(e) => setLocalData({ ...localData, registration_start: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Tanggal Selesai</label>
            <Input
              value={localData.registration_end}
              onChange={(e) => setLocalData({ ...localData, registration_end: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">URL Pendaftaran</label>
          <Input
            value={localData.registration_url}
            onChange={(e) => setLocalData({ ...localData, registration_url: e.target.value })}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Timeline Pendaftaran</h4>
            <Button onClick={addTimeline} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </Button>
          </div>
          {localData.timeline.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                placeholder="Label"
                value={item.label}
                onChange={(e) => updateTimeline(index, 'label', e.target.value)}
              />
              <Input
                placeholder="Tanggal"
                value={item.date}
                onChange={(e) => updateTimeline(index, 'date', e.target.value)}
              />
              <Button variant="destructive" size="icon" onClick={() => removeTimeline(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button onClick={() => onSave(localData)} disabled={isSaving} className="w-full">
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </CardContent>
    </Card>
  );
}

// Visi Misi Editor
function VisiMisiEditor({ 
  data, 
  onSave, 
  isSaving 
}: { 
  data: Record<string, unknown>; 
  onSave: (value: unknown) => void;
  isSaving: boolean;
}) {
  const [localData, setLocalData] = useState({
    visi: (data.visi as string) || "",
    misi: (data.misi as string[]) || [],
  });

  const addMisi = () => {
    setLocalData({ ...localData, misi: [...localData.misi, ""] });
  };

  const removeMisi = (index: number) => {
    setLocalData({ ...localData, misi: localData.misi.filter((_, i) => i !== index) });
  };

  const updateMisi = (index: number, value: string) => {
    const updated = [...localData.misi];
    updated[index] = value;
    setLocalData({ ...localData, misi: updated });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Visi & Misi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Visi</label>
          <Textarea
            value={localData.visi}
            onChange={(e) => setLocalData({ ...localData, visi: e.target.value })}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Misi</label>
            <Button onClick={addMisi} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </Button>
          </div>
          {localData.misi.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <Input
                value={item}
                onChange={(e) => updateMisi(index, e.target.value)}
                placeholder={`Misi ${index + 1}`}
              />
              <Button variant="destructive" size="icon" onClick={() => removeMisi(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button onClick={() => onSave(localData)} disabled={isSaving} className="w-full">
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </CardContent>
    </Card>
  );
}

// Sambutan Editor
function SambutanEditor({ 
  data, 
  onSave, 
  isSaving 
}: { 
  data: Record<string, unknown>; 
  onSave: (value: unknown) => void;
  isSaving: boolean;
}) {
  const [localData, setLocalData] = useState({
    nama: (data.nama as string) || "",
    jabatan: (data.jabatan as string) || "",
    foto: (data.foto as string) || "",
    konten: (data.konten as string) || "",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Sambutan Kepala Sekolah
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nama</label>
            <Input
              value={localData.nama}
              onChange={(e) => setLocalData({ ...localData, nama: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Jabatan</label>
            <Input
              value={localData.jabatan}
              onChange={(e) => setLocalData({ ...localData, jabatan: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Foto Kepala Sekolah</label>
          <ImageUpload
            value={localData.foto}
            onChange={(url) => setLocalData({ ...localData, foto: url })}
            folder="sambutan"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Isi Sambutan</label>
          <Textarea
            value={localData.konten}
            onChange={(e) => setLocalData({ ...localData, konten: e.target.value })}
            rows={10}
          />
        </div>

        <Button onClick={() => onSave(localData)} disabled={isSaving} className="w-full">
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </CardContent>
    </Card>
  );
}

// Stats Editor
function StatsEditor({ 
  data, 
  onSave, 
  isSaving 
}: { 
  data: Record<string, number>; 
  onSave: (value: unknown) => void;
  isSaving: boolean;
}) {
  const [localData, setLocalData] = useState({
    jumlah_siswa: data.jumlah_siswa || 0,
    fasilitas: data.fasilitas || 0,
    prestasi: data.prestasi || 0,
    tahun_berdiri: data.tahun_berdiri || 1985,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Statistik Sekolah
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Jumlah Siswa</label>
            <Input
              type="number"
              value={localData.jumlah_siswa}
              onChange={(e) => setLocalData({ ...localData, jumlah_siswa: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Fasilitas</label>
            <Input
              type="number"
              value={localData.fasilitas}
              onChange={(e) => setLocalData({ ...localData, fasilitas: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Prestasi</label>
            <Input
              type="number"
              value={localData.prestasi}
              onChange={(e) => setLocalData({ ...localData, prestasi: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Tahun Berdiri</label>
            <Input
              type="number"
              value={localData.tahun_berdiri}
              onChange={(e) => setLocalData({ ...localData, tahun_berdiri: parseInt(e.target.value) || 1985 })}
            />
          </div>
        </div>

        <Button onClick={() => onSave(localData)} disabled={isSaving} className="w-full">
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </CardContent>
    </Card>
  );
}

// Kontak Editor
function KontakEditor({ 
  data, 
  onSave, 
  isSaving 
}: { 
  data: Record<string, unknown>; 
  onSave: (value: unknown) => void;
  isSaving: boolean;
}) {
  const [localData, setLocalData] = useState({
    alamat: (data.alamat as string) || "",
    telepon: (data.telepon as string) || "",
    email: (data.email as string) || "",
    jam_operasional: (data.jam_operasional as string) || "",
    maps_embed: (data.maps_embed as string) || "",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Informasi Kontak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Alamat</label>
          <Textarea
            value={localData.alamat}
            onChange={(e) => setLocalData({ ...localData, alamat: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Telepon</label>
            <Input
              value={localData.telepon}
              onChange={(e) => setLocalData({ ...localData, telepon: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              value={localData.email}
              onChange={(e) => setLocalData({ ...localData, email: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Jam Operasional</label>
          <Input
            value={localData.jam_operasional}
            onChange={(e) => setLocalData({ ...localData, jam_operasional: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Google Maps Embed URL</label>
          <Textarea
            value={localData.maps_embed}
            onChange={(e) => setLocalData({ ...localData, maps_embed: e.target.value })}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
        </div>

        <Button onClick={() => onSave(localData)} disabled={isSaving} className="w-full">
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </CardContent>
    </Card>
  );
}

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface QuickLink {
  label: string;
  href: string;
  external: boolean;
}

// Footer Editor
function FooterEditor({ 
  data, 
  onSave, 
  isSaving 
}: { 
  data: Record<string, unknown>; 
  onSave: (value: unknown) => void;
  isSaving: boolean;
}) {
  const [localData, setLocalData] = useState({
    tagline: (data.tagline as string) || "",
    instagram: (data.instagram as string) || "",
    tiktok: (data.tiktok as string) || "",
    youtube: (data.youtube as string) || "",
    jam_senin_kamis: (data.jam_senin_kamis as string) || "",
    jam_jumat: (data.jam_jumat as string) || "",
    jam_sabtu: (data.jam_sabtu as string) || "",
    copyright: (data.copyright as string) || "",
    quick_links: (data.quick_links as QuickLink[]) || [
      { label: "Profil Sekolah", href: "/profil/sejarah", external: false },
      { label: "PPDB", href: "https://www.ppdbsman1belitang.sch.id/", external: true },
      { label: "Galeri", href: "/galeri", external: false },
      { label: "Berita & Pengumuman", href: "/informasi/berita", external: false },
      { label: "Portal Siswa", href: "/login", external: false },
      { label: "E-Learning", href: "/login", external: false },
      { label: "Alumni", href: "/alumni", external: false },
    ],
  });

  const addQuickLink = () => {
    setLocalData({
      ...localData,
      quick_links: [...localData.quick_links, { label: "", href: "", external: false }],
    });
  };

  const removeQuickLink = (index: number) => {
    setLocalData({
      ...localData,
      quick_links: localData.quick_links.filter((_, i) => i !== index),
    });
  };

  const updateQuickLink = (index: number, field: keyof QuickLink, value: string | boolean) => {
    const updated = [...localData.quick_links];
    updated[index] = { ...updated[index], [field]: value };
    setLocalData({ ...localData, quick_links: updated });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layout className="h-5 w-5" />
          Footer Website
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Tagline</label>
          <Input
            value={localData.tagline}
            onChange={(e) => setLocalData({ ...localData, tagline: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <span className="w-4 h-4 inline-block">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </span>
              Instagram URL
            </label>
            <Input
              value={localData.instagram}
              onChange={(e) => setLocalData({ ...localData, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <TikTokIcon className="w-4 h-4" />
              TikTok URL
            </label>
            <Input
              value={localData.tiktok}
              onChange={(e) => setLocalData({ ...localData, tiktok: e.target.value })}
              placeholder="https://tiktok.com/@..."
            />
          </div>
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <span className="w-4 h-4 inline-block">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </span>
              YouTube URL
            </label>
            <Input
              value={localData.youtube}
              onChange={(e) => setLocalData({ ...localData, youtube: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Jam Senin-Kamis</label>
            <Input
              value={localData.jam_senin_kamis}
              onChange={(e) => setLocalData({ ...localData, jam_senin_kamis: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Jam Jumat</label>
            <Input
              value={localData.jam_jumat}
              onChange={(e) => setLocalData({ ...localData, jam_jumat: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Jam Sabtu</label>
            <Input
              value={localData.jam_sabtu}
              onChange={(e) => setLocalData({ ...localData, jam_sabtu: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Copyright Text</label>
          <Input
            value={localData.copyright}
            onChange={(e) => setLocalData({ ...localData, copyright: e.target.value })}
          />
        </div>

        {/* Quick Links Editor */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Link Cepat</h4>
            <Button onClick={addQuickLink} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Link
            </Button>
          </div>
          {localData.quick_links.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <Input
                placeholder="Label"
                value={item.label}
                onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="URL/Path"
                value={item.href}
                onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                className="flex-1"
              />
              <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={item.external}
                  onChange={(e) => updateQuickLink(index, 'external', e.target.checked)}
                  className="w-4 h-4"
                />
                External
              </label>
              <Button variant="destructive" size="icon" onClick={() => removeQuickLink(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button onClick={() => onSave(localData)} disabled={isSaving} className="w-full">
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </CardContent>
    </Card>
  );
}

