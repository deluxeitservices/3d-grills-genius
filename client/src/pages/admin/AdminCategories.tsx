import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCategories() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: categories = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/categories"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({ title: "Category deleted" });
    },
  });

  if (isLoading) return <div className="text-zinc-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading text-white" data-testid="text-categories-title">Categories</h1>
        <Button onClick={() => navigate("/admin/categories/new")} className="bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-add-category">
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
                <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/categories/edit/${cat.id}`)} className="text-zinc-400 hover:text-white" data-testid={`button-edit-category-${cat.id}`}>
                  <Pencil size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { if (window.confirm(`Delete "${cat.name}"? This cannot be undone.`)) deleteMutation.mutate(cat.id); }} className="text-zinc-400 hover:text-red-500" data-testid={`button-delete-category-${cat.id}`}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && <p className="text-zinc-500">No categories yet</p>}
      </div>
    </div>
  );
}
