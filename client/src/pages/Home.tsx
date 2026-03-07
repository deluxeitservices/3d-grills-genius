import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroVideo from "@/assets/hero-video.mp4";
import heroImg from "@/assets/hero.png";
import catGrillz from "@/assets/cat-grillz.png";
import catChains from "@/assets/cat-chains.png";
import catRings from "@/assets/cat-rings.png";
import catBracelets from "@/assets/cat-bracelets.png";
import product1 from "@/assets/product_1.png";
import product2 from "@/assets/product_2.png";
import product3 from "@/assets/product_3.png";
import { ShieldCheck, Truck, Gem, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col bg-black text-white">
      
      {/* Hero Section (Video Banner) */}
      <section className="relative h-[60vh] md:h-[85vh] w-full flex flex-col justify-end items-center pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <video 
            src={heroVideo} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div> {/* Dark overlay to make button pop */}
        </div>
        <div className="relative z-10">
          <Button size="lg" className="bg-white text-black hover:bg-primary hover:text-black px-8 py-5 md:py-7 text-sm md:text-[15px] font-bold uppercase tracking-[0.2em] rounded-none transition-colors duration-300">
            Shop Grillz Now
          </Button>
        </div>
      </section>

      {/* Category Grid (6 columns on desktop) */}
      <section className="w-full">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-0">
          {[
            { name: "Single Grillz", image: catGrillz },
            { name: "Gold Set Grillz", image: catChains },
            { name: "Diamond Grillz", image: catRings },
            { name: "Curves & Colour", image: catBracelets },
            { name: "Tooth Gems", image: product1 },
            { name: "Tooth Mould", image: product2 }
          ].map((cat, i) => (
            <Link key={i} href="/shop">
              <a className="group relative aspect-square overflow-hidden block">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-4">
                  <h3 className="text-xl md:text-2xl font-heading font-bold uppercase leading-none text-white tracking-wide whitespace-pre-line">
                    {cat.name.split(' ').map((word, idx) => (
                      <span key={idx} className="block">{word}</span>
                    ))}
                  </h3>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 md:py-32 px-4 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4 uppercase">Best Sellers</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { id: 1, name: "Hello Kitty + Heart Set", price: "£254.00", image: product1 },
            { id: 2, name: "Window And Heart Cap", price: "£233.00", oldPrice: "£260.00", image: product2 },
            { id: 3, name: "Sparkle + Window Grillz Set", price: "£233.00", oldPrice: "£274.00", image: product3 },
            { id: 4, name: "London Bridge Design (Window Canines)", price: "£240.00", image: catGrillz }
          ].map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-square bg-zinc-900 mb-4 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="text-center px-2">
                <h3 className="text-sm md:text-base font-heading font-bold mb-1 uppercase tracking-wide group-hover:text-primary transition-colors line-clamp-2 min-h-[40px]">{product.name}</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-primary font-bold text-lg">{product.price}</span>
                  {product.oldPrice && <span className="text-white/50 line-through text-sm">{product.oldPrice}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Made For You Banner */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center px-4 md:px-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImg} 
            alt="Made For You" 
            className="w-full h-full object-cover grayscale opacity-80"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 max-w-xl">
          <h2 className="text-5xl md:text-7xl font-heading font-bold text-white mb-4 uppercase">Made For You</h2>
          <p className="text-xl text-white mb-8 font-medium">Jewellery as unique as your style.</p>
          <Button size="lg" className="bg-white text-black hover:bg-primary hover:text-black px-10 py-6 text-sm font-bold uppercase tracking-widest rounded-none transition-colors">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-muted text-black">
        <div className="container mx-auto px-4 md:px-12 text-center">
          <h2 className="text-3xl md:text-[40px] font-heading font-bold mb-16 uppercase tracking-wide">Real Reviews From Real Customers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-6xl mx-auto">
            {[
              {
                text: "icl these are the best grillz ive gotten from a jewellers defo my new plug",
                author: "James R."
              },
              {
                text: "I've never felt more confident with a piece of jewelry. The gold grillz I got are stunning—sleek, shiny, and crafted to perfection. I wear them everywhere and always get compliments. I'm so glad I chose these guys.",
                author: "Ayesha M."
              },
              {
                text: "The process was super easy, and the result was even better than I expected! My custom grillz fit perfectly, feel amazing, and have the perfect shine. Grillz Shop made sure I was happy with every detail. Totally worth it!",
                author: "Marcus L."
              }
            ].map((review, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="flex gap-1 mb-6 text-black">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-[13px] md:text-[14px] font-medium leading-relaxed mb-6">"{review.text}"</p>
                <p className="font-bold text-xs uppercase tracking-wide">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shine Like Never Section */}
      <section className="py-24 px-4 md:px-0">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <img src={heroImg} alt="Shine Like Never" className="w-full h-auto aspect-video object-cover" />
            </div>
            <div className="w-full md:w-1/2 md:pr-12 lg:pr-24">
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 uppercase">Shine Like Never</h2>
              <p className="text-white/80 font-light leading-relaxed mb-10 text-sm md:text-base">
                There's a reason we choose to stand out—because we believe in our uniqueness. Grillz Shop's grillz are for those who don't just follow trends, but define them. Each piece is crafted for comfort, designed for those who know that a confident smile speaks louder than words. Whether it's the subtle elegance of gold or the boldness of diamond details, our grillz empower you to show the world exactly who you are.
              </p>
              <Button size="lg" className="bg-primary text-black hover:bg-white px-10 py-6 text-sm font-bold uppercase tracking-widest rounded-none">
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
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