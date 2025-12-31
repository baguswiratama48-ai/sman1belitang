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
import { Plus, Edit, Trash2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

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
      console.error("Error fetching pengumuman:", error);
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
      console.error("Error saving pengumuman:", error);
      toast.error(error.message || "Gagal menyimpan pengumuman");
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
      console.error("Error deleting pengumuman:", error);
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
      console.error("Error toggling publish:", error);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kelola Pengumuman</h1>
          <p className="text-muted-foreground">Tambah, edit, dan hapus pengumuman sekolah</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tambah Pengumuman
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPengumuman ? "Edit Pengumuman" : "Tambah Pengumuman Baru"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul pengumuman"
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
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_important"
                    checked={formData.is_important}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_important: checked })}
                  />
                  <Label htmlFor="is_important">Penting</Label>
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
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  {editingPengumuman ? "Simpan Perubahan" : "Tambah Pengumuman"}
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
          ) : pengumumanList.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Belum ada pengumuman. Klik "Tambah Pengumuman" untuk membuat pengumuman pertama.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kadaluarsa</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pengumumanList.map((pengumuman) => (
                  <TableRow key={pengumuman.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {pengumuman.is_important && (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="max-w-xs truncate">{pengumuman.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          pengumuman.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {pengumuman.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {pengumuman.is_published ? "Aktif" : "Draft"}
                      </span>
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
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => togglePublish(pengumuman)}>
                          {pengumuman.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(pengumuman)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(pengumuman.id)}>
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
