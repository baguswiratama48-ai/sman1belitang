import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Users, GraduationCap, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Kelas {
  id: string;
  nama_kelas: string;
  tingkat: string;
  jurusan: string | null;
  wali_kelas: string | null;
  jumlah_siswa: number;
  tahun_ajaran: string;
  order_index: number;
}

export default function KelasAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Kelas | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTingkat, setFilterTingkat] = useState<string>("all");
  const [formData, setFormData] = useState({
    nama_kelas: "",
    tingkat: "X",
    jurusan: "",
    wali_kelas: "",
    jumlah_siswa: 0,
    tahun_ajaran: "2024/2025",
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['kelas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kelas')
        .select('*')
        .order('tingkat', { ascending: true })
        .order('nama_kelas', { ascending: true });
      if (error) throw error;
      return data as Kelas[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Kelas, 'id' | 'order_index'>) => {
      const { error } = await supabase.from('kelas').insert({
        ...data,
        order_index: items?.length || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
      toast({ title: "Berhasil", description: "Data kelas berhasil ditambahkan" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menambahkan data", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Kelas> }) => {
      const { error } = await supabase.from('kelas').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
      toast({ title: "Berhasil", description: "Data kelas berhasil diperbarui" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal memperbarui data", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('kelas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
      toast({ title: "Berhasil", description: "Data kelas berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menghapus data", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      nama_kelas: "",
      tingkat: "X",
      jurusan: "",
      wali_kelas: "",
      jumlah_siswa: 0,
      tahun_ajaran: "2024/2025",
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: Kelas) => {
    setEditingItem(item);
    setFormData({
      nama_kelas: item.nama_kelas,
      tingkat: item.tingkat,
      jurusan: item.jurusan || "",
      wali_kelas: item.wali_kelas || "",
      jumlah_siswa: item.jumlah_siswa,
      tahun_ajaran: item.tahun_ajaran,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.nama_kelas || !formData.tingkat || !formData.tahun_ajaran) {
      toast({ title: "Error", description: "Nama kelas, tingkat, dan tahun ajaran wajib diisi", variant: "destructive" });
      return;
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredItems = items?.filter(item => {
    const matchesSearch = item.nama_kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.wali_kelas?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTingkat = filterTingkat === "all" || item.tingkat === filterTingkat;
    return matchesSearch && matchesTingkat;
  });

  const totalSiswa = items?.reduce((acc, item) => acc + item.jumlah_siswa, 0) || 0;

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
          <h1 className="text-2xl font-bold text-foreground">Data Kelas & Siswa</h1>
          <p className="text-muted-foreground">Kelola data kelas dan jumlah siswa</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kelas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Kelas" : "Tambah Kelas"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nama Kelas *</label>
                  <Input
                    value={formData.nama_kelas}
                    onChange={(e) => setFormData({ ...formData, nama_kelas: e.target.value })}
                    placeholder="X IPA 1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tingkat *</label>
                  <Select
                    value={formData.tingkat}
                    onValueChange={(v) => setFormData({ ...formData, tingkat: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="X">Kelas X</SelectItem>
                      <SelectItem value="XI">Kelas XI</SelectItem>
                      <SelectItem value="XII">Kelas XII</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Jurusan</label>
                  <Input
                    value={formData.jurusan}
                    onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                    placeholder="IPA / IPS"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Jumlah Siswa</label>
                  <Input
                    type="number"
                    value={formData.jumlah_siswa}
                    onChange={(e) => setFormData({ ...formData, jumlah_siswa: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Wali Kelas</label>
                  <Input
                    value={formData.wali_kelas}
                    onChange={(e) => setFormData({ ...formData, wali_kelas: e.target.value })}
                    placeholder="Nama wali kelas"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tahun Ajaran *</label>
                  <Input
                    value={formData.tahun_ajaran}
                    onChange={(e) => setFormData({ ...formData, tahun_ajaran: e.target.value })}
                    placeholder="2024/2025"
                  />
                </div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <GraduationCap className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{totalSiswa}</p>
            <p className="text-sm text-muted-foreground">Total Siswa</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">{items?.filter(i => i.tingkat === "X").length || 0}</p>
            <p className="text-sm text-muted-foreground">Kelas X</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{items?.filter(i => i.tingkat === "XI").length || 0}</p>
            <p className="text-sm text-muted-foreground">Kelas XI</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">{items?.filter(i => i.tingkat === "XII").length || 0}</p>
            <p className="text-sm text-muted-foreground">Kelas XII</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterTingkat} onValueChange={setFilterTingkat}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter tingkat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tingkat</SelectItem>
            <SelectItem value="X">Kelas X</SelectItem>
            <SelectItem value="XI">Kelas XI</SelectItem>
            <SelectItem value="XII">Kelas XII</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kelas</TableHead>
                <TableHead>Tingkat</TableHead>
                <TableHead>Jurusan</TableHead>
                <TableHead>Wali Kelas</TableHead>
                <TableHead>Jumlah Siswa</TableHead>
                <TableHead>Tahun Ajaran</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <GraduationCap className="h-8 w-8 mx-auto mb-2" />
                    Belum ada data kelas
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nama_kelas}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.tingkat === "X" ? 'bg-blue-100 text-blue-700' :
                        item.tingkat === "XI" ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        Kelas {item.tingkat}
                      </span>
                    </TableCell>
                    <TableCell>{item.jurusan || "-"}</TableCell>
                    <TableCell>{item.wali_kelas || "-"}</TableCell>
                    <TableCell>{item.jumlah_siswa} siswa</TableCell>
                    <TableCell>{item.tahun_ajaran}</TableCell>
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
