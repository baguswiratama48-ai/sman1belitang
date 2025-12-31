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
  const [localSlides, setLocalSlides] = useState<HeroSlide[]>(slides);

  const addSlide = () => {
    setLocalSlides([...localSlides, { image: "", title: "", subtitle: "", description: "" }]);
  };

  const removeSlide = (index: number) => {
    setLocalSlides(localSlides.filter((_, i) => i !== index));
  };

  const updateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const updated = [...localSlides];
    updated[index] = { ...updated[index], [field]: value };
    setLocalSlides(updated);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Slider Beranda
        </CardTitle>
        <Button onClick={addSlide} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Slide
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {localSlides.map((slide, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Slide {index + 1}</h4>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => removeSlide(index)}
                disabled={localSlides.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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
        <Button onClick={() => onSave(localSlides)} disabled={isSaving} className="w-full">
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
    tujuan: (data.tujuan as string) || "",
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
          Visi, Misi & Tujuan
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

        <div>
          <label className="text-sm font-medium">Tujuan Sekolah</label>
          <Textarea
            value={localData.tujuan}
            onChange={(e) => setLocalData({ ...localData, tujuan: e.target.value })}
            rows={4}
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
    facebook: (data.facebook as string) || "",
    instagram: (data.instagram as string) || "",
    youtube: (data.youtube as string) || "",
    jam_senin_kamis: (data.jam_senin_kamis as string) || "",
    jam_jumat: (data.jam_jumat as string) || "",
    jam_sabtu: (data.jam_sabtu as string) || "",
    copyright: (data.copyright as string) || "",
  });

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
            <label className="text-sm font-medium">Facebook URL</label>
            <Input
              value={localData.facebook}
              onChange={(e) => setLocalData({ ...localData, facebook: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Instagram URL</label>
            <Input
              value={localData.instagram}
              onChange={(e) => setLocalData({ ...localData, instagram: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Youtube URL</label>
            <Input
              value={localData.youtube}
              onChange={(e) => setLocalData({ ...localData, youtube: e.target.value })}
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

        <Button onClick={() => onSave(localData)} disabled={isSaving} className="w-full">
          {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </CardContent>
    </Card>
  );
}
