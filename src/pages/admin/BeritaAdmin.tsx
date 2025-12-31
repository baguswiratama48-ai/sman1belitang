import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface Berita {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

export default function BeritaAdmin() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBerita, setEditingBerita] = useState<Berita | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image_url: "",
    category: "umum",
    is_published: false,
  });

  useEffect(() => {
    fetchBerita();
  }, []);

  const fetchBerita = async () => {
    try {
      const { data, error } = await supabase
        .from("berita")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBeritaList(data || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error fetching berita:", error);
      toast.error("Gagal memuat data berita");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error("Judul dan konten harus diisi");
      return;
    }

    try {
      const slug = editingBerita?.slug || generateSlug(formData.title) + "-" + Date.now();
      const payload = {
        title: formData.title,
        slug,
        excerpt: formData.excerpt || null,
        content: formData.content,
        image_url: formData.image_url || null,
        category: formData.category,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
      };

      if (editingBerita) {
        const { error } = await supabase
          .from("berita")
          .update(payload)
          .eq("id", editingBerita.id);
        if (error) throw error;
        toast.success("Berita berhasil diperbarui");
      } else {
        const { error } = await supabase.from("berita").insert(payload);
        if (error) throw error;
        toast.success("Berita berhasil ditambahkan");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchBerita();
    } catch (error: any) {
      if (import.meta.env.DEV) console.error("Error saving berita:", error);
      toast.error("Gagal menyimpan berita");
    }
  };

  const handleEdit = (berita: Berita) => {
    setEditingBerita(berita);
    setFormData({
      title: berita.title,
      excerpt: berita.excerpt || "",
      content: berita.content,
      image_url: berita.image_url || "",
      category: berita.category,
      is_published: berita.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;

    try {
      const { error } = await supabase.from("berita").delete().eq("id", id);
      if (error) throw error;
      toast.success("Berita berhasil dihapus");
      fetchBerita();
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error deleting berita:", error);
      toast.error("Gagal menghapus berita");
    }
  };

  const togglePublish = async (berita: Berita) => {
    try {
      const { error } = await supabase
        .from("berita")
        .update({
          is_published: !berita.is_published,
          published_at: !berita.is_published ? new Date().toISOString() : null,
        })
        .eq("id", berita.id);

      if (error) throw error;
      toast.success(berita.is_published ? "Berita disembunyikan" : "Berita dipublikasikan");
      fetchBerita();
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error toggling publish:", error);
      toast.error("Gagal mengubah status publikasi");
    }
  };

  const resetForm = () => {
    setEditingBerita(null);
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      image_url: "",
      category: "umum",
      is_published: false,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kelola Berita</h1>
          <p className="text-muted-foreground">Tambah, edit, dan hapus berita sekolah</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tambah Berita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBerita ? "Edit Berita" : "Tambah Berita Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul berita"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Ringkasan singkat berita"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Konten *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Isi berita lengkap"
                  rows={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">URL Gambar</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="umum">Umum</option>
                  <option value="akademik">Akademik</option>
                  <option value="prestasi">Prestasi</option>
                  <option value="kegiatan">Kegiatan</option>
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
                  {editingBerita ? "Simpan Perubahan" : "Tambah Berita"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Memuat...</div>
          ) : beritaList.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Belum ada berita. Klik "Tambah Berita" untuk membuat berita pertama.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {beritaList.map((berita) => (
                  <TableRow key={berita.id}>
                    <TableCell className="font-medium max-w-xs truncate">{berita.title}</TableCell>
                    <TableCell className="capitalize">{berita.category}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          berita.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {berita.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {berita.is_published ? "Publik" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(berita.created_at), "d MMM yyyy", { locale: idLocale })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => togglePublish(berita)}>
                          {berita.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(berita)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(berita.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
