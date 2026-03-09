import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/api";
import heroImg from "@/assets/hero.png";
import catGrillz from "@/assets/cat-grillz.png";
import catChains from "@/assets/cat-chains.png";
import catRings from "@/assets/cat-rings.png";
import catBracelets from "@/assets/cat-bracelets.png";
import product1 from "@/assets/product_1.png";
import product2 from "@/assets/product_2.png";
import product3 from "@/assets/product_3.png";
import { ShieldCheck, Truck, Gem, Star } from "lucide-react";

const fallbackCategories = [
  { name: "Single Grillz", image: catGrillz, slug: "single-grillz" },
  { name: "Gold Set Grillz", image: catChains, slug: "gold-set-grillz" },
  { name: "Diamond Grillz", image: catRings, slug: "diamond-grillz" },
  { name: "Curves & Colour", image: catBracelets, slug: "curves-colour" },
  { name: "Tooth Gems", image: product1, slug: "tooth-gems" },
  { name: "Tooth Mould", image: product2, slug: "tooth-mould" },
];

const fallbackProducts = [
  { id: 1, name: "Hello Kitty + Heart Set", slug: "hello-kitty-heart-set", price: 254, discountPrice: null, image: product1 },
  { id: 2, name: "Window And Heart Cap", slug: "window-and-heart-cap", price: 260, discountPrice: 233, image: product2 },
  { id: 3, name: "Sparkle + Window Grillz Set", slug: "sparkle-window-grillz-set", price: 274, discountPrice: 233, image: product3 },
  { id: 4, name: "London Bridge Design (Window Canines)", slug: "london-bridge-design", price: 240, discountPrice: null, image: catGrillz },
];

const fallbackReviews = [
  { text: "icl these are the best grillz ive gotten from a jewellers defo my new plug", author: "James R.", rating: 5 },
  { text: "I've never felt more confident with a piece of jewelry. The gold grillz I got are stunning—sleek, shiny, and crafted to perfection. I wear them everywhere and always get compliments. I'm so glad I chose these guys.", author: "Ayesha M.", rating: 5 },
  { text: "The process was super easy, and the result was even better than I expected! My custom grillz fit perfectly, feel amazing, and have the perfect shine. 3D GRILLS GENIUS made sure I was happy with every detail. Totally worth it!", author: "Marcus L.", rating: 5 },
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

export default function Home() {
  const { data: bannersData } = useQuery<any[]>({
    queryKey: ["/api/banners"],
    queryFn: getQueryFn("/api/banners"),
  });

  const { data: categoriesData } = useQuery<any[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn("/api/categories"),
  });

  const { data: productsData } = useQuery<{ products: any[]; total: number }>({
    queryKey: ["/api/products", "featured"],
    queryFn: getQueryFn("/api/products?featured=true&limit=4"),
  });

  const { data: reviewsData } = useQuery<any[]>({
    queryKey: ["/api/reviews"],
    queryFn: getQueryFn("/api/reviews"),
  });

  const banners = bannersData && bannersData.length > 0 ? bannersData : null;
  const heroBanner = banners?.find((b: any) => b.page === "home") || null;
  const midBanner = banners?.find((b: any) => b.page === "mid") || (bannersData && bannersData.length > 1 ? bannersData[1] : null);

  const assetMap: Record<string, string> = {
    "/assets/product_1.png": product1,
    "/assets/product_2.png": product2,
    "/assets/product_3.png": product3,
    "/assets/cat-grillz.png": catGrillz,
    "/assets/cat-chains.png": catChains,
    "/assets/cat-rings.png": catRings,
    "/assets/cat-bracelets.png": catBracelets,
    "/assets/hero.png": heroImg,
  };

  const resolveImage = (dbPath: string | null | undefined, fallback: string) => {
    if (!dbPath) return fallback;
    if (dbPath.startsWith("/uploads/") || dbPath.startsWith("http")) return dbPath;
    return assetMap[dbPath] || fallback;
  };

  const categories = categoriesData && categoriesData.length > 0
    ? categoriesData.slice(0, 6).map((cat: any, i: number) => ({
        name: cat.name,
        image: resolveImage(cat.image, fallbackCategories[i]?.image || catGrillz),
        slug: cat.slug,
      }))
    : fallbackCategories;

  const featuredProducts = productsData?.products && productsData.products.length > 0
    ? productsData.products
    : null;

  const reviews = reviewsData && reviewsData.length > 0 ? reviewsData : fallbackReviews;

  return (
    <div className="flex flex-col bg-black text-white">
      
      <section className="relative h-[60vh] md:h-[85vh] w-full flex flex-col justify-end items-center pb-16 md:pb-24" data-testid="hero-section">
        <div className="absolute inset-0">
          <img 
            src={resolveImage(heroBanner?.image, heroImg)} 
            alt={heroBanner?.title || "Hero Grillz"} 
            className="w-full h-full object-cover"
            data-testid="img-hero"
          />
        </div>
        <div className="relative z-10">
          <Link href="/shop">
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 px-8 py-5 md:py-7 text-sm md:text-[15px] font-bold uppercase tracking-[0.2em] rounded-none" data-testid="button-shop-grillz">
              {heroBanner?.subtitle || "Shop Grillz Now"}
            </Button>
          </Link>
        </div>
      </section>

      <section className="w-full" data-testid="categories-section">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-0">
          {categories.map((cat, i) => (
            <Link key={i} href={`/shop/${cat.slug}`} className="group relative aspect-square overflow-hidden block" data-testid={`link-category-${cat.slug}`}>
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-4">
                  <h3 className="text-xl md:text-2xl font-heading font-bold uppercase leading-none text-white tracking-wide whitespace-pre-line">
                    {cat.name.split(' ').map((word: string, idx: number) => (
                      <span key={idx} className="block">{word}</span>
                    ))}
                  </h3>
                </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-32 px-4 container mx-auto" data-testid="bestsellers-section">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 uppercase">Best Sellers</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {(featuredProducts || fallbackProducts).map((product: any, idx: number) => {
            const pricing = featuredProducts ? getProductPrice(product) : {
              price: product.discountPrice || product.price,
              oldPrice: product.discountPrice ? product.price : null,
              currency: "GBP",
            };
            const rawImg = product.images?.[0] || product.image;
            const img = resolveImage(rawImg, [product1, product2, product3, catGrillz][idx % 4]);
            const slug = product.slug || `product-${product.id}`;
            return (
              <Link key={product.id} href={`/product/${slug}`} className="group cursor-pointer block" data-testid={`card-product-${product.id}`}>
                  <div className="relative aspect-square bg-zinc-900 mb-4 overflow-hidden">
                    <img 
                      src={img} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center px-2">
                    <h3 className="text-sm md:text-base font-heading font-bold mb-1 uppercase tracking-wide group-hover:text-primary transition-colors line-clamp-2 min-h-[40px]" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-primary font-bold text-lg" data-testid={`text-price-${product.id}`}>{formatPrice(pricing.price, pricing.currency)}</span>
                      {pricing.oldPrice && <span className="text-white/50 line-through text-sm">{formatPrice(pricing.oldPrice, pricing.currency)}</span>}
                    </div>
                  </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative h-[60vh] md:h-[70vh] flex items-center px-4 md:px-20 overflow-hidden" data-testid="made-for-you-section">
        <div className="absolute inset-0">
          <img 
            src={resolveImage(midBanner?.image, heroImg)} 
            alt={midBanner?.title || "Made For You"} 
            className="w-full h-full object-cover grayscale opacity-80"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-xl">
          <h2 className="text-5xl md:text-7xl font-heading font-bold text-white mb-4 uppercase">{midBanner?.title || "Made For You"}</h2>
          <p className="text-xl text-white mb-8 font-medium">{midBanner?.subtitle || "Jewellery as unique as your style."}</p>
          <Link href={midBanner?.link || "/shop"}>
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 px-10 py-6 text-sm font-bold uppercase tracking-widest rounded-none transition-colors" data-testid="button-shop-now-mid">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-24 bg-muted text-black" data-testid="reviews-section">
        <div className="container mx-auto px-4 md:px-12 text-center">
          <h2 className="text-3xl md:text-[40px] font-heading font-bold mb-16 uppercase tracking-wide">Real Reviews From Real Customers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-6xl mx-auto">
            {reviews.slice(0, 3).map((review: any, i: number) => (
              <div key={review.id || i} className="flex flex-col items-center" data-testid={`card-review-${i}`}>
                <div className="flex gap-1 mb-6 text-black">
                  {[...Array(review.rating || 5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-[13px] md:text-[14px] font-medium leading-relaxed mb-6">"{review.text}"</p>
                <p className="font-bold text-xs uppercase tracking-wide">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 md:px-0">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <img src={heroImg} alt="Shine Like Never" className="w-full h-auto aspect-video object-cover" />
            </div>
            <div className="w-full md:w-1/2 md:pr-12 lg:pr-24">
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 uppercase">Shine Like Never</h2>
              <p className="text-white/80 font-light leading-relaxed mb-10 text-sm md:text-base">
                There's a reason we choose to stand out—because we believe in our uniqueness. 3D GRILLS GENIUS's grillz are for those who don't just follow trends, but define them. Each piece is crafted for comfort, designed for those who know that a confident smile speaks louder than words. Whether it's the subtle elegance of gold or the boldness of diamond details, our grillz empower you to show the world exactly who you are.
              </p>
              <Link href="/shop">
                <Button size="lg" className="bg-white text-black hover:bg-zinc-200 px-10 py-6 text-sm font-bold uppercase tracking-widest rounded-none" data-testid="button-shop-now-bottom">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-muted text-black py-4 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee inline-block font-heading font-bold text-xl md:text-2xl uppercase tracking-widest px-4">
          HOME OF THE BEST CUSTOM GRILLZ &nbsp;&nbsp;&nbsp;&nbsp; HOME OF THE BEST CUSTOM GRILLZ &nbsp;&nbsp;&nbsp;&nbsp; HOME OF THE BEST CUSTOM GRILLZ &nbsp;&nbsp;&nbsp;&nbsp; HOME OF THE BEST CUSTOM GRILLZ &nbsp;&nbsp;&nbsp;&nbsp; HOME OF THE BEST CUSTOM GRILLZ &nbsp;&nbsp;&nbsp;&nbsp; HOME OF THE BEST CUSTOM GRILLZ
        </div>
        <div className="animate-marquee inline-block font-heading font-bold text-xl md:text-2xl uppercase tracking-widest px-4">
          HOME OF THE BEST CUSTOM GRILLZ &nbsp;&nbsp;&nbsp;&nbsp; HOME OF THE BEST CUSTOM GRILLZ &nbsp;&nbsp;&nbsp;&nbsp; HOME OF THE BEST CUSTOM GRILLZ &nbsp;&nbsp;&nbsp;&nbsp; HOME OF THE BEST CUSTOM GRILLZ &nbsp;&nbsp;&nbsp;&nbsp; HOME OF THE BEST CUSTOM GRILLZ &nbsp;&nbsp;&nbsp;&nbsp; HOME OF THE BEST CUSTOM GRILLZ
        </div>
      </div>

    </div>
  );
}