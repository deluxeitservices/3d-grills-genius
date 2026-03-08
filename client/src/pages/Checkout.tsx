import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api";
import logoImg from "@/assets/logo.jpeg";

export default function Checkout() {
  const { items, total, itemCount } = useCart();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [country, setCountry] = useState("United Kingdom");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;

    setError("");
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/checkout/create-session", {
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          attributes: item.attributes,
        })),
        customerEmail: email,
        shippingAddress: {
          firstName,
          lastName,
          address,
          apartment,
          city,
          postcode,
          country,
          phone,
        },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || "Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
          <Link href="/shop">
            <Button className="bg-black text-white hover:bg-black/90 rounded-none px-8 py-6 uppercase tracking-widest">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black min-h-screen">
      <header className="py-6 border-b border-zinc-200">
        <div className="container mx-auto px-4 max-w-6xl flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img src={logoImg} alt="3D Grills Genius" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold tracking-[0.1em] uppercase bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-transparent bg-clip-text" style={{ fontFamily: "'Cinzel', serif" }}>
              3D GRILLS GENIUS
            </span>
          </Link>
          <Link href="/cart" data-testid="link-return-cart" className="text-sm flex items-center gap-1 text-zinc-500 hover:text-black transition-colors">
            <ChevronLeft className="w-4 h-4" /> Return to Cart
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl flex flex-col-reverse lg:flex-row min-h-[calc(100vh-85px)]">
        <div className="flex-1 px-4 lg:pr-12 py-10">
          <form className="space-y-10" onSubmit={handleCheckout}>
            {error && (
              <div data-testid="text-checkout-error" className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Contact</h2>
                {!user && (
                  <span className="text-sm text-zinc-500">
                    Have an account?{" "}
                    <Link href="/login" className="underline">Log in</Link>
                  </span>
                )}
              </div>
              <Input
                data-testid="input-checkout-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or mobile phone number"
                className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0"
                required
              />
            </div>

            <div>
              <h2 className="text-xl font-medium mb-4">Delivery</h2>
              <div className="space-y-4">
                <select
                  data-testid="select-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-12 bg-white border border-zinc-300 rounded-none px-3 focus:outline-none focus:border-black text-zinc-600"
                >
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Europe</option>
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    data-testid="input-checkout-first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0"
                    required
                  />
                  <Input
                    data-testid="input-checkout-last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0"
                    required
                  />
                </div>
                <Input
                  data-testid="input-checkout-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Address"
                  className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0"
                  required
                />
                <Input
                  data-testid="input-checkout-apartment"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="Apartment, suite, etc. (optional)"
                  className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    data-testid="input-checkout-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0"
                    required
                  />
                  <Input
                    data-testid="input-checkout-postcode"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="Postcode"
                    className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0"
                    required
                  />
                </div>
                <Input
                  data-testid="input-checkout-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  className="rounded-none py-6 border-zinc-300 focus-visible:border-black focus-visible:ring-0"
                />
              </div>
            </div>

            <Button
              data-testid="button-pay"
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white hover:bg-black/90 rounded-none py-7 text-lg font-light tracking-wide gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>

            <div className="pt-6 border-t border-zinc-200 text-xs text-zinc-500 space-x-4">
              <Link href="/page/refund-policy">Refund policy</Link>
              <Link href="/page/privacy-policy">Privacy policy</Link>
              <Link href="/page/terms-of-service">Terms of service</Link>
            </div>
          </form>
        </div>

        <div className="w-full lg:w-[45%] bg-zinc-50 border-l border-zinc-200 p-4 lg:pl-12 py-10">
          <div className="sticky top-10 space-y-6">
            {items.map((item, idx) => (
              <div key={`${item.productId}-${idx}`} className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-zinc-200 rounded border border-zinc-300 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -top-2 -right-2 bg-zinc-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 data-testid={`text-checkout-item-${item.productId}`} className="text-sm font-medium">{item.name}</h4>
                  {item.attributes && (
                    <p className="text-xs text-zinc-500">
                      {Object.entries(item.attributes).map(([k, v]) => `${v}`).join(" / ")}
                    </p>
                  )}
                </div>
                <span className="text-sm font-medium">
                  £{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="border-t border-zinc-200 pt-6 space-y-4 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-black">£{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span className="text-xs">Calculated at next step</span>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg">Total</span>
                <span className="text-2xl font-medium">
                  <span className="text-xs text-zinc-500 font-normal mr-2">GBP</span>
                  £{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
