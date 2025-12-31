import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, GraduationCap, Search, Eye, EyeOff } from "lucide-react";

interface Alumni {
  id: string;
  nama: string;
  angkatan: string;
  foto_url: string | null;
  pekerjaan: string | null;
  instansi: string | null;
  testimoni: string | null;
  is_published: boolean;
}

export default function AlumniAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Alumni | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    nama: "",
    angkatan: "",
    foto_url: "",
    pekerjaan: "",
    instansi: "",
    testimoni: "",
    is_published: true,
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['alumni'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .order('angkatan', { ascending: false });
      if (error) throw error;
      return data as Alumni[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Alumni, 'id'>) => {
      const { error } = await supabase.from('alumni').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumni'] });
      toast({ title: "Berhasil", description: "Data alumni berhasil ditambahkan" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menambahkan data", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Alumni> }) => {
      const { error } = await supabase.from('alumni').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumni'] });
      toast({ title: "Berhasil", description: "Data alumni berhasil diperbarui" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal memperbarui data", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('alumni').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumni'] });
      toast({ title: "Berhasil", description: "Data alumni berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menghapus data", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      nama: "",
      angkatan: "",
      foto_url: "",
      pekerjaan: "",
      instansi: "",
      testimoni: "",
      is_published: true,
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: Alumni) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      angkatan: item.angkatan,
      foto_url: item.foto_url || "",
      pekerjaan: item.pekerjaan || "",
      instansi: item.instansi || "",
      testimoni: item.testimoni || "",
      is_published: item.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.nama || !formData.angkatan) {
      toast({ title: "Error", description: "Nama dan angkatan wajib diisi", variant: "destructive" });
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
    item.angkatan.includes(searchQuery)
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
          <h1 className="text-2xl font-bold text-foreground">Data Alumni</h1>
          <p className="text-muted-foreground">Kelola data alumni sekolah</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Alumni
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Alumni" : "Tambah Alumni"}</DialogTitle>
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
                  <label className="text-sm font-medium">Angkatan *</label>
                  <Input
                    value={formData.angkatan}
                    onChange={(e) => setFormData({ ...formData, angkatan: e.target.value })}
                    placeholder="2020"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Pekerjaan</label>
                  <Input
                    value={formData.pekerjaan}
                    onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                    placeholder="Dokter / Pengusaha"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Instansi</label>
                  <Input
                    value={formData.instansi}
                    onChange={(e) => setFormData({ ...formData, instansi: e.target.value })}
                    placeholder="RS/Perusahaan/Universitas"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Testimoni</label>
                <Textarea
                  value={formData.testimoni}
                  onChange={(e) => setFormData({ ...formData, testimoni: e.target.value })}
                  placeholder="Kesan dan pesan selama di SMAN 1 Belitang..."
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Foto</label>
                <ImageUpload
                  value={formData.foto_url}
                  onChange={(url) => setFormData({ ...formData, foto_url: url })}
                  folder="alumni"
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
            placeholder="Cari alumni..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredItems?.length || 0} alumni
        </span>
      </div>

      {filteredItems?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Belum ada data alumni</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems?.map((item) => (
            <Card key={item.id} className={!item.is_published ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {item.foto_url ? (
                    <img
                      src={item.foto_url}
                      alt={item.nama}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">{item.nama}</h3>
                      {!item.is_published && <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <p className="text-sm text-primary">Angkatan {item.angkatan}</p>
                    {item.pekerjaan && (
                      <p className="text-sm text-muted-foreground">
                        {item.pekerjaan} {item.instansi && `@ ${item.instansi}`}
                      </p>
                    )}
                  </div>
                </div>
                {item.testimoni && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-3 italic">
                    "{item.testimoni}"
                  </p>
                )}
                <div className="flex justify-end gap-1 mt-3">
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
      )}
    </div>
  );
}
