import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminBanners() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", image: "", link: "", page: "home", sortOrder: 0, isActive: true });

  const { data: banners = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/banners"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/banners", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({ title: "Banner created" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest("PATCH", `/api/admin/banners/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({ title: "Banner updated" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({ title: "Banner deleted" });
    },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setForm({ title: "", subtitle: "", image: "", link: "", page: "home", sortOrder: 0, isActive: true });
  };

  const openCreate = () => { setEditing(null); setForm({ title: "", subtitle: "", image: "", link: "", page: "home", sortOrder: 0, isActive: true }); setDialogOpen(true); };

  const openEdit = (b: any) => {
    setEditing(b);
    setForm({ title: b.title || "", subtitle: b.subtitle || "", image: b.image, link: b.link || "", page: b.page, sortOrder: b.sortOrder, isActive: b.isActive });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateMutation.mutate({ id: editing.id, data: form });
    else createMutation.mutate(form);
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
        <h1 className="text-2xl font-heading text-white" data-testid="text-banners-title">Banners</h1>
        <Button onClick={openCreate} className="bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-add-banner">
          <Plus size={16} className="mr-2" /> Add Banner
        </Button>
      </div>

      <div className="grid gap-4">
        {banners.map((banner: any) => (
          <Card key={banner.id} className="bg-zinc-900 border-zinc-800 rounded-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={banner.image} alt={banner.title || "Banner"} className="w-24 h-14 object-cover rounded-none" />
                <div>
                  <p className="text-white font-medium" data-testid={`text-banner-title-${banner.id}`}>{banner.title || "Untitled"}</p>
                  <p className="text-xs text-zinc-500">Page: {banner.page} • Order: {banner.sortOrder}</p>
                </div>
                {!banner.isActive && <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5">Inactive</span>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEdit(banner)} className="text-zinc-400 hover:text-white" data-testid={`button-edit-banner-${banner.id}`}><Pencil size={16} /></Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(banner.id)} className="text-zinc-400 hover:text-red-500" data-testid={`button-delete-banner-${banner.id}`}><Trash2 size={16} /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {banners.length === 0 && <p className="text-zinc-500">No banners yet</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-none max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? "Edit Banner" : "Add Banner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-banner-title" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Subtitle</Label>
              <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-banner-subtitle" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-banner-image" />
              {form.image && <img src={form.image} alt="Preview" className="h-20 object-cover mt-2" />}
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Link</Label>
              <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-banner-link" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Page</Label>
                <Input value={form.page} onChange={(e) => setForm({ ...form, page: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-banner-page" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Sort Order</Label>
                <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-banner-sort" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} data-testid="switch-banner-active" />
              <Label className="text-zinc-400">Active</Label>
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-save-banner">
              {editing ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
