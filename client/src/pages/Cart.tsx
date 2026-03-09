import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { resolveAdminImage } from "@/lib/resolveImage";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-serif mb-10 text-center md:text-left" data-testid="text-cart-title">Your Bag</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <ShoppingBag className="w-20 h-20 text-white/15" />
            <p className="text-white/50 text-sm uppercase tracking-widest" data-testid="text-empty-cart">Your bag is empty</p>
            <Link href="/shop">
              <Button className="bg-primary text-white hover:bg-primary/90 rounded-none h-12 px-10 uppercase tracking-widest text-xs font-bold" data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <div className="hidden md:grid grid-cols-12 gap-4 uppercase tracking-widest text-xs text-white/50 border-b border-white/10 pb-4 mb-6">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              {items.map((item, idx) => {
                const imgSrc = resolveAdminImage(item.image) || item.image;
                return (
                  <div key={`${item.productId}-${idx}`} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-white/10 pb-6 mb-6" data-testid={`cart-item-${item.productId}`}>
                    <div className="col-span-1 md:col-span-6 flex gap-6">
                      <div className="w-24 h-24 bg-zinc-900 flex-shrink-0 overflow-hidden">
                        <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors cursor-pointer truncate" data-testid={`text-cart-item-name-${item.productId}`}>{item.name}</h3>
                        </Link>
                        {item.attributes && Object.entries(item.attributes).map(([k, v]) => (
                          <p key={k} className="text-white/50 text-xs mt-1">{k}: {v}</p>
                        ))}
                        <p className="text-primary font-bold text-sm mt-1 md:hidden">£{item.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 flex justify-between md:justify-center items-center">
                      <span className="md:hidden text-sm uppercase tracking-wider text-white/60">Quantity:</span>
                      <div className="flex items-center border border-white/20">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-3 py-2 text-white/60 hover:text-white"
                          data-testid={`button-decrease-${item.productId}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-3 py-2 text-white/60 hover:text-white"
                          data-testid={`button-increase-${item.productId}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 flex justify-between md:justify-end items-center">
                      <span className="md:hidden text-sm uppercase tracking-wider text-white/60">Total:</span>
                      <div className="flex items-center gap-6">
                        <span className="tracking-wider font-bold">£{(item.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-white/40 hover:text-red-500 transition-colors"
                          data-testid={`button-remove-${item.productId}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-full lg:w-96 bg-zinc-950 p-8 border border-white/5 h-fit sticky top-24">
              <h2 className="text-xl font-serif border-b border-white/10 pb-4 mb-6">Order Summary</h2>

              <div className="space-y-4 text-sm font-light text-white/80 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-white/50">Included in price</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-8">
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span className="text-primary font-bold" data-testid="text-cart-total">£{total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-primary text-white hover:bg-primary/90 rounded-none py-6 uppercase tracking-widest text-xs font-bold" data-testid="button-checkout">
                  Checkout
                </Button>
              </Link>

              <Link href="/shop">
                <button className="w-full text-center text-xs text-white/60 hover:text-white uppercase tracking-widest py-4 mt-2" data-testid="link-continue-shopping">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
