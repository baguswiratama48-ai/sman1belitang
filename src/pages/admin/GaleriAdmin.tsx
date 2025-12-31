import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, EyeOff, ImageIcon, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Galeri {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  album: string | null;
  is_published: boolean;
  created_at: string;
}

export default function GaleriAdmin() {
  const [galeriList, setGaleriList] = useState<Galeri[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGaleri, setEditingGaleri] = useState<Galeri | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    album: "umum",
    is_published: false,
  });

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    try {
      const { data, error } = await supabase
        .from("galeri")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGaleriList(data || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error fetching galeri:", error);
      toast.error("Gagal memuat data galeri");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image_url) {
      toast.error("Judul dan URL gambar harus diisi");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        image_url: formData.image_url,
        album: formData.album,
        is_published: formData.is_published,
      };

      if (editingGaleri) {
        const { error } = await supabase
          .from("galeri")
          .update(payload)
          .eq("id", editingGaleri.id);
        if (error) throw error;
        toast.success("Galeri berhasil diperbarui");
      } else {
        const { error } = await supabase.from("galeri").insert(payload);
        if (error) throw error;
        toast.success("Gambar berhasil ditambahkan");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchGaleri();
    } catch (error: any) {
      if (import.meta.env.DEV) console.error("Error saving galeri:", error);
      toast.error("Gagal menyimpan gambar");
    }
  };

  const handleEdit = (galeri: Galeri) => {
    setEditingGaleri(galeri);
    setFormData({
      title: galeri.title,
      description: galeri.description || "",
      image_url: galeri.image_url,
      album: galeri.album || "umum",
      is_published: galeri.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus gambar ini?")) return;

    try {
      const { error } = await supabase.from("galeri").delete().eq("id", id);
      if (error) throw error;
      toast.success("Gambar berhasil dihapus");
      fetchGaleri();
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error deleting galeri:", error);
      toast.error("Gagal menghapus gambar");
    }
  };

  const togglePublish = async (galeri: Galeri) => {
    try {
      const { error } = await supabase
        .from("galeri")
        .update({ is_published: !galeri.is_published })
        .eq("id", galeri.id);

      if (error) throw error;
      toast.success(galeri.is_published ? "Gambar disembunyikan" : "Gambar dipublikasikan");
      fetchGaleri();
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error toggling publish:", error);
      toast.error("Gagal mengubah status publikasi");
    }
  };

  const resetForm = () => {
    setEditingGaleri(null);
    setFormData({
      title: "",
      description: "",
      image_url: "",
      album: "umum",
      is_published: false,
    });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterAlbum, setFilterAlbum] = useState("all");

  const filteredGaleri = galeriList.filter((galeri) => {
    const matchesSearch = galeri.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAlbum = filterAlbum === "all" || galeri.album === filterAlbum;
    return matchesSearch && matchesAlbum;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kelola Galeri</h1>
          <p className="text-muted-foreground">Tambah, edit, dan hapus foto galeri sekolah</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary-light))] shadow-lg">
              <Plus className="mr-2 h-4 w-4" /> Tambah Gambar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingGaleri ? "Edit Gambar" : "Tambah Gambar Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul gambar"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi singkat"
                  rows={2}
                  className="rounded-xl"
                />
              </div>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                label="Gambar *"
                folder="galeri"
              />
              <div className="space-y-2">
                <Label htmlFor="album">Album</Label>
                <Select value={formData.album} onValueChange={(value) => setFormData({ ...formData, album: value })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="umum">Umum</SelectItem>
                    <SelectItem value="kegiatan">Kegiatan</SelectItem>
                    <SelectItem value="prestasi">Prestasi</SelectItem>
                    <SelectItem value="fasilitas">Fasilitas</SelectItem>
                    <SelectItem value="upacara">Upacara</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="is_published">Publikasikan sekarang</Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                  Batal
                </Button>
                <Button type="submit" className="rounded-xl bg-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary-light))]">
                  {editingGaleri ? "Simpan Perubahan" : "Tambah Gambar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari gambar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl bg-[hsl(var(--admin-sidebar))] border-0"
              />
            </div>
            <Select value={filterAlbum} onValueChange={setFilterAlbum}>
              <SelectTrigger className="w-full sm:w-40 rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Album" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="umum">Umum</SelectItem>
                <SelectItem value="kegiatan">Kegiatan</SelectItem>
                <SelectItem value="prestasi">Prestasi</SelectItem>
                <SelectItem value="fasilitas">Fasilitas</SelectItem>
                <SelectItem value="upacara">Upacara</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : filteredGaleri.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center text-muted-foreground">
            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
              <ImageIcon className="h-8 w-8" />
            </div>
            <p className="font-medium">Tidak ada gambar ditemukan</p>
            <p className="text-sm mt-1">Coba ubah filter atau tambah gambar baru</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGaleri.map((galeri) => (
            <Card key={galeri.id} className="overflow-hidden group border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="aspect-square relative">
                <img
                  src={galeri.image_url}
                  alt={galeri.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-medium text-sm truncate mb-3">{galeri.title}</p>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => togglePublish(galeri)}
                        className="h-8 rounded-lg"
                      >
                        {galeri.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => handleEdit(galeri)}
                        className="h-8 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDelete(galeri.id)}
                        className="h-8 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {!galeri.is_published && (
                    <Badge variant="secondary" className="bg-black/60 text-white border-0 rounded-lg">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Draft
                    </Badge>
                  )}
                </div>
                {/* Album Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-[hsl(var(--admin-primary))]/90 text-white border-0 rounded-lg capitalize">
                    {galeri.album}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
