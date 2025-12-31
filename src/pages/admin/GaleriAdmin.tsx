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
import { Plus, Edit, Trash2, Eye, EyeOff, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

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
      console.error("Error fetching galeri:", error);
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
      console.error("Error saving galeri:", error);
      toast.error(error.message || "Gagal menyimpan gambar");
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
      console.error("Error deleting galeri:", error);
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
      console.error("Error toggling publish:", error);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kelola Galeri</h1>
          <p className="text-muted-foreground">Tambah, edit, dan hapus foto galeri sekolah</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tambah Gambar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingGaleri ? "Edit Gambar" : "Tambah Gambar Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul gambar"
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">URL Gambar *</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="album">Album</Label>
                <select
                  id="album"
                  value={formData.album}
                  onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="umum">Umum</option>
                  <option value="kegiatan">Kegiatan</option>
                  <option value="prestasi">Prestasi</option>
                  <option value="fasilitas">Fasilitas</option>
                  <option value="upacara">Upacara</option>
                </select>
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
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingGaleri ? "Simpan Perubahan" : "Tambah Gambar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : galeriList.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada gambar. Klik "Tambah Gambar" untuk menambah foto.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galeriList.map((galeri) => (
            <Card key={galeri.id} className="overflow-hidden group">
              <div className="aspect-square relative">
                <img
                  src={galeri.image_url}
                  alt={galeri.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => togglePublish(galeri)}>
                    {galeri.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(galeri)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(galeri.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {!galeri.is_published && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-gray-900/80 text-white text-xs px-2 py-1 rounded">Draft</span>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="font-medium text-sm truncate">{galeri.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{galeri.album}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
