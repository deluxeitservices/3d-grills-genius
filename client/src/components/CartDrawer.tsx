import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, itemCount, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" data-testid="cart-drawer">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={() => setIsCartOpen(false)}
      />
      
      <div className="relative w-full max-w-md h-full bg-black border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-heading font-bold uppercase tracking-wider" data-testid="text-cart-title">
            Shopping Bag ({itemCount})
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-white hover:text-primary transition-colors"
            data-testid="button-close-cart"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-white/20 mb-4" />
              <p className="text-white/50 text-sm uppercase tracking-widest" data-testid="text-empty-cart">Your bag is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, idx) => (
                <div key={`${item.productId}-${idx}`} className="flex gap-4" data-testid={`cart-item-${item.productId}`}>
                  <div className="w-20 h-20 bg-zinc-900 flex-shrink-0 overflow-hidden">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.slug}`} onClick={() => setIsCartOpen(false)}>
                      <h3 className="text-xs font-bold uppercase tracking-wider truncate hover:text-primary transition-colors cursor-pointer">
                        {item.name}
                      </h3>
                    </Link>
                    {item.attributes && Object.entries(item.attributes).map(([k, v]) => (
                      <p key={k} className="text-[10px] text-white/50 mt-1">{k}: {v}</p>
                    ))}
                    <p className="text-primary font-bold text-sm mt-1">£{item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="text-white/50 hover:text-white"
                        data-testid={`button-decrease-${item.productId}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="text-white/50 hover:text-white"
                        data-testid={`button-increase-${item.productId}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto text-white/30 hover:text-red-500 text-[10px] uppercase tracking-wider"
                        data-testid={`button-remove-${item.productId}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider">Subtotal</span>
              <span className="text-lg font-bold text-primary" data-testid="text-cart-total">£{total.toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-white/50">Taxes and shipping calculated at checkout</p>
            <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
              <Button 
                className="w-full bg-primary text-white hover:bg-primary/90 rounded-none h-12 uppercase tracking-widest text-xs font-bold"
                data-testid="button-checkout"
              >
                Checkout
              </Button>
            </Link>
            <Link href="/cart" onClick={() => setIsCartOpen(false)}>
              <button 
                className="w-full text-center text-xs text-white/60 hover:text-white uppercase tracking-widest py-2"
                data-testid="link-view-cart"
              >
                View Bag
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
