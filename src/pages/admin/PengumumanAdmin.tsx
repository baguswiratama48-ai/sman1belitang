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
import { Plus, Edit, Trash2, Eye, EyeOff, AlertCircle, Search, Megaphone } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface Pengumuman {
  id: string;
  title: string;
  content: string;
  is_important: boolean;
  is_published: boolean;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export default function PengumumanAdmin() {
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPengumuman, setEditingPengumuman] = useState<Pengumuman | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_important: false,
    is_published: false,
    expires_at: "",
  });

  useEffect(() => {
    fetchPengumuman();
  }, []);

  const fetchPengumuman = async () => {
    try {
      const { data, error } = await supabase
        .from("pengumuman")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPengumumanList(data || []);
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error fetching pengumuman:", error);
      toast.error("Gagal memuat data pengumuman");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error("Judul dan konten harus diisi");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        is_important: formData.is_important,
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
      };

      if (editingPengumuman) {
        const { error } = await supabase
          .from("pengumuman")
          .update(payload)
          .eq("id", editingPengumuman.id);
        if (error) throw error;
        toast.success("Pengumuman berhasil diperbarui");
      } else {
        const { error } = await supabase.from("pengumuman").insert(payload);
        if (error) throw error;
        toast.success("Pengumuman berhasil ditambahkan");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPengumuman();
    } catch (error: any) {
      if (import.meta.env.DEV) console.error("Error saving pengumuman:", error);
      toast.error("Gagal menyimpan pengumuman");
    }
  };

  const handleEdit = (pengumuman: Pengumuman) => {
    setEditingPengumuman(pengumuman);
    setFormData({
      title: pengumuman.title,
      content: pengumuman.content,
      is_important: pengumuman.is_important,
      is_published: pengumuman.is_published,
      expires_at: pengumuman.expires_at ? pengumuman.expires_at.split("T")[0] : "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pengumuman ini?")) return;

    try {
      const { error } = await supabase.from("pengumuman").delete().eq("id", id);
      if (error) throw error;
      toast.success("Pengumuman berhasil dihapus");
      fetchPengumuman();
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error deleting pengumuman:", error);
      toast.error("Gagal menghapus pengumuman");
    }
  };

  const togglePublish = async (pengumuman: Pengumuman) => {
    try {
      const { error } = await supabase
        .from("pengumuman")
        .update({
          is_published: !pengumuman.is_published,
          published_at: !pengumuman.is_published ? new Date().toISOString() : null,
        })
        .eq("id", pengumuman.id);

      if (error) throw error;
      toast.success(pengumuman.is_published ? "Pengumuman disembunyikan" : "Pengumuman dipublikasikan");
      fetchPengumuman();
    } catch (error) {
      if (import.meta.env.DEV) console.error("Error toggling publish:", error);
      toast.error("Gagal mengubah status publikasi");
    }
  };

  const resetForm = () => {
    setEditingPengumuman(null);
    setFormData({
      title: "",
      content: "",
      is_important: false,
      is_published: false,
      expires_at: "",
    });
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredPengumuman = pengumumanList.filter((pengumuman) => {
    return pengumuman.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kelola Pengumuman</h1>
          <p className="text-muted-foreground">Tambah, edit, dan hapus pengumuman sekolah</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary-light))] shadow-lg">
              <Plus className="mr-2 h-4 w-4" /> Tambah Pengumuman
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingPengumuman ? "Edit Pengumuman" : "Tambah Pengumuman Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul pengumuman"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Konten *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Isi pengumuman"
                  rows={5}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expires_at">Tanggal Kadaluarsa (opsional)</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_important"
                    checked={formData.is_important}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_important: checked })}
                  />
                  <Label htmlFor="is_important" className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-[hsl(var(--admin-danger))]" />
                    Penting
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is_published">Publikasikan</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">
                  Batal
                </Button>
                <Button type="submit" className="rounded-xl bg-[hsl(var(--admin-primary))] hover:bg-[hsl(var(--admin-primary-light))]">
                  {editingPengumuman ? "Simpan Perubahan" : "Tambah Pengumuman"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengumuman..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl bg-[hsl(var(--admin-sidebar))] border-0"
            />
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
          ) : filteredPengumuman.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                <Megaphone className="h-8 w-8" />
              </div>
              <p className="font-medium">Tidak ada pengumuman ditemukan</p>
              <p className="text-sm mt-1">Coba ubah pencarian atau tambah pengumuman baru</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(var(--admin-sidebar))] hover:bg-[hsl(var(--admin-sidebar))]">
                  <TableHead className="font-semibold">Judul</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Kadaluarsa</TableHead>
                  <TableHead className="font-semibold">Tanggal</TableHead>
                  <TableHead className="text-right font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPengumuman.map((pengumuman) => (
                  <TableRow key={pengumuman.id} className="hover:bg-[hsl(var(--admin-sidebar))]/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {pengumuman.is_important && (
                          <Badge className="bg-[hsl(var(--admin-danger))]/10 text-[hsl(var(--admin-danger))] border-0 rounded-lg">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Penting
                          </Badge>
                        )}
                        <span className="font-medium max-w-xs truncate">{pengumuman.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={pengumuman.is_published ? "default" : "outline"}
                        className={pengumuman.is_published 
                          ? "bg-[hsl(var(--admin-success))]/10 text-[hsl(var(--admin-success))] hover:bg-[hsl(var(--admin-success))]/20 border-0" 
                          : ""
                        }
                      >
                        {pengumuman.is_published ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                        {pengumuman.is_published ? "Aktif" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {pengumuman.expires_at
                        ? format(new Date(pengumuman.expires_at), "d MMM yyyy", { locale: idLocale })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(pengumuman.created_at), "d MMM yyyy", { locale: idLocale })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => togglePublish(pengumuman)}
                          className="h-8 w-8 rounded-lg hover:bg-[hsl(var(--admin-primary))]/10"
                        >
                          {pengumuman.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleEdit(pengumuman)}
                          className="h-8 w-8 rounded-lg hover:bg-[hsl(var(--admin-primary))]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleDelete(pengumuman.id)}
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
