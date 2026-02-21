import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface Berita {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  gallery_images: string[] | null;
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
    gallery_images: [] as string[],
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
      setBeritaList((data as any) || []);
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
        gallery_images: formData.gallery_images,
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
      toast.error(error?.message || "Gagal menyimpan berita: Error tidak diketahui");
      console.error("Save error details:", error);
    }
  };

  const handleEdit = (berita: Berita) => {
    setEditingBerita(berita);
    setFormData({
      title: berita.title,
      excerpt: berita.excerpt || "",
      content: berita.content,
      image_url: berita.image_url || "",
      gallery_images: berita.gallery_images || [],
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
      gallery_images: [],
      category: "umum",
      is_published: false,
    });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredBerita = beritaList.filter((berita) => {
    const matchesSearch = berita.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || berita.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kelola Berita</h1>
          <p className="text-muted-foreground">Tambah, edit, dan hapus berita sekolah</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary-light))] shadow-lg">
              <Plus className="mr-2 h-4 w-4" /> Tambah Berita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingBerita ? "Edit Berita" : "Tambah Berita Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul berita"
                  className="rounded-xl"
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
                  className="rounded-xl"
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
                  className="rounded-xl"
                  required
                />
              </div>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                label="Gambar Utama (Cover)"
                folder="berita"
              />

              <div className="space-y-2">
                <Label>Galeri Foto (Bisa banyak foto)</Label>
                <div className="grid grid-cols-2 gap-4">
                  {formData.gallery_images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img src={url} alt="" className="w-full h-24 object-cover rounded-xl border" />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const newGallery = [...formData.gallery_images];
                          newGallery.splice(index, 1);
                          setFormData({ ...formData, gallery_images: newGallery });
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center justify-center border-2 border-dashed rounded-xl h-24 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => {
                      // Trigger galery upload
                    }}
                  >
                    <ImageUpload
                      value=""
                      onChange={(url) => {
                        if (url) {
                          setFormData({
                            ...formData,
                            gallery_images: [...formData.gallery_images, url]
                          });
                        }
                      }}
                      label=""
                      folder="berita/gallery"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="umum">Umum</SelectItem>
                    <SelectItem value="akademik">Akademik</SelectItem>
                    <SelectItem value="prestasi">Prestasi</SelectItem>
                    <SelectItem value="kegiatan">Kegiatan</SelectItem>
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
                  {editingBerita ? "Simpan Perubahan" : "Tambah Berita"}
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
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl bg-[hsl(var(--admin-sidebar))] border-0"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-40 rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="umum">Umum</SelectItem>
                <SelectItem value="akademik">Akademik</SelectItem>
                <SelectItem value="prestasi">Prestasi</SelectItem>
                <SelectItem value="kegiatan">Kegiatan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="h-8 w-8 border-4 border-[hsl(var(--admin-primary))] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Memuat...
            </div>
          ) : filteredBerita.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8" />
              </div>
              <p className="font-medium">Tidak ada berita ditemukan</p>
              <p className="text-sm mt-1">Coba ubah filter atau tambah berita baru</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(var(--admin-sidebar))] hover:bg-[hsl(var(--admin-sidebar))]">
                  <TableHead className="font-semibold">Judul</TableHead>
                  <TableHead className="font-semibold">Kategori</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Tanggal</TableHead>
                  <TableHead className="text-right font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBerita.map((berita) => (
                  <TableRow key={berita.id} className="hover:bg-[hsl(var(--admin-sidebar))]/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {berita.image_url && (
                          <img
                            src={berita.image_url}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        )}
                        <span className="font-medium max-w-xs truncate">{berita.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize rounded-lg">
                        {berita.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={berita.is_published ? "default" : "outline"}
                        className={berita.is_published
                          ? "bg-[hsl(var(--admin-success))]/10 text-[hsl(var(--admin-success))] hover:bg-[hsl(var(--admin-success))]/20 border-0"
                          : ""
                        }
                      >
                        {berita.is_published ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                        {berita.is_published ? "Publik" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(berita.created_at), "d MMM yyyy", { locale: idLocale })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => togglePublish(berita)}
                          className="h-8 w-8 rounded-lg hover:bg-[hsl(var(--admin-primary))]/10"
                        >
                          {berita.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(berita)}
                          className="h-8 w-8 rounded-lg hover:bg-[hsl(var(--admin-primary))]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(berita.id)}
                          className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        >
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
