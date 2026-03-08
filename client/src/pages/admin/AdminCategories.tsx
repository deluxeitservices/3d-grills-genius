import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCategories() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", image: "", sortOrder: 0, isActive: true });

  const { data: categories = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/categories"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category created" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest("PATCH", `/api/admin/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category updated" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category deleted" });
    },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setForm({ name: "", description: "", image: "", sortOrder: 0, isActive: true });
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", image: "", sortOrder: 0, isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (cat: any) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "", image: cat.image || "", sortOrder: cat.sortOrder, isActive: cat.isActive });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("files", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
    const data = await res.json();
    if (data.urls?.[0]) setForm({ ...form, image: data.urls[0] });
  };

  if (isLoading) return <div className="text-zinc-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading text-white" data-testid="text-categories-title">Categories</h1>
        <Button onClick={openCreate} className="bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-add-category">
          <Plus size={16} className="mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid gap-4">
        {categories.map((cat: any) => (
          <Card key={cat.id} className="bg-zinc-900 border-zinc-800 rounded-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {cat.image && <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded-none" />}
                <div>
                  <p className="text-white font-medium" data-testid={`text-category-name-${cat.id}`}>{cat.name}</p>
                  <p className="text-xs text-zinc-500">/{cat.slug} • Order: {cat.sortOrder}</p>
                </div>
                {!cat.isActive && <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5">Inactive</span>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEdit(cat)} className="text-zinc-400 hover:text-white" data-testid={`button-edit-category-${cat.id}`}>
                  <Pencil size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(cat.id)} className="text-zinc-400 hover:text-red-500" data-testid={`button-delete-category-${cat.id}`}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && <p className="text-zinc-500">No categories yet</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-none max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" required data-testid="input-category-name" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-category-description" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-category-image" />
              {form.image && <img src={form.image} alt="Preview" className="h-20 object-cover mt-2" />}
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Sort Order</Label>
              <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-category-sort" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} data-testid="switch-category-active" />
              <Label className="text-zinc-400">Active</Label>
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-save-category">
              {editing ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
