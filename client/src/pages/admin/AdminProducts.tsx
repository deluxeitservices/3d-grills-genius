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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emptyForm = {
  name: "", description: "", categoryId: null as number | null, images: [] as string[],
  quantity: 0, shippingCharges: "0", taxPercentage: "0",
  isActive: true, isFeatured: false,
  metaTitle: "", metaDescription: "", metaKeywords: "",
  prices: [{ countryCode: "GB", currency: "GBP", price: "", discountPrice: "" }] as any[],
};

export default function AdminProducts() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/products"],
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/categories"],
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({ title: "Product created" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest("PATCH", `/api/admin/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({ title: "Product updated" });
      closeDialog();
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      toast({ title: "Product deleted" });
    },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setForm({ ...emptyForm });
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setDialogOpen(true);
  };

  const openEdit = (product: any) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description || "",
      categoryId: product.categoryId,
      images: product.images || [],
      quantity: product.quantity || 0,
      shippingCharges: product.shippingCharges || "0",
      taxPercentage: product.taxPercentage || "0",
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      metaTitle: product.metaTitle || "",
      metaDescription: product.metaDescription || "",
      metaKeywords: product.metaKeywords || "",
      prices: product.prices?.length > 0
        ? product.prices.map((p: any) => ({ countryCode: p.countryCode, currency: p.currency, price: p.price, discountPrice: p.discountPrice || "" }))
        : [{ countryCode: "GB", currency: "GBP", price: "", discountPrice: "" }],
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      prices: form.prices.filter((p) => p.price),
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("files", f));
    const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
    const data = await res.json();
    if (data.urls) setForm((prev) => ({ ...prev, images: [...prev.images, ...data.urls] }));
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const updatePrice = (idx: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      prices: prev.prices.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    }));
  };

  const addPrice = () => {
    setForm((prev) => ({
      ...prev,
      prices: [...prev.prices, { countryCode: "US", currency: "USD", price: "", discountPrice: "" }],
    }));
  };

  const products = data?.products || [];
  const filtered = searchTerm
    ? products.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : products;

  if (isLoading) return <div className="text-zinc-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-heading text-white" data-testid="text-products-title">Products</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white pl-9 rounded-none w-48"
              data-testid="input-search-products"
            />
          </div>
          <Button onClick={openCreate} className="bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-add-product">
            <Plus size={16} className="mr-2" /> Add Product
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500">
              <th className="text-left py-3 px-3">Image</th>
              <th className="text-left py-3 px-3">Name</th>
              <th className="text-left py-3 px-3">Category</th>
              <th className="text-right py-3 px-3">Price</th>
              <th className="text-center py-3 px-3">Status</th>
              <th className="text-right py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product: any) => {
              const mainPrice = product.prices?.[0];
              const cat = categories.find((c: any) => c.id === product.categoryId);
              return (
                <tr key={product.id} className="border-b border-zinc-800/50 text-zinc-300 hover:bg-zinc-800/30">
                  <td className="py-2 px-3">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt="" className="w-10 h-10 object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs">No img</div>
                    )}
                  </td>
                  <td className="py-2 px-3" data-testid={`text-product-name-${product.id}`}>{product.name}</td>
                  <td className="py-2 px-3 text-zinc-500">{cat?.name || "—"}</td>
                  <td className="py-2 px-3 text-right">
                    {mainPrice ? `${mainPrice.currency} ${parseFloat(mainPrice.price).toFixed(2)}` : "—"}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-2 py-0.5 text-xs ${product.isActive ? "bg-green-900/30 text-green-400" : "bg-zinc-800 text-zinc-500"}`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                    {product.isFeatured && <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-900/30 text-yellow-400">Featured</span>}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(product)} className="text-zinc-400 hover:text-white" data-testid={`button-edit-product-${product.id}`}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(product.id)} className="text-zinc-400 hover:text-red-500" data-testid={`button-delete-product-${product.id}`}>
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-zinc-500 text-center py-8">No products found</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-none max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" required data-testid="input-product-name" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Category</Label>
                <Select value={form.categoryId?.toString() || ""} onValueChange={(v) => setForm({ ...form, categoryId: v ? parseInt(v) : null })}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="select-product-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                    {categories.map((c: any) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none min-h-[100px]" data-testid="input-product-description" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Images</Label>
              <Input type="file" accept="image/*" multiple onChange={handleImageUpload} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-product-images" />
              {form.images.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img} alt="" className="w-16 h-16 object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Quantity</Label>
                <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-product-quantity" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Shipping</Label>
                <Input value={form.shippingCharges} onChange={(e) => setForm({ ...form, shippingCharges: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-product-shipping" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Tax %</Label>
                <Input value={form.taxPercentage} onChange={(e) => setForm({ ...form, taxPercentage: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-product-tax" />
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-zinc-400">Prices</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addPrice} className="text-red-500 hover:text-red-400" data-testid="button-add-price">
                  + Add Price
                </Button>
              </div>
              {form.prices.map((price, i) => (
                <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                  <Input placeholder="Country" value={price.countryCode} onChange={(e) => updatePrice(i, "countryCode", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white rounded-none" />
                  <Input placeholder="Currency" value={price.currency} onChange={(e) => updatePrice(i, "currency", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white rounded-none" />
                  <Input placeholder="Price" value={price.price} onChange={(e) => updatePrice(i, "price", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid={`input-price-${i}`} />
                  <Input placeholder="Discount" value={price.discountPrice} onChange={(e) => updatePrice(i, "discountPrice", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white rounded-none" />
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} data-testid="switch-product-active" />
                <Label className="text-zinc-400">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} data-testid="switch-product-featured" />
                <Label className="text-zinc-400">Featured</Label>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <Label className="text-zinc-400 text-sm mb-2 block">SEO</Label>
              <div className="space-y-2">
                <Input placeholder="Meta Title" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-product-meta-title" />
                <Input placeholder="Meta Description" value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" />
                <Input placeholder="Meta Keywords" value={form.metaKeywords} onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" />
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-save-product">
              {editing ? "Update Product" : "Create Product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
