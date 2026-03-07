import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronRight, X, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  return (
    <div className="bg-black text-white min-h-screen relative">
      {/* Breadcrumb & Title Banner */}
      <div className="relative mb-16 py-12 md:py-16 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <img src={catGrillz} alt="Grillz Background" className="w-full h-full object-cover opacity-15 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center space-y-4">
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
        <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-4 relative z-20">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors uppercase tracking-widest"
          >
            Filter <ChevronDown className="w-3 h-3" />
          </button>
          
          <div className="relative group">
            <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-primary transition-colors uppercase tracking-widest">
              Alphabetically, A-Z <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-4 w-60 bg-black border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-4">
              <ul className="flex flex-col gap-1">
                {[
                  "Featured",
                  "Best selling",
                  "Alphabetically, A-Z",
                  "Alphabetically, Z-A",
                  "Price, low to high",
                  "Price, high to low",
                  "Date, old to new",
                  "Date, new to old"
                ].map((option) => (
                  <li key={option}>
                    <button className={`w-full text-left px-6 py-1.5 text-lg font-heading font-bold transition-colors ${option === "Alphabetically, A-Z" ? "text-white" : "text-white/60 hover:text-white"}`}>
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
      {/* Filter Sidebar Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsFilterOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative w-[320px] md:w-[400px] h-full bg-black border-r border-white/10 flex flex-col p-6 animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-heading font-bold tracking-wider">Filters</h2>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="text-white hover:text-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-8">
              {/* Availability Filter */}
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
                      <div className="w-5 h-5 border border-white/20 bg-transparent flex items-center justify-center group-hover:border-white transition-colors">
                        {/* Checkbox checkmark would go here when active */}
                      </div>
                      <span className="text-sm font-bold font-heading tracking-wide">In stock (81)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 border border-white/20 bg-transparent flex items-center justify-center group-hover:border-white transition-colors"></div>
                      <span className="text-sm font-bold font-heading tracking-wide">Out of stock (7)</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Price Filter */}
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
                    {/* Fake slider UI */}
                    <div className="relative h-[2px] bg-white/20 mb-8 mx-2">
                      <div className="absolute left-0 right-0 h-full bg-white"></div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow cursor-grab"></div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow cursor-grab"></div>
                    </div>
                    
                    {/* Price Inputs */}
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
              
              {/* Sale Banner Mockup */}
              <div className="mt-8 p-6 bg-[#2a2a2a] text-center relative overflow-hidden group cursor-pointer h-[280px] flex flex-col items-center justify-center">
                <div className="relative z-10 w-full flex flex-col items-center">
                  <p className="text-[13px] font-heading font-bold tracking-wide mb-2">Online Exclusive</p>
                  <h3 className="text-[40px] font-heading font-bold uppercase leading-[1.1] mb-1 text-white">SALE UP TO</h3>
                  <h3 className="text-[46px] font-heading font-bold uppercase leading-none mb-6 text-white">25% OFF</h3>
                  <button className="bg-[#d4af37] text-black font-heading font-bold uppercase tracking-wider text-[13px] px-8 py-3 hover:bg-white transition-colors">
                    SHOP THE SALE
                  </button>
                </div>
                {/* Abstract background elements */}
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