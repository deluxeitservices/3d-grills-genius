import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronRight, Shield, Truck, RotateCcw, Heart, ChevronDown } from "lucide-react";
import product1 from "@/assets/product_1.png";
import product2 from "@/assets/product_2.png";
import product3 from "@/assets/product_3.png";

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(product1);
  const [selectedMaterial, setSelectedMaterial] = useState("Silver & Real Diamond");
  const [quantity, setQuantity] = useState(1);

  const images = [product1, product2, product3];
  
  const materials = [
    "Silver & Real Diamond", "Silver & Cz", "Dental Yellow Gold & Cz", "Dental Yellow Gold & Real Diamonds",
    "Dental White Gold & Cz", "Dental White Gold & Real Diamonds", "14k Yellow Gold & Cz",
    "14k Yellow Gold & Real Diamonds", "14k Rose Gold & Cz", "14k Rose Gold & Real Diamonds"
  ];

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-2 mb-8">
        <Link href="/"><a className="hover:text-white transition-colors">Home</a></Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop"><a className="hover:text-white transition-colors">All Grillz</a></Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white">Top two window diamond tip + bottom diamond bar set</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Product Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="w-full bg-zinc-900 aspect-square md:aspect-[4/3] lg:aspect-[16/10] max-h-[600px] overflow-hidden relative">
              <img src={selectedImage} alt="Product" className="w-full h-full object-cover" />
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-zinc-900 overflow-hidden border ${selectedImage === img ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'} transition-all`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col pt-2 lg:pt-0">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 uppercase tracking-wider">Top two window diamond tip + bottom diamond bar set</h1>
            
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-2xl font-bold text-primary">£480.00</span>
              <span className="text-white/50 line-through text-sm">£600.00</span>
            </div>
            
            <p className="text-xs text-white/50 mb-6">Tax included.</p>
            <p className="text-xs text-green-500 mb-8 italic">Shipping calculated at checkout.</p>

            {/* Options */}
            <div className="mb-8">
              <div className="mb-3">
                <span className="text-sm font-bold tracking-wider">Metal & stone type: <span className="font-normal text-white/80">{selectedMaterial}</span></span>
              </div>
              <div className="flex flex-wrap gap-2">
                {materials.map(mat => (
                  <button 
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`px-4 py-2 border text-xs transition-colors ${selectedMaterial === mat ? 'border-white text-white font-bold bg-white/10' : 'border-white/20 text-white/70 hover:border-white/50'}`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mb-6">
              <span className="text-sm font-bold tracking-wider block mb-3">Quantity</span>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-white/20 h-12 w-32">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-white/50 hover:text-white h-full">-</button>
                  <input type="text" value={quantity} readOnly className="w-full bg-transparent text-center text-sm font-bold focus:outline-none" />
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-white/50 hover:text-white h-full">+</button>
                </div>
                
                <Button className="flex-1 bg-transparent border border-primary text-primary hover:bg-primary hover:text-white rounded-none h-12 uppercase tracking-widest text-xs font-bold transition-all">
                  ADD TO CART
                </Button>
              </div>
            </div>
            
            {/* Buy with Shop Pay */}
            <Button className="w-full bg-[#5A31F4] hover:bg-[#4A26C9] text-white rounded-none h-12 mb-2 font-bold flex items-center justify-center gap-2">
              Buy with <span className="font-serif text-lg tracking-tight lowercase">shop</span>
            </Button>
            
            <div className="text-center mb-10">
              <a href="#" className="text-[10px] text-white/50 underline hover:text-white transition-colors">More payment options</a>
            </div>
            
            {/* Klarna banner */}
            <div className="border border-white/10 p-4 mb-12 flex items-center gap-3">
              <div className="bg-[#FFA8C5] text-black text-xs font-bold px-2 py-1 rounded">Klarna.</div>
              <p className="text-xs text-white/70">
                Make 3 payments of <span className="font-bold text-white">£160.00</span>. <a href="#" className="underline">Learn more</a>
              </p>
            </div>

            {/* Accordions */}
            <div className="border-t border-white/10">
              {[
                { title: "HOW IT WORKS?" },
                { title: "DESCRIPTION" },
                { title: "SHIPPING" },
                { title: "RETURN & EXCHANGES" },
                { title: "CUSTOM GRILLZ" }
              ].map((accordion, i) => (
                <div key={i} className="border-b border-white/10">
                  <button className="w-full py-4 flex items-center justify-between group">
                    <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary transition-colors">{accordion.title}</span>
                    <ChevronDown className="w-4 h-4 text-white/50" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
        
        {/* Money Back Guarantee */}
        <div className="mt-24 mb-16 text-center text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          14 Day Money Back Guarantee. <a href="#" className="underline ml-2">Read more</a>
        </div>
      </div>
      
      {/* You Might Also Like Section */}
      <div className="container mx-auto px-4 pt-10 border-t border-white/10 mb-16">
        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-10 tracking-wide text-center">You Might Also Like</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
          {[
            { id: 4, name: "Window set with stone", price: "£160.00", image: product1 },
            { id: 5, name: "Double solid + window set", price: "£215.00", oldPrice: "£280.00", image: product2 },
            { id: 6, name: "Window + bar (bottom bar)", price: "£160.00", oldPrice: "£200.00", image: product3 },
            { id: 7, name: "Double window set", price: "£145.00", oldPrice: "£200.00", image: product1 }
          ].map((product) => (
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
                    <span className={product.oldPrice ? "text-primary" : "text-primary"}>{product.price}</span>
                    {product.oldPrice && <span className="text-white/60 line-through text-[10px] md:text-xs">{product.oldPrice}</span>}
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>

      {/* Recently Viewed Products */}
      <div className="container mx-auto px-4 pt-10 border-t border-white/10 mb-20">
        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-10 tracking-wide text-center">Recently Viewed Products</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
          {[
            { id: 11, name: "Four Windows and Two Solid Caps Set", price: "£400.00", image: product2 },
            { id: 12, name: "Window with inlay 'Jurja' design", price: "£90.00", image: product3 },
            { id: 13, name: "1 Chrome heart inspired window with inlay", price: "£135.00", oldPrice: "£180.00", image: product1 }
          ].map((product) => (
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
                    <span className={product.oldPrice ? "text-primary" : "text-primary"}>{product.price}</span>
                    {product.oldPrice && <span className="text-white/60 line-through text-[10px] md:text-xs">{product.oldPrice}</span>}
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recently Viewed (Sticky bar mockup) */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/10 p-4 z-50 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-3 overflow-hidden">
          <img src={selectedImage} className="w-10 h-10 object-cover rounded" />
          <div className="flex flex-col truncate">
            <span className="text-[10px] font-bold uppercase truncate">Top two window...</span>
            <span className="text-xs text-primary font-bold">£480.00</span>
          </div>
        </div>
        <Button className="bg-primary text-white h-10 text-xs rounded-none uppercase font-bold tracking-wider px-4 shrink-0">
          Add
        </Button>
      </div>
    </div>
  );
}