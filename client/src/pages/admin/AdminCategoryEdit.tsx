import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { resolveAdminImage } from "@/lib/resolveImage";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCategoryEdit() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [, editParams] = useRoute("/admin/categories/edit/:id");
  const isEditing = !!editParams?.id;
  const categoryId = editParams?.id ? parseInt(editParams.id) : null;

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    sortOrder: 0,
    isActive: true,
  });

  const { data: categories = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/categories"],
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && categories.length > 0 && categoryId) {
      const cat = categories.find((c: any) => c.id === categoryId);
      if (cat) {
        setForm({
          name: cat.name || "",
          description: cat.description || "",
          image: cat.image || "",
          sortOrder: cat.sortOrder || 0,
          isActive: cat.isActive,
        });
      }
    }
  }, [isEditing, categories, categoryId]);

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/categories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category created" });
      navigate("/admin/categories");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PATCH", `/api/admin/categories/${categoryId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category updated" });
      navigate("/admin/categories");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate(form);
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

  if (isEditing && isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/categories")} className="text-zinc-400 hover:text-white" data-testid="button-back-categories">
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-heading text-white" data-testid="text-category-edit-title">
            {isEditing ? "Edit Category" : "New Category"}
          </h1>
        </div>
        <Button onClick={handleSubmit} disabled={isSaving} className="bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-save-category">
          {isSaving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
          {isEditing ? "Update" : "Create"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800 rounded-none">
          <CardHeader>
            <CardTitle className="text-white text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" required data-testid="input-category-name" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" rows={4} data-testid="input-category-description" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Sort Order</Label>
              <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-category-sort" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} data-testid="switch-category-active" />
              <Label className="text-zinc-400">Active</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 rounded-none">
          <CardHeader>
            <CardTitle className="text-white text-lg">Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Upload Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-category-image" />
            </div>
            {form.image && (
              <div className="space-y-2">
                <Label className="text-zinc-400">Preview</Label>
                <img src={resolveAdminImage(form.image) || form.image} alt="Category preview" className="w-full max-w-xs h-48 object-cover border border-zinc-700" />
                <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, image: "" })} className="text-red-500 hover:text-red-400" data-testid="button-remove-category-image">
                  Remove Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
