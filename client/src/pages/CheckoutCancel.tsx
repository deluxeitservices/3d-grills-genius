import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { XCircle } from "lucide-react";

export default function CheckoutCancel() {
  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <XCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
        <h1 data-testid="text-cancel-title" className="text-3xl md:text-4xl font-serif mb-4">Order Cancelled</h1>
        <p className="text-white/60 mb-8">Your payment was cancelled. No charges have been made.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/cart">
            <Button data-testid="button-return-cart" className="bg-white text-black hover:bg-zinc-200 rounded-none px-8 py-6 uppercase tracking-widest">
              Return to Cart
            </Button>
          </Link>
          <Link href="/shop">
            <Button data-testid="button-continue-shopping" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-none px-8 py-6 uppercase tracking-widest">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
