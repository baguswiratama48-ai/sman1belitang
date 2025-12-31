import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Users } from "lucide-react";

interface StrukturOrganisasi {
  id: string;
  nama: string;
  jabatan: string;
  foto_url: string | null;
  order_index: number;
  level: number;
}

export default function StrukturAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StrukturOrganisasi | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    foto_url: "",
    level: 1,
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['struktur_organisasi'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('struktur_organisasi')
        .select('*')
        .order('level', { ascending: true })
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as StrukturOrganisasi[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<StrukturOrganisasi, 'id' | 'order_index'>) => {
      const { error } = await supabase.from('struktur_organisasi').insert({
        ...data,
        order_index: items?.filter(i => i.level === data.level).length || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['struktur_organisasi'] });
      toast({ title: "Berhasil", description: "Data berhasil ditambahkan" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menambahkan data", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StrukturOrganisasi> }) => {
      const { error } = await supabase.from('struktur_organisasi').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['struktur_organisasi'] });
      toast({ title: "Berhasil", description: "Data berhasil diperbarui" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal memperbarui data", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('struktur_organisasi').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['struktur_organisasi'] });
      toast({ title: "Berhasil", description: "Data berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menghapus data", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({ nama: "", jabatan: "", foto_url: "", level: 1 });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: StrukturOrganisasi) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      jabatan: item.jabatan,
      foto_url: item.foto_url || "",
      level: item.level,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.nama || !formData.jabatan) {
      toast({ title: "Error", description: "Nama dan jabatan wajib diisi", variant: "destructive" });
      return;
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 1: return "Pimpinan";
      case 2: return "Wakil/Koordinator";
      case 3: return "Staff";
      default: return `Level ${level}`;
    }
  };

  const groupedItems = items?.reduce((acc, item) => {
    if (!acc[item.level]) acc[item.level] = [];
    acc[item.level].push(item);
    return acc;
  }, {} as Record<number, StrukturOrganisasi[]>);

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
          <h1 className="text-2xl font-bold text-foreground">Struktur Organisasi</h1>
          <p className="text-muted-foreground">Kelola struktur organisasi sekolah</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Anggota
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Anggota" : "Tambah Anggota"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nama *</label>
                <Input
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Jabatan *</label>
                <Input
                  value={formData.jabatan}
                  onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                  placeholder="Jabatan"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Level</label>
                <Select
                  value={formData.level.toString()}
                  onValueChange={(v) => setFormData({ ...formData, level: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1 - Pimpinan</SelectItem>
                    <SelectItem value="2">Level 2 - Wakil/Koordinator</SelectItem>
                    <SelectItem value="3">Level 3 - Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Foto</label>
                <ImageUpload
                  value={formData.foto_url}
                  onChange={(url) => setFormData({ ...formData, foto_url: url })}
                  folder="struktur"
                />
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

      {!items?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Belum ada data struktur organisasi</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedItems || {}).map(([level, members]) => (
          <div key={level} className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">{getLevelLabel(parseInt(level))}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    {item.foto_url ? (
                      <img
                        src={item.foto_url}
                        alt={item.nama}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{item.nama}</h4>
                      <p className="text-sm text-muted-foreground">{item.jabatan}</p>
                    </div>
                    <div className="flex gap-1">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
