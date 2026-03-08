import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.jpeg";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter (Left side large column) */}
          <div className="lg:col-span-4">
            <Link href="/">
              <a className="flex flex-col items-center gap-2 mb-10 group w-fit">
                <div className="w-14 h-14 flex items-center justify-center">
                  <img src={logoImg} alt="Logo" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div>
                  <span 
                    className="text-2xl font-bold tracking-[0.15em] leading-none block uppercase bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-transparent bg-clip-text drop-shadow-sm"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    3D GRILLS GENIUS
                  </span>
                </div>
              </a>
            </Link>
            
            <h4 className="text-2xl font-heading font-bold uppercase tracking-wide mb-2 text-primary">LET'S GET IN TOUCH</h4>
            <p className="text-white text-sm font-bold mb-6">Sign up for our newsletter and receive 10% off your first order</p>
            <div className="flex flex-col gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white border-0 text-black rounded-none h-12 px-4 focus-visible:ring-0"
              />
              <Button className="rounded-none bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest h-12 px-8 w-fit transition-colors">
                Subscribe Now
              </Button>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Shop Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-primary">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/shop"><a className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">All Grillz</a></Link></li>
              <li><Link href="/shop"><a className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Single Grillz</a></Link></li>
              <li><Link href="/shop"><a className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Curves & Colour</a></Link></li>
              <li><Link href="/shop"><a className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Diamond Grillz</a></Link></li>
              <li><Link href="/shop"><a className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Set Of Gold Grillz</a></Link></li>
              <li><Link href="/shop"><a className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Tooth Gems</a></Link></li>
              <li><Link href="/shop"><a className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Extras</a></Link></li>
            </ul>
          </div>

          {/* Helpful Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-primary">Helpful</h4>
            <ul className="space-y-4">
              <li><Link href="/faq"><a className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">FAQs</a></Link></li>
              <li><Link href="/contact"><a className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Contact Us</a></Link></li>
              <li><Link href="/about"><a className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">How It Works</a></Link></li>
              <li><a href="#" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">How To Use Mould Kit</a></li>
              <li><a href="#" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Return & Exchanges</a></li>
              <li><a href="#" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Privacy Policy</a></li>
              <li><a href="#" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Terms Of Service</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-primary">Follow Us</h4>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-primary transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-primary transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-primary transition-all">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            
            {/* Scroll to top button */}
            <div className="mt-12 flex justify-end">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black hover:bg-white transition-all"
              >
                ↑
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}