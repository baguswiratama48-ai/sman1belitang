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
import { Plus, Pencil, Trash2, Loader2, Building2, Search, Eye, EyeOff } from "lucide-react";

interface Fasilitas {
  id: string;
  nama: string;
  deskripsi: string | null;
  image_url: string;
  kategori: string;
  is_published: boolean;
  order_index: number;
}

export default function FasilitasAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Fasilitas | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    image_url: "",
    kategori: "Umum",
    is_published: true,
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['fasilitas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fasilitas')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as Fasilitas[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Fasilitas, 'id' | 'order_index'>) => {
      const { error } = await supabase.from('fasilitas').insert({
        ...data,
        order_index: items?.length || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasilitas'] });
      toast({ title: "Berhasil", description: "Fasilitas berhasil ditambahkan" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menambahkan fasilitas", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Fasilitas> }) => {
      const { error } = await supabase.from('fasilitas').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasilitas'] });
      toast({ title: "Berhasil", description: "Fasilitas berhasil diperbarui" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal memperbarui fasilitas", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('fasilitas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasilitas'] });
      toast({ title: "Berhasil", description: "Fasilitas berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menghapus fasilitas", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      nama: "",
      deskripsi: "",
      image_url: "",
      kategori: "Umum",
      is_published: true,
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: Fasilitas) => {
    setEditingItem(item);
    setFormData({
      nama: item.nama,
      deskripsi: item.deskripsi || "",
      image_url: item.image_url,
      kategori: item.kategori,
      is_published: item.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.nama || !formData.image_url) {
      toast({ title: "Error", description: "Nama dan gambar wajib diisi", variant: "destructive" });
      return;
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const togglePublish = (item: Fasilitas) => {
    updateMutation.mutate({ 
      id: item.id, 
      data: { is_published: !item.is_published } 
    });
  };

  const filteredItems = items?.filter(item =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-2xl font-bold text-foreground">Fasilitas</h1>
          <p className="text-muted-foreground">Kelola fasilitas sekolah</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Fasilitas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Fasilitas" : "Tambah Fasilitas"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nama Fasilitas *</label>
                <Input
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Laboratorium IPA"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Kategori</label>
                <Input
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                  placeholder="Laboratorium / Olahraga / Umum"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Deskripsi</label>
                <Textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Deskripsi fasilitas..."
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Gambar *</label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  folder="fasilitas"
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
            placeholder="Cari fasilitas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredItems?.length || 0} fasilitas
        </span>
      </div>

      {filteredItems?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Belum ada data fasilitas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems?.map((item) => (
            <Card key={item.id} className={!item.is_published ? "opacity-60" : ""}>
              <div className="relative aspect-video">
                <img
                  src={item.image_url}
                  alt={item.nama}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                  {item.kategori}
                </span>
                {!item.is_published && (
                  <span className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded flex items-center gap-1">
                    <EyeOff className="h-3 w-3" /> Draft
                  </span>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{item.nama}</h3>
                {item.deskripsi && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {item.deskripsi}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => togglePublish(item)}
                  >
                    {item.is_published ? (
                      <><Eye className="h-4 w-4 mr-1" /> Published</>
                    ) : (
                      <><EyeOff className="h-4 w-4 mr-1" /> Draft</>
                    )}
                  </Button>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
