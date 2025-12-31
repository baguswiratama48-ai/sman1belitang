import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Calendar, Search } from "lucide-react";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface KalenderAkademik {
  id: string;
  judul: string;
  deskripsi: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  kategori: string;
  is_published: boolean;
}

export default function KalenderAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KalenderAkademik | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    kategori: "Umum",
    is_published: true,
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['kalender_akademik'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kalender_akademik')
        .select('*')
        .order('tanggal_mulai', { ascending: true });
      if (error) throw error;
      return data as KalenderAkademik[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<KalenderAkademik, 'id'>) => {
      const { error } = await supabase.from('kalender_akademik').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kalender_akademik'] });
      toast({ title: "Berhasil", description: "Kegiatan berhasil ditambahkan" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menambahkan kegiatan", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<KalenderAkademik> }) => {
      const { error } = await supabase.from('kalender_akademik').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kalender_akademik'] });
      toast({ title: "Berhasil", description: "Kegiatan berhasil diperbarui" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal memperbarui kegiatan", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('kalender_akademik').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kalender_akademik'] });
      toast({ title: "Berhasil", description: "Kegiatan berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menghapus kegiatan", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      judul: "",
      deskripsi: "",
      tanggal_mulai: "",
      tanggal_selesai: "",
      kategori: "Umum",
      is_published: true,
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: KalenderAkademik) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi || "",
      tanggal_mulai: item.tanggal_mulai,
      tanggal_selesai: item.tanggal_selesai || "",
      kategori: item.kategori,
      is_published: item.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.judul || !formData.tanggal_mulai) {
      toast({ title: "Error", description: "Judul dan tanggal mulai wajib diisi", variant: "destructive" });
      return;
    }

    const submitData = {
      ...formData,
      tanggal_selesai: formData.tanggal_selesai || null,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const filteredItems = items?.filter(item =>
    item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: localeID });
    } catch {
      return dateStr;
    }
  };

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
          <h1 className="text-2xl font-bold text-foreground">Kalender Akademik</h1>
          <p className="text-muted-foreground">Kelola jadwal kegiatan akademik</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kegiatan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Kegiatan" : "Tambah Kegiatan"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Judul Kegiatan *</label>
                <Input
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Ujian Tengah Semester"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Kategori</label>
                <Input
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  placeholder="Ujian / Libur / Kegiatan"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tanggal Mulai *</label>
                  <Input
                    type="date"
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tanggal Selesai</label>
                  <Input
                    type="date"
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Deskripsi</label>
                <Textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Keterangan tambahan..."
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <label className="text-sm font-medium">Tampilkan di website</label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>Batal</Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingItem ? "Simpan" : "Tambah"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kegiatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredItems?.length || 0} kegiatan
        </span>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kegiatan</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2" />
                    Belum ada kegiatan
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.judul}</p>
                        {item.deskripsi && (
                          <p className="text-sm text-muted-foreground line-clamp-1">{item.deskripsi}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {item.kategori}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatDate(item.tanggal_mulai)}
                      {item.tanggal_selesai && ` - ${formatDate(item.tanggal_selesai)}`}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${item.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {item.is_published ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
