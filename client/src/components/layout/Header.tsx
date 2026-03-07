import { Link } from "wouter";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80 border-b border-white/10 text-white">
      {/* Announcement Bar */}
      <div className="bg-primary text-black px-4 py-2 text-xs text-center font-medium uppercase tracking-wider">
        Free Worldwide Shipping on Orders Over £500
      </div>

      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 -ml-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide uppercase">
          <Link href="/shop"><a className="hover:text-primary transition-colors">Grillz</a></Link>
          <Link href="/shop"><a className="hover:text-primary transition-colors">Chains</a></Link>
          <Link href="/shop"><a className="hover:text-primary transition-colors">Rings</a></Link>
          <Link href="/about"><a className="hover:text-primary transition-colors">Bespoke</a></Link>
        </nav>

        {/* Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-4">
          <Link href="/">
            <a className="text-2xl md:text-3xl font-serif tracking-widest text-white">
              AURA<span className="text-primary">.</span>
            </a>
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="hidden md:block hover:text-primary transition-colors"><Search className="h-5 w-5" /></button>
          <button className="hidden md:block hover:text-primary transition-colors"><User className="h-5 w-5" /></button>
          <button className="hidden md:block hover:text-primary transition-colors"><Heart className="h-5 w-5" /></button>
          <button className="hover:text-primary transition-colors flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden md:block text-xs font-medium bg-primary text-black rounded-full h-4 w-4 flex items-center justify-center">0</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black border-b border-white/10 py-6 px-4 flex flex-col gap-6">
          <Link href="/shop"><a className="text-lg uppercase tracking-wider hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Grillz</a></Link>
          <Link href="/shop"><a className="text-lg uppercase tracking-wider hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Chains</a></Link>
          <Link href="/shop"><a className="text-lg uppercase tracking-wider hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Rings</a></Link>
          <Link href="/about"><a className="text-lg uppercase tracking-wider hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Bespoke</a></Link>
          <div className="h-px w-full bg-white/10 my-2"></div>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-primary transition-colors"><Search className="h-5 w-5" /> Search</button>
            <button className="flex items-center gap-2 hover:text-primary transition-colors"><User className="h-5 w-5" /> Account</button>
          </div>
        </div>
      )}
    </header>
  );
}