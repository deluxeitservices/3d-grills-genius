import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/">
              <a className="text-2xl font-serif tracking-widest text-white mb-6 block">
                AURA<span className="text-primary">.</span>
              </a>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Crafting exceptional bespoke jewelry and premium grillz. Redefining luxury with every piece we create.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/shop"><a className="text-white/60 hover:text-primary transition-colors text-sm">All Products</a></Link></li>
              <li><Link href="/shop"><a className="text-white/60 hover:text-primary transition-colors text-sm">Custom Grillz</a></Link></li>
              <li><Link href="/shop"><a className="text-white/60 hover:text-primary transition-colors text-sm">Chains & Pendants</a></Link></li>
              <li><Link href="/shop"><a className="text-white/60 hover:text-primary transition-colors text-sm">Rings</a></Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/faq"><a className="text-white/60 hover:text-primary transition-colors text-sm">FAQ</a></Link></li>
              <li><Link href="/contact"><a className="text-white/60 hover:text-primary transition-colors text-sm">Contact Us</a></Link></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors text-sm">Shipping & Returns</a></Link></li>
              <li><a href="#" className="text-white/60 hover:text-primary transition-colors text-sm">Size Guide</a></Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-6">Newsletter</h4>
            <p className="text-white/60 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex items-center">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border-white/20 text-white rounded-none focus-visible:ring-primary focus-visible:border-primary rounded-l-md"
              />
              <Button className="rounded-none rounded-r-md bg-white text-black hover:bg-primary border border-white hover:border-primary w-12 px-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Aura Jewellery. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-white/40 text-xs">Terms of Service</span>
            <span className="text-white/40 text-xs">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}