import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, History, GripVertical } from "lucide-react";

interface Sejarah {
  id: string;
  title: string;
  content: string;
  year: string | null;
  image_url: string | null;
  order_index: number;
}

export default function SejarahAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Sejarah | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    year: "",
    image_url: "",
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['sejarah'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sejarah')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as Sejarah[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Sejarah, 'id' | 'order_index'>) => {
      const { error } = await supabase.from('sejarah').insert({
        ...data,
        order_index: items?.length || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sejarah'] });
      toast({ title: "Berhasil", description: "Data sejarah berhasil ditambahkan" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menambahkan data", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Sejarah> }) => {
      const { error } = await supabase.from('sejarah').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sejarah'] });
      toast({ title: "Berhasil", description: "Data sejarah berhasil diperbarui" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal memperbarui data", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sejarah').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sejarah'] });
      toast({ title: "Berhasil", description: "Data sejarah berhasil dihapus" });
    },
    onError: () => {
      toast({ title: "Error", description: "Gagal menghapus data", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({ title: "", content: "", year: "", image_url: "" });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: Sejarah) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      year: item.year || "",
      image_url: item.image_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast({ title: "Error", description: "Judul dan konten wajib diisi", variant: "destructive" });
      return;
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
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
          <h1 className="text-2xl font-bold text-foreground">Sejarah Sekolah</h1>
          <p className="text-muted-foreground">Kelola konten sejarah sekolah</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Sejarah
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Sejarah" : "Tambah Sejarah"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Judul *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Judul sejarah"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tahun</label>
                  <Input
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="1985"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Konten *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Cerita sejarah..."
                  rows={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Gambar</label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  folder="sejarah"
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
                  {editingItem ? "Simpan Perubahan" : "Tambah"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {items?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <History className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Belum ada data sejarah</p>
            </CardContent>
          </Card>
        ) : (
          items?.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-start gap-4 p-4">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    {item.year && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {item.year}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {item.content}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(item.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
