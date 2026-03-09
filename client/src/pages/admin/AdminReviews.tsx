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
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminReviews() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ author: "", text: "", rating: 5, isActive: true });

  const { data: reviews = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/reviews"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/reviews", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({ title: "Review created" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest("PATCH", `/api/admin/reviews/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({ title: "Review updated" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reviews"] });
      toast({ title: "Review deleted" });
    },
  });

  const closeDialog = () => { setDialogOpen(false); setEditing(null); setForm({ author: "", text: "", rating: 5, isActive: true }); };
  const openCreate = () => { setEditing(null); setForm({ author: "", text: "", rating: 5, isActive: true }); setDialogOpen(true); };
  const openEdit = (r: any) => { setEditing(r); setForm({ author: r.author, text: r.text, rating: r.rating, isActive: r.isActive }); setDialogOpen(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateMutation.mutate({ id: editing.id, data: form });
    else createMutation.mutate(form);
  };

  if (isLoading) return <div className="text-zinc-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading text-white" data-testid="text-reviews-title">Reviews</h1>
        <Button onClick={openCreate} className="bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-add-review">
          <Plus size={16} className="mr-2" /> Add Review
        </Button>
      </div>

      <div className="grid gap-4">
        {reviews.map((review: any) => (
          <Card key={review.id} className="bg-zinc-900 border-zinc-800 rounded-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-medium" data-testid={`text-review-author-${review.id}`}>{review.author}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"} />
                    ))}
                  </div>
                  {!review.isActive && <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5">Inactive</span>}
                </div>
                <p className="text-zinc-400 text-sm line-clamp-2">{review.text}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button variant="ghost" size="sm" onClick={() => openEdit(review)} className="text-zinc-400 hover:text-white" data-testid={`button-edit-review-${review.id}`}><Pencil size={16} /></Button>
                <Button variant="ghost" size="sm" onClick={() => { if (window.confirm(`Delete review by "${review.author}"?`)) deleteMutation.mutate(review.id); }} className="text-zinc-400 hover:text-red-500" data-testid={`button-delete-review-${review.id}`}><Trash2 size={16} /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {reviews.length === 0 && <p className="text-zinc-500">No reviews yet</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-none max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? "Edit Review" : "Add Review"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Author</Label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" required data-testid="input-review-author" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Review Text</Label>
              <Textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none min-h-[100px]" required data-testid="input-review-text" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Rating (1-5)</Label>
              <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-review-rating" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} data-testid="switch-review-active" />
              <Label className="text-zinc-400">Active</Label>
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-save-review">
              {editing ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
