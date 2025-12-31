import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, User, Search, Mail, Phone } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Guru {
  id: string;
  nama: string;
  nip: string | null;
  jabatan: string;
  mata_pelajaran: string | null;
  pendidikan: string | null;
  email: string | null;
  telepon: string | null;
  foto_url: string | null;
  is_active: boolean;
  order_index: number;
}

export default function GuruAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Guru | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    jabatan: "",
    mata_pelajaran: "",
    pendidikan: "",
    email: "",
    telepon: "",
    foto_url: "",
    is_active: true,
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['guru'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guru')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as Guru[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Guru, 'id' | 'order_index'>) => {
      const { error } = await supabase.from('guru').insert({
        ...data,
        order_index: items?.length || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guru'] });
      toast({ title: "Berhasil", description: "Data guru berhasil ditambahkan" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menambahkan data", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Guru> }) => {
      const { error } = await supabase.from('guru').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guru'] });
      toast({ title: "Berhasil", description: "Data guru berhasil diperbarui" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal memperbarui data", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('guru').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guru'] });
      toast({ title: "Berhasil", description: "Data guru berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menghapus data", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      nama: "",
      nip: "",
      jabatan: "",
      mata_pelajaran: "",
      pendidikan: "",
      email: "",
      telepon: "",
      foto_url: "",
      is_active: true,
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: Guru) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      nip: item.nip || "",
      jabatan: item.jabatan,
      mata_pelajaran: item.mata_pelajaran || "",
      pendidikan: item.pendidikan || "",
      email: item.email || "",
      telepon: item.telepon || "",
      foto_url: item.foto_url || "",
      is_active: item.is_active,
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

  const filteredItems = items?.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.mata_pelajaran?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-foreground">Data Guru</h1>
          <p className="text-muted-foreground">Kelola data guru sekolah</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Guru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Guru" : "Tambah Guru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nama *</label>
                  <Input
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Nama lengkap"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">NIP</label>
                  <Input
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="NIP"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Jabatan *</label>
                  <Input
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    placeholder="Guru Mata Pelajaran / Wali Kelas"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Mata Pelajaran</label>
                  <Input
                    value={formData.mata_pelajaran}
                    onChange={(e) => setFormData({ ...formData, mata_pelajaran: e.target.value })}
                    placeholder="Matematika"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Pendidikan</label>
                <Input
                  value={formData.pendidikan}
                  onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value })}
                  placeholder="S1 Pendidikan Matematika"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Telepon</label>
                  <Input
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    placeholder="08123456789"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Foto</label>
                <ImageUpload
                  value={formData.foto_url}
                  onChange={(url) => setFormData({ ...formData, foto_url: url })}
                  folder="guru"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <label className="text-sm font-medium">Aktif (ditampilkan di website)</label>
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
            placeholder="Cari guru..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredItems?.length || 0} guru
        </span>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>NIP</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Mapel</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    <User className="h-8 w-8 mx-auto mb-2" />
                    Belum ada data guru
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.foto_url ? (
                        <img src={item.foto_url} alt={item.nama} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell className="text-muted-foreground">{item.nip || "-"}</TableCell>
                    <TableCell>{item.jabatan}</TableCell>
                    <TableCell>{item.mata_pelajaran || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {item.email && (
                          <span className="text-xs flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {item.email}
                          </span>
                        )}
                        {item.telepon && (
                          <span className="text-xs flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {item.telepon}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {item.is_active ? "Aktif" : "Nonaktif"}
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
