import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Search, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resolveAdminImage } from "@/lib/resolveImage";

export default function AdminProducts() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/products"],
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/categories"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted" });
    },
  });

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
          <Button onClick={() => navigate("/admin/products/new")} className="bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-add-product">
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
              const imgSrc = product.images?.[0] ? resolveAdminImage(product.images[0]) : null;
              return (
                <tr key={product.id} className="border-b border-zinc-800/50 text-zinc-300 hover:bg-zinc-800/30">
                  <td className="py-2 px-3">
                    {imgSrc ? (
                      <img src={imgSrc} alt="" className="w-12 h-12 object-cover bg-zinc-800" />
                    ) : (
                      <div className="w-12 h-12 bg-zinc-800 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-zinc-600" />
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-3" data-testid={`text-product-name-${product.id}`}>
                    <span className="font-medium text-white">{product.name}</span>
                    <span className="block text-xs text-zinc-500 mt-0.5">{product.images?.length || 0} images</span>
                  </td>
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
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/products/edit/${product.id}`)} className="text-zinc-400 hover:text-white" data-testid={`button-edit-product-${product.id}`}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) deleteMutation.mutate(product.id); }} className="text-zinc-400 hover:text-red-500" data-testid={`button-delete-product-${product.id}`}>
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
    </div>
  );
}
