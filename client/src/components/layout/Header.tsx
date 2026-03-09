import { Link, useLocation } from "wouter";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import logoImg from "@/assets/logo.jpeg";
import CartDrawer from "@/components/CartDrawer";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const { itemCount, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: categoriesData } = useQuery<any[]>({
    queryKey: ["/api/categories"],
    queryFn: getQueryFn("/api/categories"),
  });

  const categories = categoriesData || [];

  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-black border-b border-white/10 text-white">
        <div className="bg-muted text-black px-4 py-2 text-[10px] md:text-xs text-center font-bold uppercase tracking-widest">
          Free Worldwide Shipping on Orders Over £500
        </div>

        <div className="px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <button 
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="flex-shrink-0">
            <Link href="/" className="flex flex-col items-center gap-1 group" data-testid="link-logo">
              <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                <img src={logoImg} alt="Logo" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span 
                className="text-lg md:text-xl font-bold tracking-[0.15em] leading-none block uppercase bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-transparent bg-clip-text drop-shadow-sm"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                3D GRILLS GENIUS
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-10 text-[13px] font-bold tracking-widest uppercase font-heading">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            
            <div className="relative group py-6">
              <Link href="/shop" className="text-white flex items-center gap-1 group-hover:border-b-2 group-hover:border-white pb-1" data-testid="link-shop">
                SHOP <span className="text-[8px] group-hover:rotate-180 transition-transform duration-200">^</span>
              </Link>
              
              <div className="absolute top-full left-0 w-64 bg-black opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pt-2 pb-6">
                <ul className="flex flex-col space-y-5 px-4">
                  <li><Link href="/shop" className="block text-[15px] font-heading font-normal tracking-wide text-white/70 hover:text-white transition-colors" data-testid="link-shop-all">All Grillz</Link></li>
                  {categories.map((cat: any) => (
                    <li key={cat.id}>
                      <Link href={`/shop/${cat.slug}`} className="block text-[15px] font-heading font-normal tracking-wide text-white/70 hover:text-white transition-colors" data-testid={`link-shop-${cat.slug}`}>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="/about" className="hover:text-primary transition-colors">HOW IT WORKS</Link>
            <Link href="/about" className="hover:text-primary transition-colors">HOW TO USE MOULD KIT</Link>
            <Link href="/faq" className="hover:text-primary transition-colors">FAQS</Link>
          </nav>

          <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              className="hover:text-primary transition-colors"
              data-testid="button-search"
            >
              <Search className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <Link href={user ? "/account" : "/login"} className="hidden sm:block hover:text-primary transition-colors" data-testid="link-account">
              <User className="h-5 w-5 md:h-6 md:w-6" />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="hover:text-primary transition-colors flex items-center gap-2 relative"
              data-testid="button-cart"
            >
              <ShoppingBag className="h-5 w-5 md:h-6 md:w-6" />
              <span className="absolute -top-1 -right-2 text-[10px] font-bold bg-primary text-black rounded-full h-4 w-4 flex items-center justify-center" data-testid="text-cart-count">
                {itemCount}
              </span>
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="absolute top-full left-0 w-full bg-black border-b border-white/10 py-4 px-4 z-50">
            <form onSubmit={handleSearch} className="container mx-auto flex items-center gap-4">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent border-b border-white/30 text-white placeholder:text-white/40 py-2 text-lg focus:outline-none focus:border-white"
                data-testid="input-search"
              />
              <button type="submit" className="text-white hover:text-primary" data-testid="button-search-submit">
                <Search className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => setIsSearchOpen(false)} className="text-white/50 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}

        {isMobileMenuOpen && (
          <>
            <div className="lg:hidden fixed inset-0 top-0 bg-black/60 z-40" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="lg:hidden absolute top-full left-0 w-full bg-black border-b border-white/10 py-6 px-4 flex flex-col gap-6 z-50 max-h-[70vh] overflow-y-auto">
              <Link href="/shop" className="text-lg uppercase tracking-wider hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>All Grillz</Link>
              {categories.map((cat: any) => (
                <Link key={cat.id} href={`/shop/${cat.slug}`} className="text-lg uppercase tracking-wider hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                  {cat.name}
                </Link>
              ))}
              <Link href="/about" className="text-lg uppercase tracking-wider hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>How It Works</Link>
              <Link href="/faq" className="text-lg uppercase tracking-wider hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>FAQs</Link>
              <div className="h-px w-full bg-white/10 my-2"></div>
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search className="h-5 w-5 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent border-b border-white/20 text-white placeholder:text-white/40 py-1 focus:outline-none"
                  data-testid="input-search-mobile"
                />
              </form>
              <div className="flex items-center gap-6">
                <Link href={user ? "/account" : "/login"} className="flex items-center gap-2 hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="h-5 w-5" /> {user ? "Account" : "Login"}
                </Link>
              </div>
            </div>
          </>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
