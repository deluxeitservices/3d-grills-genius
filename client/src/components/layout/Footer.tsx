import { useState } from "react";
import { Link } from "wouter";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import logoImg from "@/assets/logo.jpeg";

export default function Footer() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    setSubscribing(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "Subscribed! You'll receive 10% off your first order." });
        setEmail("");
      } else {
        toast({ title: data.error || "Failed to subscribe", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to subscribe. Please try again.", variant: "destructive" });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-4">
            <Link href="/" className="flex flex-col items-center gap-2 mb-10 group w-fit">
              <div className="w-14 h-14 flex items-center justify-center">
                <img src={logoImg} alt="Logo" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
              </div>
              <span 
                className="text-2xl font-bold tracking-[0.15em] leading-none block uppercase bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-transparent bg-clip-text drop-shadow-sm"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                3D GRILLS GENIUS
              </span>
            </Link>
            
            <h4 className="text-2xl font-heading font-bold uppercase tracking-wide mb-2 text-primary">LET'S GET IN TOUCH</h4>
            <p className="text-white text-sm font-bold mb-6">Sign up for our newsletter and receive 10% off your first order</p>
            <div className="flex flex-col gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                className="bg-white border-0 text-black rounded-none h-12 px-4 focus-visible:ring-0"
                data-testid="input-newsletter-email"
              />
              <Button 
                onClick={handleSubscribe}
                disabled={subscribing}
                className="rounded-none bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-widest h-12 px-8 w-fit transition-colors" 
                data-testid="button-subscribe"
              >
                {subscribing ? "Subscribing..." : "Subscribe Now"}
              </Button>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1"></div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-primary">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">All Grillz</Link></li>
              <li><Link href="/shop/single-grillz" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Single Grillz</Link></li>
              <li><Link href="/shop/curves-colour" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Curves & Colour</Link></li>
              <li><Link href="/shop/diamond-grillz" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Diamond Grillz</Link></li>
              <li><Link href="/shop/gold-set-grillz" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Set Of Gold Grillz</Link></li>
              <li><Link href="/shop/tooth-gems" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Tooth Gems</Link></li>
              <li><Link href="/shop/tooth-mould-kit" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Extras</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6 text-primary">Helpful</h4>
            <ul className="space-y-4">
              <li><Link href="/page/faq" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">FAQs</Link></li>
              <li><Link href="/page/contact-us" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Contact Us</Link></li>
              <li><Link href="/page/how-it-works" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">How It Works</Link></li>
              <li><Link href="/page/how-to-use-mould-kit" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">How To Use Mould Kit</Link></li>
              <li><Link href="/page/return-exchanges" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Return & Exchanges</Link></li>
              <li><Link href="/page/privacy-policy" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Privacy Policy</Link></li>
              <li><Link href="/page/terms-of-service" className="text-white font-bold hover:text-primary transition-colors text-xs uppercase tracking-wide">Terms Of Service</Link></li>
            </ul>
          </div>

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
            
            <div className="mt-12 flex justify-end">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black hover:bg-white transition-all"
                data-testid="button-scroll-top"
              >
                ↑
              </button>
            </div>
          </div>
          
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <a href="https://deluxe-it-services.co.uk/" target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-primary transition-colors" data-testid="link-developer-credit-footer">
            Development by <span className="font-semibold">Deluxe IT Services</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
