import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import product1 from "@/assets/product_1.png";

export default function Checkout() {
  return (
    <div className="bg-white text-black min-h-screen">
      {/* Checkout Header */}
      <header className="py-6 border-b border-zinc-200">
        <div className="container mx-auto px-4 max-w-6xl flex justify-between items-center">
          <Link href="/">
            <a className="text-2xl font-serif tracking-widest text-black">
              3D grills genius
            </a>
          </Link>
          <Link href="/cart">
            <a className="text-sm flex items-center gap-1 text-zinc-500 hover:text-black transition-colors">
              <ChevronLeft className="w-4 h-4" /> Return to Cart
            </a>
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl flex flex-col-reverse lg:flex-row min-h-[calc(100vh-85px)]">
        
        {/* Left Col - Form */}
        <div className="flex-1 px-4 lg:pr-12 py-10">
          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            
            {/* Contact */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Contact</h2>
                <span className="text-sm text-zinc-500">Have an account? <a href="#" className="underline">Log in</a></span>
              </div>
              <Input placeholder="Email or mobile phone number" className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0" />
              <div className="mt-2 flex items-center gap-2">
                <input type="checkbox" id="news" className="accent-black" />
                <label htmlFor="news" className="text-sm text-zinc-600">Email me with news and offers</label>
              </div>
            </div>

            {/* Delivery */}
            <div>
              <h2 className="text-xl font-medium mb-4">Delivery</h2>
              <div className="space-y-4">
                <select className="w-full h-12 bg-white border border-zinc-300 rounded-none px-3 focus:outline-none focus:border-black text-zinc-600">
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Europe</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First name" className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0" />
                  <Input placeholder="Last name" className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0" />
                </div>
                <Input placeholder="Address" className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0" />
                <Input placeholder="Apartment, suite, etc. (optional)" className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="City" className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0" />
                  <Input placeholder="Postcode" className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0" />
                </div>
                <Input placeholder="Phone" className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0" />
              </div>
            </div>

            <Button className="w-full bg-black text-white hover:bg-black/90 rounded-none py-7 text-lg font-light tracking-wide">
              Continue to Payment
            </Button>
            
            <div className="pt-6 border-t border-zinc-200 text-xs text-zinc-500 space-x-4">
              <a href="#">Refund policy</a>
              <a href="#">Privacy policy</a>
              <a href="#">Terms of service</a>
            </div>
          </form>
        </div>

        {/* Right Col - Summary */}
        <div className="w-full lg:w-[45%] bg-zinc-50 border-l border-zinc-200 p-4 lg:pl-12 py-10">
          <div className="sticky top-10 space-y-6">
            
            {/* Items */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-zinc-200 rounded border border-zinc-300 overflow-hidden">
                  <img src={product1} alt="Product" className="w-full h-full object-cover" />
                </div>
                <span className="absolute -top-2 -right-2 bg-zinc-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">VVS Diamond Cuban Link</h4>
                <p className="text-xs text-zinc-500">14k Yellow Gold / 18 inch</p>
              </div>
              <span className="text-sm font-medium">£2,450.00</span>
            </div>

            <div className="border-t border-zinc-200 pt-6 space-y-4 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-medium text-black">£2,450.00</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span className="text-xs">Calculated at next step</span>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">Total</span>
                <span className="text-2xl font-medium">
                  <span className="text-xs text-zinc-500 font-normal mr-2">GBP</span>
                  £2,450.00
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}