import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { ChevronRight, Shield, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import product1 from "@/assets/product_1.png";
import product2 from "@/assets/product_2.png";
import product3 from "@/assets/product_3.png";

const fallbackImages = [product1, product2, product3];

const assetMap: Record<string, string> = {
  "/assets/product_1.png": product1,
  "/assets/product_2.png": product2,
  "/assets/product_3.png": product3,
};

function resolveImage(src: string | null | undefined, fallback: string): string {
  if (!src) return fallback;
  if (src.startsWith("/uploads/") || src.startsWith("http")) return src;
  return assetMap[src] || fallback;
}

function resolveImages(images: string[]): string[] {
  return images.map((img, i) => resolveImage(img, fallbackImages[i % fallbackImages.length]));
}

function getProductPrice(product: any) {
  if (product.prices && product.prices.length > 0) {
    const gbp = product.prices.find((p: any) => p.currency === "GBP") || product.prices[0];
    return {
      price: parseFloat(gbp.discountPrice || gbp.price),
      oldPrice: gbp.discountPrice ? parseFloat(gbp.price) : null,
      currency: gbp.currency || "GBP",
    };
  }
  return { price: 0, oldPrice: null, currency: "GBP" };
}

function formatPrice(amount: number, currency: string = "GBP") {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount);
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, { value: string; priceModifier: number }>>({});
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  const { data: product, isLoading, error } = useQuery<any>({
    queryKey: ["/api/products", slug],
    queryFn: getQueryFn(`/api/products/${slug}`),
    enabled: !!slug,
  });

  const { data: relatedData } = useQuery<{ products: any[]; total: number }>({
    queryKey: ["/api/products", "related", product?.categoryId],
    queryFn: getQueryFn(`/api/products?limit=4&category=${product?.category?.slug || ""}`),
    enabled: !!product?.category?.slug,
  });

  useEffect(() => {
    if (!product?.attributes?.length) {
      setSelectedAttributes({});
      return;
    }
    const groups: Record<string, { value: string; priceModifier: number }> = {};
    for (const attr of product.attributes) {
      const name = attr.attributeName || `Attribute ${attr.attributeId}`;
      if (!groups[name]) {
        groups[name] = { value: attr.value, priceModifier: parseFloat(attr.priceModifier) || 0 };
      }
    }
    setSelectedAttributes(groups);
  }, [product?.id]);

  const images = product?.images?.length > 0 ? resolveImages(product.images) : fallbackImages;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const mainImage = selectedImage || images[0];

  if (isLoading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/60 text-lg">Product not found.</p>
        <Link href="/shop" className="text-primary underline">Back to shop</Link>
      </div>
    );
  }

  const pricing = getProductPrice(product);

  const attributes = product.attributes || [];
  const attributeGroups: Record<string, { attributeId: number; values: { value: string; priceModifier: number }[] }> = {};
  for (const attr of attributes) {
    const name = attr.attributeName || `Attribute ${attr.attributeId}`;
    if (!attributeGroups[name]) {
      attributeGroups[name] = { attributeId: attr.attributeId, values: [] };
    }
    attributeGroups[name].values.push({ value: attr.value, priceModifier: parseFloat(attr.priceModifier) || 0 });
  }

  const totalPriceModifier = Object.values(selectedAttributes).reduce((sum, attr) => sum + attr.priceModifier, 0);
  const displayPrice = pricing.price + totalPriceModifier;

  const handleAddToCart = () => {
    const attrs: Record<string, string> = {};
    for (const [name, sel] of Object.entries(selectedAttributes)) {
      attrs[name] = sel.value;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: displayPrice,
      image: images[0] || product1,
      quantity,
      attributes: Object.keys(attrs).length > 0 ? attrs : undefined,
      slug: product.slug,
    });
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const accordionSections = [
    { key: "how-it-works", title: "HOW IT WORKS?", content: product.howItWorks },
    { key: "description", title: "DESCRIPTION", content: product.description },
    { key: "shipping", title: "SHIPPING", content: product.shippingInfo },
    { key: "returns", title: "RETURN & EXCHANGES", content: product.returnExchanges },
    { key: "custom", title: "CUSTOM GRILLZ", content: product.customGrillz },
  ];

  const relatedProducts = relatedData?.products?.filter((p: any) => p.id !== product.id).slice(0, 4) || [];

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-2 mb-8" data-testid="breadcrumb-product">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-white transition-colors">All Grillz</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white">{product.name}</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          <div className="flex flex-col gap-4">
            <div className="w-full bg-zinc-900 aspect-square md:aspect-[4/3] lg:aspect-[16/10] max-h-[600px] overflow-hidden relative">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" data-testid="img-product-main" />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-zinc-900 overflow-hidden border ${mainImage === img ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'} transition-all`}
                    data-testid={`button-thumbnail-${idx}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col pt-2 lg:pt-0">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 uppercase tracking-wider" data-testid="text-product-name">{product.name}</h1>
            
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-2xl font-bold text-primary" data-testid="text-product-price">{formatPrice(displayPrice, pricing.currency)}</span>
              {pricing.oldPrice && <span className="text-white/50 line-through text-sm">{formatPrice(pricing.oldPrice + totalPriceModifier, pricing.currency)}</span>}
            </div>
            
            <p className="text-xs text-white/50 mb-6">Tax included.</p>
            <p className="text-xs text-green-500 mb-8 italic">Shipping calculated at checkout.</p>

            {Object.entries(attributeGroups).map(([name, group]) => {
              const selected = selectedAttributes[name] || { value: group.values[0]?.value, priceModifier: group.values[0]?.priceModifier || 0 };
              return (
                <div key={name} className="mb-8">
                  <div className="mb-3">
                    <span className="text-sm font-bold tracking-wider">{name}: <span className="font-normal text-white/80">{selected.value}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.values.map(({ value, priceModifier }) => (
                      <button 
                        key={value}
                        onClick={() => setSelectedAttributes(prev => ({ ...prev, [name]: { value, priceModifier } }))}
                        className={`px-4 py-2 border text-xs transition-colors ${selected.value === value ? 'border-white text-white font-bold bg-white/10' : 'border-white/20 text-white/70 hover:border-white/50'}`}
                        data-testid={`button-attribute-${value}`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="mb-6">
              <span className="text-sm font-bold tracking-wider block mb-3">Quantity</span>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-white/20 h-12 w-32">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-white/50 hover:text-white h-full" data-testid="button-qty-minus">-</button>
                  <input type="text" value={quantity} readOnly className="w-full bg-transparent text-center text-sm font-bold focus:outline-none" data-testid="input-quantity" />
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-white/50 hover:text-white h-full" data-testid="button-qty-plus">+</button>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-transparent border border-primary text-primary hover:bg-primary hover:text-white rounded-none h-12 uppercase tracking-widest text-xs font-bold transition-all"
                  data-testid="button-add-to-cart"
                >
                  ADD TO CART
                </Button>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-4">
              {accordionSections.map((section) => (
                <div key={section.key} className="border-b border-white/10">
                  <button 
                    onClick={() => toggleAccordion(section.key)}
                    className="w-full py-4 flex items-center justify-between group"
                    data-testid={`button-accordion-${section.key}`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">{section.title}</span>
                    {openAccordions[section.key] ? (
                      <ChevronUp className="w-4 h-4 text-white/50" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/50" />
                    )}
                  </button>
                  {openAccordions[section.key] && section.content && (
                    <div className="pb-4 text-sm text-white/70 leading-relaxed whitespace-pre-line" data-testid={`text-accordion-${section.key}`}>
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
        
        <div className="mt-24 mb-16 text-center text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          14 Day Money Back Guarantee. <a href="#" className="underline ml-2">Read more</a>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 pt-10 border-t border-white/10 mb-16">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-10 tracking-wide text-center">You Might Also Like</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
            {relatedProducts.map((rp: any, idx: number) => {
              const rpPricing = getProductPrice(rp);
              const rpImg = resolveImage(rp.images?.[0], fallbackImages[idx % fallbackImages.length]);
              return (
                <Link key={rp.id} href={`/product/${rp.slug}`} className="group block cursor-pointer" data-testid={`card-related-${rp.id}`}>
                    <div className="relative aspect-[4/5] bg-zinc-900 mb-4 overflow-hidden">
                      <img 
                        src={rpImg} 
                        alt={rp.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="text-center px-2">
                      <h3 className="text-[10px] md:text-xs font-heading font-bold mb-1 uppercase tracking-wider group-hover:text-primary transition-colors line-clamp-2 min-h-[30px]">
                        {rp.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-[10px] md:text-sm font-bold mt-1">
                        <span className="text-primary">{formatPrice(rpPricing.price, rpPricing.currency)}</span>
                        {rpPricing.oldPrice && <span className="text-white/60 line-through text-[10px] md:text-xs">{formatPrice(rpPricing.oldPrice, rpPricing.currency)}</span>}
                      </div>
                    </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/10 p-4 z-50 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-3 overflow-hidden">
          <img src={mainImage} className="w-10 h-10 object-cover rounded" />
          <div className="flex flex-col truncate">
            <span className="text-[10px] font-bold uppercase truncate">{product.name}</span>
            <span className="text-xs text-primary font-bold">{formatPrice(displayPrice, pricing.currency)}</span>
          </div>
        </div>
        <Button 
          onClick={handleAddToCart}
          className="bg-primary text-white h-10 text-xs rounded-none uppercase font-bold tracking-wider px-4 shrink-0"
          data-testid="button-add-mobile"
        >
          Add
        </Button>
      </div>
    </div>
  );
}