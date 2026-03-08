import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setError("No session found");
      setLoading(false);
      return;
    }

    fetch(`/api/checkout/verify/${sessionId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setOrderNumber(data.orderNumber);
          clearCart();
        } else {
          setError("Payment could not be verified");
        }
      })
      .catch(() => setError("Failed to verify payment"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-white/60">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <p data-testid="text-checkout-error" className="text-red-400 mb-6">{error}</p>
          <Link href="/">
            <Button className="bg-white text-black hover:bg-zinc-200 rounded-none px-8 py-6 uppercase tracking-widest">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h1 data-testid="text-success-title" className="text-3xl md:text-4xl font-serif mb-4">Thank You!</h1>
        <p className="text-white/60 mb-2">Your order has been placed successfully.</p>
        {orderNumber && (
          <p data-testid="text-order-number" className="text-white/80 mb-8">
            Order Number: <span className="font-medium text-primary">{orderNumber}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account">
            <Button data-testid="button-view-orders" className="bg-white text-black hover:bg-zinc-200 rounded-none px-8 py-6 uppercase tracking-widest">
              View Orders
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
