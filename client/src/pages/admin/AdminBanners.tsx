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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Upload, Loader2, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PAGE_OPTIONS = [
  { value: "home", label: "Home Hero" },
  { value: "mid", label: "Home Mid Section" },
  { value: "shop", label: "Shop Page" },
];

export default function AdminBanners() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", image: "", link: "", page: "home", sortOrder: 0, isActive: true });

  const { data: banners = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/banners"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/banners", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({ title: "Banner created" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest("PATCH", `/api/admin/banners/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
      toast({ title: "Banner updated" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
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
    if (!form.image) {
      toast({ title: "Please upload an image", variant: "destructive" });
      return;
    }
    if (editing) updateMutation.mutate({ id: editing.id, data: form });
    else createMutation.mutate(form);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (data.urls?.[0]) {
        setForm((prev) => ({ ...prev, image: data.urls[0] }));
        toast({ title: "Image uploaded" });
      } else {
        toast({ title: "Upload failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
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
                {banner.image ? (
                  <img src={banner.image} alt={banner.title || "Banner"} className="w-32 h-20 object-cover rounded-none bg-zinc-800" />
                ) : (
                  <div className="w-32 h-20 bg-zinc-800 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-zinc-600" />
                  </div>
                )}
                <div>
                  <p className="text-white font-medium" data-testid={`text-banner-title-${banner.id}`}>{banner.title || "Untitled"}</p>
                  <p className="text-sm text-zinc-400">{banner.subtitle}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Page: <span className="text-zinc-300">{PAGE_OPTIONS.find(p => p.value === banner.page)?.label || banner.page}</span> • Order: {banner.sortOrder}
                  </p>
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
        {banners.length === 0 && <p className="text-zinc-500">No banners yet. Click "Add Banner" to create one.</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-none max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? "Edit Banner" : "Add Banner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Banner Image *</Label>
              <div className="relative">
                {form.image ? (
                  <div className="relative group">
                    <img src={form.image} alt="Preview" className="w-full h-40 object-cover rounded-none bg-zinc-800" />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <Upload size={16} /> Change Image
                      </div>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" data-testid="input-banner-image-change" />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 bg-zinc-800 border-2 border-dashed border-zinc-600 cursor-pointer hover:border-red-500 transition-colors">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                        <span className="text-zinc-400 text-sm">Click to upload banner image</span>
                        <span className="text-zinc-600 text-xs mt-1">Recommended: 1920×800px</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" data-testid="input-banner-image" />
                  </label>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. LUXURY CUSTOM GRILLZ" className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-banner-title" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Subtitle / Button Text</Label>
              <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="e.g. Shop Grillz Now" className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-banner-subtitle" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Link</Label>
              <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="e.g. /shop" className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-banner-link" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Page Position</Label>
                <Select value={form.page} onValueChange={(v) => setForm({ ...form, page: v })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="select-banner-page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white rounded-none">
                    {PAGE_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            <Button type="submit" disabled={uploading || createMutation.isPending || updateMutation.isPending} className="w-full bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-save-banner">
              {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editing ? "Update Banner" : "Create Banner"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
