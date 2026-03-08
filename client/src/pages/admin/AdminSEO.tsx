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
import { Plus, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSEO() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ pagePath: "", metaTitle: "", metaDescription: "", metaKeywords: "", seoContent: "" });

  const { data: settings = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/seo-settings"],
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/seo-settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo-settings"] });
      toast({ title: "SEO settings saved" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const closeDialog = () => { setDialogOpen(false); setEditing(null); setForm({ pagePath: "", metaTitle: "", metaDescription: "", metaKeywords: "", seoContent: "" }); };
  const openCreate = () => { setEditing(null); setForm({ pagePath: "", metaTitle: "", metaDescription: "", metaKeywords: "", seoContent: "" }); setDialogOpen(true); };
  const openEdit = (s: any) => {
    setEditing(s);
    setForm({ pagePath: s.pagePath, metaTitle: s.metaTitle || "", metaDescription: s.metaDescription || "", metaKeywords: s.metaKeywords || "", seoContent: s.seoContent || "" });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  if (isLoading) return <div className="text-zinc-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading text-white" data-testid="text-seo-title">SEO Settings</h1>
        <Button onClick={openCreate} className="bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-add-seo">
          <Plus size={16} className="mr-2" /> Add Page SEO
        </Button>
      </div>

      <div className="grid gap-4">
        {settings.map((setting: any) => (
          <Card key={setting.id} className="bg-zinc-900 border-zinc-800 rounded-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium font-mono text-sm" data-testid={`text-seo-path-${setting.id}`}>{setting.pagePath}</p>
                <p className="text-xs text-zinc-500 mt-1">{setting.metaTitle || "No title set"}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => openEdit(setting)} className="text-zinc-400 hover:text-white" data-testid={`button-edit-seo-${setting.id}`}>
                <Pencil size={16} />
              </Button>
            </CardContent>
          </Card>
        ))}
        {settings.length === 0 && <p className="text-zinc-500">No SEO settings configured</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-none max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? "Edit SEO" : "Add SEO Settings"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Page Path</Label>
              <Input value={form.pagePath} onChange={(e) => setForm({ ...form, pagePath: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" required placeholder="e.g., / or /shop" data-testid="input-seo-page-path" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Meta Title</Label>
              <Input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-seo-meta-title" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Meta Description</Label>
              <Textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-seo-meta-description" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Meta Keywords</Label>
              <Input value={form.metaKeywords} onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-seo-meta-keywords" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">SEO Content</Label>
              <Textarea value={form.seoContent} onChange={(e) => setForm({ ...form, seoContent: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none min-h-[100px]" data-testid="input-seo-content" />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-save-seo">
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
