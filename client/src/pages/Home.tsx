import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero.jpg";
import catGrillz from "@/assets/cat-grillz.jpg";
import catChains from "@/assets/cat-chains.jpg";
import catRings from "@/assets/cat-rings.jpg";
import catBracelets from "@/assets/cat-bracelets.jpg";
import product1 from "@/assets/product_1.jpg";
import product2 from "@/assets/product_2.jpg";
import product3 from "@/assets/product_3.jpg";
import { ShieldCheck, Truck, Gem, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImg} 
            alt="Luxury Jewelry" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Redefining <span className="text-primary italic">Luxury</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light tracking-wide animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Bespoke jewelry and custom grillz crafted to perfection. Express your unique aura with our exclusive collections.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link href="/shop">
              <Button size="lg" className="bg-primary text-black hover:bg-white px-8 py-6 text-sm uppercase tracking-widest w-full sm:w-auto">
                Shop Collection
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-sm uppercase tracking-widest w-full sm:w-auto bg-transparent">
                Bespoke Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 px-4 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Shop By Category</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Custom Grillz", image: catGrillz, link: "/shop?category=grillz" },
            { name: "Chains", image: catChains, link: "/shop?category=chains" },
            { name: "Rings", image: catRings, link: "/shop?category=rings" },
            { name: "Bracelets", image: catBracelets, link: "/shop?category=bracelets" }
          ].map((cat, i) => (
            <Link key={i} href={cat.link}>
              <a className="group relative aspect-[4/5] overflow-hidden block">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-8 left-0 w-full text-center">
                  <h3 className="text-xl font-medium tracking-wider uppercase mb-2">{cat.name}</h3>
                  <span className="text-primary text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 inline-block">
                    Explore
                  </span>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Featured Pieces</h2>
              <div className="w-16 h-0.5 bg-primary"></div>
            </div>
            <Link href="/shop">
              <a className="text-sm uppercase tracking-widest text-white/60 hover:text-primary border-b border-transparent hover:border-primary pb-1 transition-all">
                View All
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 1, name: "VVS Diamond Cuban Link", price: "£2,450", image: product1, tag: "Best Seller" },
              { id: 2, name: "Solid Gold Top 6 Grillz", price: "£850", image: product2, tag: "Custom" },
              { id: 3, name: "Eternity Diamond Ring", price: "£1,200", image: product3, tag: "New" }
            ].map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative aspect-[4/5] bg-zinc-900 mb-6 overflow-hidden">
                  {product.tag && (
                    <span className="absolute top-4 left-4 z-10 bg-white text-black text-xs font-bold uppercase tracking-wider px-3 py-1">
                      {product.tag}
                    </span>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <Button className="w-full bg-white text-black hover:bg-primary">Add to Cart</Button>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-white/60 tracking-wider">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-24 relative overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 opacity-20">
           <img src={catGrillz} className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Bespoke Grillz Collection</h2>
          <p className="text-lg text-white/70 mb-10 font-light">
            Book an appointment for a custom mold, or order a home molding kit. We craft custom-fitted gold and diamond grillz to perfectly match your aesthetic.
          </p>
          <Button size="lg" className="bg-primary text-black hover:bg-white px-8 py-6 text-sm uppercase tracking-widest">
            Book Consultation
          </Button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-black border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-6 text-primary">
                <Gem className="w-8 h-8" />
              </div>
              <h3 className="text-lg uppercase tracking-widest font-medium mb-3">Premium Quality</h3>
              <p className="text-white/50 text-sm font-light leading-relaxed max-w-xs mx-auto">
                Solid gold and ethically sourced VVS diamonds used in all our custom pieces.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-6 text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg uppercase tracking-widest font-medium mb-3">Secure Shopping</h3>
              <p className="text-white/50 text-sm font-light leading-relaxed max-w-xs mx-auto">
                Shop with confidence with our encrypted checkout and money-back guarantee.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-6 text-primary">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-lg uppercase tracking-widest font-medium mb-3">Insured Delivery</h3>
              <p className="text-white/50 text-sm font-light leading-relaxed max-w-xs mx-auto">
                Fast, tracked, and fully insured shipping worldwide on all orders.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}