import { Link } from "wouter";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.jpeg";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-white/10 text-white">
      {/* Announcement Bar */}
      <div className="bg-muted text-black px-4 py-2 text-[10px] md:text-xs text-center font-bold uppercase tracking-widest">
        Free Worldwide Shipping on Orders Over £500
      </div>

      <div className="px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 -ml-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo - Left */}
        <div className="flex-shrink-0">
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold text-xl">
                <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-lg md:text-xl font-heading font-bold tracking-widest leading-none block uppercase">3D GRILLS GENIUS</span>
              </div>
            </a>
          </Link>
        </div>

        {/* Navigation - Desktop (Center) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-10 text-[13px] font-bold tracking-widest uppercase font-heading">
          <Link href="/"><a className="hover:text-primary transition-colors">Home</a></Link>
          
          {/* Shop Dropdown */}
          <div className="relative group py-6">
            <Link href="/shop">
              <a className="text-white flex items-center gap-1 group-hover:border-b-2 group-hover:border-white pb-1">
                SHOP <span className="text-[8px] group-hover:rotate-180 transition-transform duration-200">^</span>
              </a>
            </Link>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 w-64 bg-black opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pt-2 pb-6">
              <ul className="flex flex-col space-y-5 px-4">
                <li><Link href="/shop"><a className="block text-[15px] font-heading font-normal tracking-wide text-white/70 hover:text-white transition-colors">All Grillz</a></Link></li>
                <li><Link href="/shop"><a className="block text-[15px] font-heading font-normal tracking-wide text-white/70 hover:text-white transition-colors">Single Grillz</a></Link></li>
                <li><Link href="/shop"><a className="block text-[15px] font-heading font-normal tracking-wide text-white/70 hover:text-white transition-colors">Set Of Gold Grillz</a></Link></li>
                <li><Link href="/shop"><a className="block text-[15px] font-heading font-normal tracking-wide text-white/70 hover:text-white transition-colors">Curves & Colour</a></Link></li>
                <li><Link href="/shop"><a className="block text-[15px] font-heading font-normal tracking-wide text-white/70 hover:text-white transition-colors">Diamond Grillz</a></Link></li>
                <li><Link href="/shop"><a className="block text-[15px] font-heading font-normal tracking-wide text-white/70 hover:text-white transition-colors">Custom Jewellery</a></Link></li>
                <li><Link href="/shop"><a className="block text-[15px] font-heading font-normal tracking-wide text-white/70 hover:text-white transition-colors">Extras</a></Link></li>
              </ul>
            </div>
          </div>

          <Link href="/about"><a className="hover:text-primary transition-colors">HOW IT WORKS</a></Link>
          <Link href="/about"><a className="hover:text-primary transition-colors">HOW TO USE MOULD KIT</a></Link>
          <Link href="/faq"><a className="hover:text-primary transition-colors">FAQS</a></Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
          <button className="hover:text-primary transition-colors"><Search className="h-5 w-5 md:h-6 md:w-6" /></button>
          <button className="hidden sm:block hover:text-primary transition-colors"><User className="h-5 w-5 md:h-6 md:w-6" /></button>
          <button className="hover:text-primary transition-colors flex items-center gap-2 relative">
            <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
            <span className="absolute -top-1 -right-2 text-[10px] font-bold bg-primary text-black rounded-full h-4 w-4 flex items-center justify-center">0</span>
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