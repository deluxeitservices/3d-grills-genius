import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronRight } from "lucide-react";
import product1 from "@/assets/product_1.png";
import product2 from "@/assets/product_2.png";
import product3 from "@/assets/product_3.png";
import catGrillz from "@/assets/cat-grillz.png";
import catChains from "@/assets/cat-chains.png";
import catRings from "@/assets/cat-rings.png";
import catBracelets from "@/assets/cat-bracelets.png";

const MOCK_PRODUCTS = [
  { id: 1, name: ".Sparkle + window grillz set", price: "£176.00", oldPrice: "£200.00", image: product1 },
  { id: 2, name: "1 Chrome heart inspired window with inlay", price: "£135.00", oldPrice: "£180.00", image: product2 },
  { id: 3, name: "1x Mould Kit for top or bottom teeth", price: "£11.99", image: product3 },
  { id: 4, name: "3 stone combo Special Design", price: "£200.00", oldPrice: "£230.00", image: catGrillz },
  { id: 5, name: "Abstract Heart Window with inlay", price: "£130.00", image: catChains },
  { id: 6, name: "Africa shaped cap", price: "£93.00", oldPrice: "£120.00", image: catRings },
  { id: 7, name: "Bottom 6 with iced canines", price: "£520.00", oldPrice: "£580.00", image: catBracelets },
  { id: 8, name: "Butterfly fangs x 2", price: "£225.00", oldPrice: "£250.00", image: product1 }
];

const RECENTLY_VIEWED = [
  { id: 11, name: "Four Windows and Two Solid Caps Set", price: "£400.00", image: product2 },
  { id: 12, name: "Window with inlay 'Jurja' design", price: "£90.00", image: product3 },
  { id: 13, name: "1 Chrome heart inspired window with inlay", price: "£135.00", oldPrice: "£180.00", image: catGrillz }
];

export default function Shop() {
  return (
    <div className="bg-black text-white min-h-screen pt-12 pb-20">
      {/* Breadcrumb & Title Banner */}
      <div className="relative mb-16 py-24 md:py-32 overflow-hidden border-y border-white/10">
        <div className="absolute inset-0">
          <img src={catGrillz} alt="Grillz Background" className="w-full h-full object-cover opacity-30 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50">
            <Link href="/"><a className="hover:text-primary transition-colors">Home</a></Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Products</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white tracking-wider text-center">
            OUR <span className="text-primary italic font-serif lowercase tracking-normal">Collection</span>
          </h1>
          <p className="text-white/60 text-center max-w-2xl text-sm md:text-base font-light">
            Discover our meticulously crafted pieces. From subtle gold accents to bold diamond statements.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Filters Bar */}
        <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-4">
          <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors uppercase tracking-widest">
            Filter <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors uppercase tracking-widest">
            Alphabetically, A-Z <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Product Grid - 4 Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-16">
          {MOCK_PRODUCTS.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <a className="group block cursor-pointer">
                <div className="relative aspect-[4/5] bg-zinc-900 mb-4 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="text-center px-2">
                  <h3 className="text-[10px] md:text-xs font-heading font-bold mb-1 uppercase tracking-wider group-hover:text-primary transition-colors line-clamp-2 min-h-[30px]">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-[10px] md:text-sm font-bold mt-1">
                    <span className={product.oldPrice ? "text-red-500" : "text-primary"}>{product.price}</span>
                    {product.oldPrice && <span className="text-white/60 line-through text-[10px] md:text-xs">{product.oldPrice}</span>}
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mb-24 border-t border-white/10 pt-10">
          <button className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center text-sm">1</button>
          <button className="w-8 h-8 rounded-full text-white hover:bg-white/10 font-bold flex items-center justify-center text-sm transition-colors">2</button>
          <button className="w-8 h-8 rounded-full text-white hover:bg-white/10 font-bold flex items-center justify-center text-sm transition-colors">3</button>
          <span className="text-white">...</span>
          <button className="w-8 h-8 rounded-full text-white hover:bg-white/10 font-bold flex items-center justify-center text-sm transition-colors">8</button>
          <button className="w-8 h-8 rounded-full text-white hover:bg-white/10 flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recently Viewed */}
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-8 tracking-wide">Recently Viewed Products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
            {RECENTLY_VIEWED.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <a className="group block cursor-pointer">
                  <div className="relative aspect-[4/5] bg-zinc-900 mb-4 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center px-2">
                    <h3 className="text-[10px] md:text-xs font-heading font-bold mb-1 uppercase tracking-wider group-hover:text-primary transition-colors line-clamp-2 min-h-[30px]">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold">
                      <span className="text-primary">{product.price}</span>
                      {product.oldPrice && <span className="text-white/50 line-through">{product.oldPrice}</span>}
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}