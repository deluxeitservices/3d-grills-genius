import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Minus, Plus, Trash2 } from "lucide-react";
import product1 from "@/assets/product_1.jpg";

export default function Cart() {
  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-serif mb-10 text-center md:text-left">Your Bag</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items */}
          <div className="flex-1">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 uppercase tracking-widest text-xs text-white/50 border-b border-white/10 pb-4 mb-6">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            {/* Cart Item */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-white/10 pb-6 mb-6">
              <div className="col-span-1 md:col-span-6 flex gap-6">
                <div className="w-24 h-24 bg-zinc-900 flex-shrink-0">
                  <img src={product1} alt="Product" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-medium hover:text-white/80 transition-colors cursor-pointer">VVS Diamond Cuban Link</h3>
                  <p className="text-white/60 text-sm mb-2">14k Yellow Gold / 18 inch</p>
                  <p className="text-white/80 md:hidden">£2,450.00</p>
                </div>
              </div>

              <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                <span className="md:hidden text-sm uppercase tracking-wider text-white/60">Quantity:</span>
                <div className="flex items-center border border-white/20">
                  <button className="px-3 py-2 text-white/60 hover:text-white"><Minus className="w-3 h-3" /></button>
                  <span className="px-3 text-sm">1</span>
                  <button className="px-3 py-2 text-white/60 hover:text-white"><Plus className="w-3 h-3" /></button>
                </div>
              </div>

              <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center">
                <span className="md:hidden text-sm uppercase tracking-wider text-white/60">Total:</span>
                <div className="flex items-center gap-6">
                  <span className="tracking-wider">£2,450.00</span>
                  <button className="text-white/40 hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 bg-zinc-950 p-8 border border-white/5 h-fit sticky top-24">
            <h2 className="text-xl font-serif border-b border-white/10 pb-4 mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm font-light text-white/80 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£2,450.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mb-8">
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>£2,450.00</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-none py-6 uppercase tracking-widest">
                Checkout
              </Button>
            </Link>

            <div className="mt-6 flex gap-2 justify-center opacity-50">
              {/* Payment Icons Placeholder */}
              <div className="w-8 h-5 bg-white/20 rounded"></div>
              <div className="w-8 h-5 bg-white/20 rounded"></div>
              <div className="w-8 h-5 bg-white/20 rounded"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}