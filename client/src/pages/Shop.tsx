import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import product1 from "@/assets/product_1.jpg";
import product2 from "@/assets/product_2.jpg";
import product3 from "@/assets/product_3.jpg";
import catGrillz from "@/assets/cat-grillz.jpg";
import catChains from "@/assets/cat-chains.jpg";
import catRings from "@/assets/cat-rings.jpg";

const MOCK_PRODUCTS = [
  { id: 1, name: "VVS Diamond Cuban Link 14mm", price: "£2,450", image: product1, category: "chains", tag: "Best Seller" },
  { id: 2, name: "Solid Gold Top 6 Grillz", price: "£850", image: product2, category: "grillz", tag: "" },
  { id: 3, name: "Eternity Diamond Ring", price: "£1,200", image: product3, category: "rings", tag: "New" },
  { id: 4, name: "VVS Diamond Bottom 8 Grillz", price: "£1,800", image: catGrillz, category: "grillz", tag: "" },
  { id: 5, name: "White Gold Tennis Chain", price: "£3,100", image: catChains, category: "chains", tag: "" },
  { id: 6, name: "Gold Signet Ring", price: "£650", image: catRings, category: "rings", tag: "" },
];

export default function Shop() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all" 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 border-b border-white/10 pb-8 mb-8">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 text-center">Collection</h1>
        <p className="text-white/60 text-center max-w-2xl mx-auto font-light">
          Explore our complete collection of meticulously crafted jewelry and custom grillz.
        </p>
      </div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10 flex items-center gap-2"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
          <div className="text-sm text-white/60">{filteredProducts.length} Products</div>
        </div>

        {/* Sidebar Filters */}
        <aside className={`w-full md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden'} md:block`}>
          <div className="space-y-8 sticky top-24">
            <div>
              <h3 className="text-sm uppercase tracking-widest font-medium mb-4 pb-2 border-b border-white/10">Category</h3>
              <ul className="space-y-3 text-sm font-light">
                {['all', 'grillz', 'chains', 'rings', 'bracelets'].map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => setActiveCategory(cat)}
                      className={`uppercase tracking-wider hover:text-white transition-colors ${activeCategory === cat ? 'text-white font-medium border-b border-white' : 'text-white/60'}`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm uppercase tracking-widest font-medium mb-4 pb-2 border-b border-white/10">Material</h3>
              <ul className="space-y-3 text-sm font-light text-white/60">
                <li><button className="hover:text-white transition-colors flex items-center gap-2"><div className="w-3 h-3 border border-white/40"></div> Solid Gold</button></li>
                <li><button className="hover:text-white transition-colors flex items-center gap-2"><div className="w-3 h-3 border border-white/40 bg-white"></div> White Gold</button></li>
                <li><button className="hover:text-white transition-colors flex items-center gap-2"><div className="w-3 h-3 border border-white/40 bg-rose-300"></div> Rose Gold</button></li>
                <li><button className="hover:text-white transition-colors flex items-center gap-2"><div className="w-3 h-3 border border-white/40 bg-zinc-400"></div> Silver</button></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="hidden md:flex justify-between items-center mb-8 pb-4 border-b border-white/10">
            <div className="text-sm text-white/60">{filteredProducts.length} Products</div>
            <button className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
              Sort by: Recommended <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <a className="group block cursor-pointer">
                  <div className="relative aspect-[4/5] bg-zinc-900 mb-4 overflow-hidden">
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
                      <Button className="w-full bg-white text-black hover:bg-zinc-200">Quick Add</Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-medium mb-1 group-hover:text-white/80 transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-white/60 tracking-wider text-sm">{product.price}</p>
                  </div>
                </a>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center border-t border-white/10 pt-10">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black rounded-none px-8">
              Load More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}