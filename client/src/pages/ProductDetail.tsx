import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronRight, Shield, Truck, RotateCcw, Heart } from "lucide-react";
import product1 from "@/assets/product_1.jpg";
import product2 from "@/assets/product_2.jpg";
import product3 from "@/assets/product_3.jpg";

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(product1);
  const [selectedMaterial, setSelectedMaterial] = useState("14k Yellow Gold");
  const [selectedLength, setSelectedLength] = useState("18 inch");

  const images = [product1, product2, product3];

  return (
    <div className="bg-black text-white min-h-screen pt-20 pb-20">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-xs font-light text-white/50 uppercase tracking-widest flex items-center gap-2">
        <Link href="/"><a className="hover:text-primary">Home</a></Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop"><a className="hover:text-primary">Chains</a></Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white">VVS Diamond Cuban Link</span>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 md:w-24 md:h-32 flex-shrink-0 bg-zinc-900 overflow-hidden border ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                </button>
              ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1 bg-zinc-900 aspect-square md:aspect-auto md:h-[600px] overflow-hidden relative">
              <img src={selectedImage} alt="Product" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-serif mb-2">VVS Diamond Cuban Link 14mm</h1>
            <p className="text-2xl tracking-wider mb-6">£2,450.00</p>
            
            <p className="text-white/70 font-light mb-8 leading-relaxed">
              Our signature 14mm Cuban Link chain, meticulously hand-set with VVS diamonds. Crafted from solid gold to provide unmatched durability and a brilliant, everlasting shine.
            </p>

            {/* Options */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm uppercase tracking-wider">Material: <span className="text-white/60">{selectedMaterial}</span></span>
              </div>
              <div className="flex flex-wrap gap-3">
                {["14k Yellow Gold", "14k White Gold", "14k Rose Gold"].map(mat => (
                  <button 
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`px-4 py-2 border text-sm transition-colors ${selectedMaterial === mat ? 'border-primary text-primary' : 'border-white/20 text-white/60 hover:border-white'}`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm uppercase tracking-wider">Length: <span className="text-white/60">{selectedLength}</span></span>
                <button className="text-xs text-primary underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {["18 inch", "20 inch", "22 inch", "24 inch"].map(len => (
                  <button 
                    key={len}
                    onClick={() => setSelectedLength(len)}
                    className={`px-4 py-2 border text-sm transition-colors ${selectedLength === len ? 'border-primary text-primary' : 'border-white/20 text-white/60 hover:border-white'}`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-10">
              <Button size="lg" className="flex-1 bg-primary text-black hover:bg-white rounded-none py-6 uppercase tracking-widest text-sm">
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="w-16 rounded-none border-white/20 hover:bg-white/10">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            {/* Accordions / Info */}
            <div className="border-t border-white/10 pt-6 space-y-6">
              <div className="flex items-start gap-4 text-sm text-white/70">
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <h4 className="text-white uppercase tracking-wider mb-1">Lifetime Warranty</h4>
                  <p className="font-light">We stand by our craftsmanship. Every piece comes with a lifetime guarantee against manufacturing defects.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-sm text-white/70">
                <Truck className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <h4 className="text-white uppercase tracking-wider mb-1">Insured Shipping</h4>
                  <p className="font-light">Free, fully insured and tracked worldwide shipping on all orders over £500.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-sm text-white/70">
                <RotateCcw className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <h4 className="text-white uppercase tracking-wider mb-1">14-Day Returns</h4>
                  <p className="font-light">Not entirely satisfied? Return your unworn item within 14 days for a full refund (excluding bespoke items).</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}