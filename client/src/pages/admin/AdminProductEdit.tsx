import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Loader2, X, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { resolveAdminImage } from "@/lib/resolveImage";

const emptyForm = {
  name: "", description: "", categoryId: null as number | null, images: [] as string[],
  quantity: 0, shippingCharges: "0", taxPercentage: "0",
  isActive: true, isFeatured: false,
  metaTitle: "", metaDescription: "", metaKeywords: "",
  howItWorks: "", shippingInfo: "", returnExchanges: "", customGrillz: "",
  prices: [{ countryCode: "GB", currency: "GBP", price: "", discountPrice: "" }] as any[],
  attributeValues: [] as { attributeId: number; value: string; priceModifier: string }[],
};

export default function AdminProductEdit() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [matchEdit, paramsEdit] = useRoute("/admin/products/edit/:id");
  const isEditing = matchEdit && paramsEdit?.id;
  const productId = isEditing ? parseInt(paramsEdit.id) : null;

  const [form, setForm] = useState({ ...emptyForm });
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/products"],
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/categories"],
  });

  const { data: productAttributes = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/product-attributes"],
  });

  const [selectedAttributeId, setSelectedAttributeId] = useState<number | null>(null);

  useEffect(() => {
    if (productAttributes.length > 0 && !selectedAttributeId) {
      setSelectedAttributeId(productAttributes[0].id);
    }
  }, [productAttributes]);

  useEffect(() => {
    if (isEditing && data?.products) {
      const product = data.products.find((p: any) => p.id === productId);
      if (product) {
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
          howItWorks: product.howItWorks || "",
          shippingInfo: product.shippingInfo || "",
          returnExchanges: product.returnExchanges || "",
          customGrillz: product.customGrillz || "",
          prices: product.prices?.length > 0
            ? product.prices.map((p: any) => ({ countryCode: p.countryCode, currency: p.currency, price: p.price, discountPrice: p.discountPrice || "" }))
            : [{ countryCode: "GB", currency: "GBP", price: "", discountPrice: "" }],
          attributeValues: product.attributes?.map((a: any) => ({
            attributeId: a.attributeId,
            value: a.value,
            priceModifier: a.priceModifier || "0",
          })) || [],
        });
        if (product.attributes?.length > 0) {
          setSelectedAttributeId(product.attributes[0].attributeId);
        }
      }
    }
  }, [isEditing, data, productId]);

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product created" });
      navigate("/admin/products");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest("PATCH", `/api/admin/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product updated" });
      navigate("/admin/products");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0) {
      toast({ title: "Please upload at least one product image", variant: "destructive" });
      return;
    }
    const payload = {
      ...form,
      prices: form.prices.filter((p) => p.price),
      attributeValues: form.attributeValues.filter((av) => av.value.trim()),
    };
    if (isEditing && productId) {
      updateMutation.mutate({ id: productId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        setForm((prev) => ({ ...prev, images: [...prev.images, ...data.urls] }));
        toast({ title: `${data.urls.length} image(s) uploaded` });
      } else {
        toast({ title: "Upload failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const moveImage = (idx: number, direction: number) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= newImages.length) return prev;
      [newImages[idx], newImages[newIdx]] = [newImages[newIdx], newImages[idx]];
      return { ...prev, images: newImages };
    });
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

  const removePrice = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      prices: prev.prices.filter((_, i) => i !== idx),
    }));
  };

  const handleCreateAttribute = async () => {
    try {
      const res = await apiRequest("POST", "/api/admin/product-attributes", { name: "Metal & Stone Type", values: [] });
      const attr = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/product-attributes"] });
      setSelectedAttributeId(attr.id);
      toast({ title: "Metal & Stone Type attribute created" });
    } catch (err: any) {
      toast({ title: "Error creating attribute", description: err.message, variant: "destructive" });
    }
  };

  const defaultVariants = [
    { value: "Silver & Real Diamond", priceModifier: "0" },
    { value: "Silver & Cz", priceModifier: "-20" },
    { value: "Dental Yellow Gold & Cz", priceModifier: "50" },
    { value: "Dental Yellow Gold & Real Diamonds", priceModifier: "100" },
    { value: "Dental White Gold & Cz", priceModifier: "50" },
    { value: "Dental White Gold & Real Diamonds", priceModifier: "100" },
    { value: "14k Yellow Gold & Cz", priceModifier: "150" },
    { value: "14k Yellow Gold & Real Diamonds", priceModifier: "200" },
    { value: "14k Rose Gold & Cz", priceModifier: "150" },
    { value: "14k Rose Gold & Real Diamonds", priceModifier: "200" },
  ];

  const loadDefaultVariants = () => {
    if (!selectedAttributeId) return;
    const otherValues = form.attributeValues.filter(av => av.attributeId !== selectedAttributeId);
    const newValues = defaultVariants.map(v => ({ attributeId: selectedAttributeId, ...v }));
    setForm((prev) => ({ ...prev, attributeValues: [...otherValues, ...newValues] }));
    toast({ title: "Default variants loaded" });
  };

  const addVariantRow = () => {
    if (!selectedAttributeId) return;
    setForm((prev) => ({
      ...prev,
      attributeValues: [...prev.attributeValues, { attributeId: selectedAttributeId, value: "", priceModifier: "0" }],
    }));
  };

  const updateVariant = (idx: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      attributeValues: prev.attributeValues.map((av, i) => (i === idx ? { ...av, [field]: value } : av)),
    }));
  };

  const removeVariant = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      attributeValues: prev.attributeValues.filter((_, i) => i !== idx),
    }));
  };

  if (isLoading) return <div className="text-zinc-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/products")} className="text-zinc-400 hover:text-white" data-testid="button-back-products">
            <ArrowLeft size={18} className="mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-heading text-white" data-testid="text-product-edit-title">
            {isEditing ? "Edit Product" : "New Product"}
          </h1>
        </div>
        <Button onClick={handleSubmit} disabled={uploading || createMutation.isPending || updateMutation.isPending} className="bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-save-product">
          {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
          {isEditing ? "Update Product" : "Create Product"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Basic Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Product Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Gold Single Cap" className="bg-zinc-800 border-zinc-700 text-white rounded-none" required data-testid="input-product-name" />
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
                <div className="space-y-2">
                  <Label className="text-zinc-400">Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description..." className="bg-zinc-800 border-zinc-700 text-white rounded-none min-h-[120px]" data-testid="input-product-description" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Images</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full h-32 bg-zinc-800 border-2 border-dashed border-zinc-600 cursor-pointer hover:border-red-500 transition-colors">
                  {uploading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
                      <span className="text-zinc-400 text-sm">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                      <span className="text-zinc-400 text-sm">Click to upload product images</span>
                      <span className="text-zinc-600 text-xs mt-1">PNG, JPG up to 5MB • Multiple files supported</span>
                    </>
                  )}
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" data-testid="input-product-images" />
                </label>

                {form.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group bg-zinc-800 aspect-square">
                        <img src={resolveAdminImage(img)} alt={`Product image ${i + 1}`} className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute top-1 left-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 font-bold uppercase">Main</span>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          {i > 0 && (
                            <button type="button" onClick={() => moveImage(i, -1)} className="w-7 h-7 bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-white text-xs" title="Move left">
                              ←
                            </button>
                          )}
                          <button type="button" onClick={() => removeImage(i)} className="w-7 h-7 bg-red-600 hover:bg-red-700 flex items-center justify-center text-white" title="Remove" data-testid={`button-remove-image-${i}`}>
                            <X size={14} />
                          </button>
                          {i < form.images.length - 1 && (
                            <button type="button" onClick={() => moveImage(i, 1)} className="w-7 h-7 bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center text-white text-xs" title="Move right">
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Quantity</Label>
                    <Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-product-quantity" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Shipping (£)</Label>
                    <Input value={form.shippingCharges} onChange={(e) => setForm({ ...form, shippingCharges: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-product-shipping" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Tax %</Label>
                    <Input value={form.taxPercentage} onChange={(e) => setForm({ ...form, taxPercentage: e.target.value })} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-product-tax" />
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-zinc-400 font-medium">Pricing by Country</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={addPrice} className="text-red-500 hover:text-red-400 text-xs" data-testid="button-add-price">
                      + Add Price
                    </Button>
                  </div>
                  {form.prices.map((price, i) => (
                    <div key={i} className="grid grid-cols-[80px_80px_1fr_1fr_32px] gap-2 mb-2 items-center">
                      <Input placeholder="GB" value={price.countryCode} onChange={(e) => updatePrice(i, "countryCode", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white rounded-none text-xs" />
                      <Input placeholder="GBP" value={price.currency} onChange={(e) => updatePrice(i, "currency", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white rounded-none text-xs" />
                      <Input placeholder="Price" value={price.price} onChange={(e) => updatePrice(i, "price", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid={`input-price-${i}`} />
                      <Input placeholder="Sale price (optional)" value={price.discountPrice} onChange={(e) => updatePrice(i, "discountPrice", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white rounded-none" />
                      {form.prices.length > 1 && (
                        <button type="button" onClick={() => removePrice(i)} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-red-500">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} data-testid="switch-product-active" />
                    <Label className="text-zinc-400">Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} data-testid="switch-product-featured" />
                    <Label className="text-zinc-400">Featured</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Metal & Stone Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {productAttributes.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-zinc-400 text-sm mb-3">No attribute types exist yet.</p>
                    <Button type="button" variant="outline" onClick={handleCreateAttribute} className="border-zinc-700 text-zinc-300 hover:text-white hover:border-red-500" data-testid="button-create-attribute">
                      <Plus size={14} className="mr-2" /> Create Metal Type Attribute
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Select Attribute Type</Label>
                      <Select value={selectedAttributeId?.toString() || ""} onValueChange={(v) => setSelectedAttributeId(parseInt(v))}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="select-attribute-type">
                          <SelectValue placeholder="Select attribute type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                          {productAttributes.map((attr: any) => (
                            <SelectItem key={attr.id} value={attr.id.toString()}>{attr.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedAttributeId && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <Label className="text-zinc-400 font-medium">Variant Values</Label>
                          <div className="flex gap-2">
                            {form.attributeValues.filter(av => av.attributeId === selectedAttributeId).length === 0 && (
                              <Button type="button" variant="outline" size="sm" onClick={loadDefaultVariants} className="border-zinc-700 text-zinc-300 hover:text-white hover:border-red-500 text-xs" data-testid="button-load-defaults">
                                Load Default Variants
                              </Button>
                            )}
                            <Button type="button" variant="ghost" size="sm" onClick={addVariantRow} className="text-red-500 hover:text-red-400 text-xs" data-testid="button-add-variant">
                              <Plus size={14} className="mr-1" /> Add Variant
                            </Button>
                          </div>
                        </div>

                        {form.attributeValues.filter(av => av.attributeId === selectedAttributeId).length === 0 ? (
                          <p className="text-zinc-500 text-sm text-center py-3">No variants added yet. Click "Load Default Variants" or "Add Variant" to begin.</p>
                        ) : (
                          <div className="space-y-2">
                            <div className="grid grid-cols-[1fr_120px_40px] gap-2 text-xs text-zinc-500 px-1">
                              <span>Value Name</span>
                              <span>Price Modifier (£)</span>
                              <span></span>
                            </div>
                            {form.attributeValues.map((av, i) => {
                              if (av.attributeId !== selectedAttributeId) return null;
                              return (
                                <div key={i} className="grid grid-cols-[1fr_120px_40px] gap-2 items-center">
                                  <Input
                                    placeholder="e.g. Silver & Real Diamond"
                                    value={av.value}
                                    onChange={(e) => updateVariant(i, "value", e.target.value)}
                                    className="bg-zinc-800 border-zinc-700 text-white rounded-none"
                                    data-testid={`input-variant-value-${i}`}
                                  />
                                  <div className="relative">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">£</span>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={av.priceModifier}
                                      onChange={(e) => updateVariant(i, "priceModifier", e.target.value)}
                                      className="bg-zinc-800 border-zinc-700 text-white rounded-none pl-6"
                                      data-testid={`input-variant-price-${i}`}
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeVariant(i)}
                                    className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-red-500"
                                    data-testid={`button-remove-variant-${i}`}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Product Info Tabs</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="howItWorks" className="w-full">
                  <TabsList className="bg-zinc-800 border-zinc-700 w-full justify-start">
                    <TabsTrigger value="howItWorks" className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-700">How It Works</TabsTrigger>
                    <TabsTrigger value="shipping" className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-700">Shipping</TabsTrigger>
                    <TabsTrigger value="returns" className="text-zinc-400 data-[state=active]:text-white data-[state=active]:bg-zinc-700">Returns</TabsTrigger>
                  </TabsList>
                  <TabsContent value="howItWorks" className="mt-4">
                    <Textarea value={form.howItWorks} onChange={(e) => setForm({ ...form, howItWorks: e.target.value })} placeholder="Steps for ordering custom grillz..." className="bg-zinc-800 border-zinc-700 text-white rounded-none min-h-[120px]" />
                  </TabsContent>
                  <TabsContent value="shipping" className="mt-4">
                    <Textarea value={form.shippingInfo} onChange={(e) => setForm({ ...form, shippingInfo: e.target.value })} placeholder="Shipping details..." className="bg-zinc-800 border-zinc-700 text-white rounded-none min-h-[120px]" />
                  </TabsContent>
                  <TabsContent value="returns" className="mt-4">
                    <Textarea value={form.returnExchanges} onChange={(e) => setForm({ ...form, returnExchanges: e.target.value })} placeholder="Return policy..." className="bg-zinc-800 border-zinc-700 text-white rounded-none min-h-[120px]" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-sm">Meta Title</Label>
                  <Input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder="Meta Title" className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-product-meta-title" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-sm">Meta Description</Label>
                  <Textarea value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="Meta Description" className="bg-zinc-800 border-zinc-700 text-white rounded-none min-h-[80px]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400 text-sm">Meta Keywords</Label>
                  <Input value={form.metaKeywords} onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })} placeholder="Meta Keywords" className="bg-zinc-800 border-zinc-700 text-white rounded-none" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
