import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCMS() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", content: "", isActive: true, metaTitle: "", metaDescription: "", metaKeywords: "" });

  const { data: pages = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/cms-pages"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/cms-pages", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-pages"] });
      toast({ title: "Page created" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest("PATCH", `/api/admin/cms-pages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-pages"] });
      toast({ title: "Page updated" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/cms-pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms-pages"] });
      toast({ title: "Page deleted" });
    },
  });

  const closeDialog = () => { setDialogOpen(false); setEditing(null); setForm({ title: "", content: "", isActive: true, metaTitle: "", metaDescription: "", metaKeywords: "" }); };
  const openCreate = () => { setEditing(null); setForm({ title: "", content: "", isActive: true, metaTitle: "", metaDescription: "", metaKeywords: "" }); setDialogOpen(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ title: p.title, content: p.content || "", isActive: p.isActive, metaTitle: p.metaTitle || "", metaDescription: p.metaDescription || "", metaKeywords: p.metaKeywords || "" });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateMutation.mutate({ id: editing.id, data: form });
    else createMutation.mutate(form);
  };

  if (isLoading) return <div className="text-zinc-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading text-white" data-testid="text-cms-title">CMS Pages</h1>
        <Button onClick={openCreate} className="bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-add-cms-page">
          <Plus size={16} className="mr-2" /> Add Page
        </Button>
      </div>

      <div className="grid gap-4">
        {pages.map((page: any) => (
          <Card key={page.id} className="bg-zinc-900 border-zinc-800 rounded-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium" data-testid={`text-cms-page-title-${page.id}`}>{page.title}</p>
                <p className="text-xs text-zinc-500">/page/{page.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                {!page.isActive && <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5">Inactive</span>}
                <Button variant="ghost" size="sm" onClick={() => openEdit(page)} className="text-zinc-400 hover:text-white" data-testid={`button-edit-cms-page-${page.id}`}><Pencil size={16} /></Button>
                <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(page.id)} className="text-zinc-400 hover:text-red-500" data-testid={`button-delete-cms-page-${page.id}`}><Trash2 size={16} /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {pages.length === 0 && <p className="text-zinc-500">No CMS pages yet</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-none max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? "Edit Page" : "Add Page"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" required data-testid="input-cms-title" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Content (HTML)</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none min-h-[200px] font-mono text-sm" data-testid="input-cms-content" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} data-testid="switch-cms-active" />
              <Label className="text-zinc-400">Active</Label>
            </div>
            <div className="border-t border-zinc-800 pt-4">
              <Label className="text-zinc-400 text-sm mb-2 block">SEO</Label>
              <div className="space-y-2">
                <Input placeholder="Meta Title" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-cms-meta-title" />
                <Input placeholder="Meta Description" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" />
                <Input placeholder="Meta Keywords" value={form.metaKeywords} onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-save-cms-page">
              {editing ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
