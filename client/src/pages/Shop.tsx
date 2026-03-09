import { useState, useEffect } from "react";
import { Link, useSearch, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/api";
import { ChevronDown, ChevronRight, X, ChevronUp, Loader2 } from "lucide-react";
import product1 from "@/assets/product_1.png";
import product2 from "@/assets/product_2.png";
import product3 from "@/assets/product_3.png";
import catGrillz from "@/assets/cat-grillz.png";

const fallbackImages = [product1, product2, product3, catGrillz];

const assetMap: Record<string, string> = {
  "/assets/product_1.png": product1,
  "/assets/product_2.png": product2,
  "/assets/product_3.png": product3,
  "/assets/cat-grillz.png": catGrillz,
};

function resolveImage(src: string | null | undefined, fallback: string): string {
  if (!src) return fallback;
  if (src.startsWith("/uploads/") || src.startsWith("http")) return src;
  return assetMap[src] || fallback;
}

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Best selling", value: "bestselling" },
  { label: "Alphabetically, A-Z", value: "alpha-asc" },
  { label: "Alphabetically, Z-A", value: "alpha-desc" },
  { label: "Price, low to high", value: "price-asc" },
  { label: "Price, high to low", value: "price-desc" },
  { label: "Date, old to new", value: "date-asc" },
  { label: "Date, new to old", value: "date-desc" },
];

function getProductPrice(product: any) {
  const taxRate = parseFloat(product.taxPercentage) || 0;
  const shipping = parseFloat(product.shippingCharges) || 0;
  if (product.prices && product.prices.length > 0) {
    const gbp = product.prices.find((p: any) => p.currency === "GBP") || product.prices[0];
    const basePrice = parseFloat(gbp.discountPrice || gbp.price);
    const originalPrice = parseFloat(gbp.price);
    const total = Math.round((basePrice + shipping) * (1 + taxRate / 100) * 100) / 100;
    const originalTotal = gbp.discountPrice ? Math.round((originalPrice + shipping) * (1 + taxRate / 100) * 100) / 100 : null;
    return {
      price: total,
      oldPrice: originalTotal,
      currency: gbp.currency || "GBP",
    };
  }
  return { price: 0, oldPrice: null, currency: "GBP" };
}

function formatPrice(amount: number, currency: string = "GBP") {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount);
}

const ITEMS_PER_PAGE = 12;

export default function Shop() {
  const routeParams = useParams<{ category?: string }>();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const categorySlug = routeParams.category || params.get("category") || "";
  const searchQuery = params.get("search") || "";

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("featured");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug, searchQuery]);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const apiUrl = `/api/products?limit=${ITEMS_PER_PAGE}&offset=${offset}${categorySlug ? `&category=${categorySlug}` : ""}${searchQuery ? `&search=${searchQuery}` : ""}`;

  const { data, isLoading } = useQuery<{ products: any[]; total: number }>({
    queryKey: ["/api/products", categorySlug, searchQuery, currentPage],
    queryFn: getQueryFn(apiUrl),
  });

  const { data: categoriesData } = useQuery<any[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn("/api/categories"),
  });

  const products = data?.products || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const sortedProducts = [...products].sort((a, b) => {
    const pa = getProductPrice(a);
    const pb = getProductPrice(b);
    switch (sortBy) {
      case "alpha-asc": return a.name.localeCompare(b.name);
      case "alpha-desc": return b.name.localeCompare(a.name);
      case "price-asc": return pa.price - pb.price;
      case "price-desc": return pb.price - pa.price;
      default: return 0;
    }
  });

  const currentCategory = categoriesData?.find((c: any) => c.slug === categorySlug);
  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || "Featured";

  return (
    <div className="bg-black text-white min-h-screen relative">
      <div className="relative mb-16 py-12 md:py-16 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img src={currentCategory?.image || catGrillz} alt="Grillz Background" className="w-full h-full object-cover opacity-15 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50" data-testid="breadcrumb-shop">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{currentCategory?.name || "Products"}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-wider text-center" data-testid="text-shop-title">
            {searchQuery ? (
              <>Search: "{searchQuery}"</>
            ) : currentCategory ? (
              currentCategory.name.toUpperCase()
            ) : (
              <>OUR <span className="text-primary italic font-serif lowercase tracking-normal">Collection</span></>
            )}
          </h1>
          <p className="text-white/60 text-center max-w-2xl text-sm md:text-base font-light">
            {currentCategory?.description || "Discover our meticulously crafted pieces. From subtle gold accents to bold diamond statements."}
          </p>
          {total > 0 && <p className="text-white/40 text-xs" data-testid="text-product-count">{total} product{total !== 1 ? "s" : ""}</p>}
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-4 relative z-20">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors uppercase tracking-widest"
            data-testid="button-filter"
          >
            Filter <ChevronDown className="w-3 h-3" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors uppercase tracking-widest"
              data-testid="button-sort"
            >
              {currentSortLabel} <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            
            {sortOpen && (
              <div className="absolute top-full left-0 mt-4 w-60 bg-black border border-white/10 shadow-2xl z-50 py-4">
                <ul className="flex flex-col gap-1">
                  {SORT_OPTIONS.map((option) => (
                    <li key={option.value}>
                      <button 
                        onClick={() => { setSortBy(option.value); setSortOpen(false); }}
                        className={`w-full text-left px-6 py-1.5 text-lg font-heading font-bold transition-colors ${option.value === sortBy ? "text-white" : "text-white/60 hover:text-white"}`}
                        data-testid={`sort-option-${option.value}`}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-32" data-testid="text-no-products">
            <p className="text-white/60 text-lg">No products found.</p>
            <Link href="/shop" className="text-primary underline mt-4 inline-block">View all products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-16" data-testid="product-grid">
            {sortedProducts.map((product: any, idx: number) => {
              const pricing = getProductPrice(product);
              const img = resolveImage(product.images?.[0], fallbackImages[idx % fallbackImages.length]);
              return (
                <Link key={product.id} href={`/product/${product.slug}`} className="group block cursor-pointer" data-testid={`card-product-${product.id}`}>
                    <div className="relative aspect-[4/5] bg-zinc-900 mb-4 overflow-hidden">
                      <img 
                        src={img} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="text-center px-2">
                      <h3 className="text-[10px] md:text-xs font-heading font-bold mb-1 uppercase tracking-wider group-hover:text-primary transition-colors line-clamp-2 min-h-[30px]" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-[10px] md:text-sm font-bold mt-1">
                        <span className={pricing.oldPrice ? "text-red-500" : "text-primary"} data-testid={`text-price-${product.id}`}>{formatPrice(pricing.price, pricing.currency)}</span>
                        {pricing.oldPrice && <span className="text-white/60 line-through text-[10px] md:text-xs">{formatPrice(pricing.oldPrice, pricing.currency)}</span>}
                      </div>
                    </div>
                </Link>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mb-24 border-t border-white/10 pt-10" data-testid="pagination">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm transition-colors ${currentPage === page ? "bg-white text-black" : "text-white hover:bg-white/10"}`}
                  data-testid={`button-page-${page}`}
                >
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-white">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 rounded-full text-white hover:bg-white/10 font-bold flex items-center justify-center text-sm transition-colors"
                >
                  {totalPages}
                </button>
              </>
            )}
            {currentPage < totalPages && (
              <button 
                onClick={() => setCurrentPage(currentPage + 1)}
                className="w-8 h-8 rounded-full text-white hover:bg-white/10 flex items-center justify-center transition-colors"
                data-testid="button-next-page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsFilterOpen(false)}
          />
          
          <div className="relative w-[320px] md:w-[400px] h-full bg-black border-r border-white/10 flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-heading font-bold tracking-wider">Filters</h2>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="text-white hover:text-primary transition-colors"
                data-testid="button-close-filter"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-8">
              {categoriesData && categoriesData.length > 0 && (
                <div>
                  <p className="text-xl font-heading font-bold tracking-wider mb-4">Categories</p>
                  <div className="space-y-3">
                    <Link href="/shop"
                      onClick={() => setIsFilterOpen(false)}
                      className={`block text-sm font-bold font-heading tracking-wide transition-colors ${!categorySlug ? "text-primary" : "text-white/70 hover:text-white"}`}
                      data-testid="filter-category-all"
                    >
                      All Products
                    </Link>
                    {categoriesData.map((cat: any) => (
                      <Link key={cat.id} href={`/shop/${cat.slug}`}
                        onClick={() => setIsFilterOpen(false)}
                        className={`block text-sm font-bold font-heading tracking-wide transition-colors ${categorySlug === cat.slug ? "text-primary" : "text-white/70 hover:text-white"}`}
                        data-testid={`filter-category-${cat.slug}`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <button 
                  onClick={() => setAvailabilityOpen(!availabilityOpen)}
                  className="w-full flex items-center justify-between py-2 text-left group"
                >
                  <span className="text-xl font-heading font-bold tracking-wider group-hover:text-primary transition-colors">Availability</span>
                  {availabilityOpen ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
                </button>
                
                {availabilityOpen && (
                  <div className="mt-4 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 border border-white/20 bg-transparent flex items-center justify-center group-hover:border-white transition-colors"></div>
                      <span className="text-sm font-bold font-heading tracking-wide">In stock</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 border border-white/20 bg-transparent flex items-center justify-center group-hover:border-white transition-colors"></div>
                      <span className="text-sm font-bold font-heading tracking-wide">Out of stock</span>
                    </label>
                  </div>
                )}
              </div>

              <div>
                <button 
                  onClick={() => setPriceOpen(!priceOpen)}
                  className="w-full flex items-center justify-between py-2 text-left group"
                >
                  <span className="text-xl font-heading font-bold tracking-wider group-hover:text-primary transition-colors">Price</span>
                  {priceOpen ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
                </button>
                
                {priceOpen && (
                  <div className="mt-8">
                    <div className="relative h-[2px] bg-white/20 mb-8 mx-2">
                      <div className="absolute left-0 right-0 h-full bg-white"></div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow cursor-grab"></div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow cursor-grab"></div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1 relative border border-white/20 flex items-center px-3 h-12 bg-[#1a1a1a]">
                        <span className="text-white/80 font-bold text-sm">£</span>
                        <input 
                          type="number" 
                          defaultValue="0" 
                          className="w-full bg-transparent border-none text-right text-white font-bold font-heading text-sm focus:outline-none"
                        />
                      </div>
                      <span className="text-sm font-bold font-heading">To</span>
                      <div className="flex-1 relative border border-white/20 flex items-center px-3 h-12 bg-[#1a1a1a]">
                        <span className="text-white/80 font-bold text-sm">£</span>
                        <input 
                          type="number" 
                          defaultValue="2608" 
                          className="w-full bg-transparent border-none text-right text-white font-bold font-heading text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 p-6 bg-[#2a2a2a] text-center relative overflow-hidden group cursor-pointer h-[280px] flex flex-col items-center justify-center">
                <div className="relative z-10 w-full flex flex-col items-center">
                  <p className="text-[13px] font-heading font-bold tracking-wide mb-2">Online Exclusive</p>
                  <h3 className="text-[40px] font-heading font-bold uppercase leading-[1.1] mb-1 text-white">SALE UP TO</h3>
                  <h3 className="text-[46px] font-heading font-bold uppercase leading-none mb-6 text-white">25% OFF</h3>
                  <button className="bg-[#d4af37] text-black font-heading font-bold uppercase tracking-wider text-[13px] px-8 py-3 hover:bg-white transition-colors">
                    SHOP THE SALE
                  </button>
                </div>
                <div className="absolute inset-0 opacity-[0.03] group-hover:scale-105 transition-transform duration-700 pointer-events-none border-[10px] border-white m-4 rounded-[40px]">
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}