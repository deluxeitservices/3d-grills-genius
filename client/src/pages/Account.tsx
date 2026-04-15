import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/api";
import { useLocation, Link } from "wouter";
import { Package, User, LogOut, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { resolveAdminImage } from "@/lib/resolveImage";

interface OrderItem {
  id: number;
  productName: string;
  productImage: string | null;
  quantity: number;
  price: string;
  attributes: Record<string, string> | null;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: string;
  currency: string;
  createdAt: string;
  items: OrderItem[];
}

export default function Account() {
  const { user, loading: authLoading, logout, updateProfile } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileInitialized, setProfileInitialized] = useState(false);

  const { data: ordersData, isLoading: ordersLoading } = useQuery<{ orders: Order[]; total: number }>({
    queryKey: ["/api/my/orders"],
    queryFn: getQueryFn("/api/my/orders"),
    enabled: !!user,
  });

  if (!profileInitialized && user) {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setPhone(user.phone || "");
    setProfileInitialized(true);
  }

  if (authLoading) {
    return (
      <div className="bg-black text-white min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const data: any = { firstName, lastName, phone };
      if (currentPassword && newPassword) {
        data.currentPassword = currentPassword;
        data.newPassword = newPassword;
      }
      await updateProfile(data);
      setCurrentPassword("");
      setNewPassword("");
      toast({ title: "Profile updated successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-900/30 text-yellow-300 border-yellow-500/30",
    paid: "bg-green-900/30 text-green-300 border-green-500/30",
    shipped: "bg-blue-900/30 text-blue-300 border-blue-500/30",
    delivered: "bg-emerald-900/30 text-emerald-300 border-emerald-500/30",
    cancelled: "bg-red-900/30 text-red-300 border-red-500/30",
  };

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 data-testid="text-account-title" className="text-3xl md:text-4xl font-serif">My Account</h1>
            <p className="text-white/60 mt-1">{user.email}</p>
          </div>
          <Button
            data-testid="button-logout"
            onClick={handleLogout}
            variant="outline"
            className="rounded-none border-white/20 text-white hover:bg-white/10 gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>

        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            data-testid="button-tab-orders"
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-2 text-sm uppercase tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === "orders" ? "text-white border-b-2 border-primary" : "text-white/40 hover:text-white/60"
            }`}
          >
            <Package className="w-4 h-4" /> Orders
          </button>
          <button
            data-testid="button-tab-profile"
            onClick={() => setActiveTab("profile")}
            className={`pb-4 px-2 text-sm uppercase tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === "profile" ? "text-white border-b-2 border-primary" : "text-white/40 hover:text-white/60"
            }`}
          >
            <User className="w-4 h-4" /> Profile
          </button>
        </div>

        {activeTab === "orders" && (
          <div>
            {ordersLoading ? (
              <div className="text-center text-white/60 py-12">Loading orders...</div>
            ) : !ordersData?.orders?.length ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-serif mb-2">No orders yet</h3>
                <p className="text-white/60 mb-6">Start shopping to see your orders here</p>
                <Link href="/shop">
                  <Button data-testid="button-shop-now" className="bg-white text-black hover:bg-zinc-200 rounded-none px-8 py-6 uppercase tracking-widest">
                    Shop Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {ordersData.orders.map((order) => (
                  <div key={order.id} data-testid={`card-order-${order.id}`} className="border border-white/10 bg-zinc-950 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <span data-testid={`text-order-number-${order.id}`} className="text-sm text-white/60">{order.orderNumber}</span>
                        <div className="text-lg font-medium">
                          {order.currency} {parseFloat(order.total).toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs uppercase tracking-wider px-3 py-1 border ${statusColors[order.status] || "bg-zinc-800 text-white/60 border-white/10"}`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-white/40">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 bg-zinc-900 px-3 py-2">
                          {item.productImage && (
                            <img src={resolveAdminImage(item.productImage)} alt={item.productName} className="w-10 h-10 object-cover" />
                          )}
                          <div>
                            <span className="text-sm">{item.productName}</span>
                            <span className="text-xs text-white/40 ml-2">x{item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <form onSubmit={handleProfileUpdate} className="max-w-lg space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">First Name</label>
                <Input
                  data-testid="input-profile-first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-zinc-900 border-white/10 text-white rounded-none py-6 focus-visible:border-primary focus-visible:ring-0"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">Last Name</label>
                <Input
                  data-testid="input-profile-last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-zinc-900 border-white/10 text-white rounded-none py-6 focus-visible:border-primary focus-visible:ring-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">Email</label>
              <Input
                type="email"
                value={user.email}
                disabled
                className="bg-zinc-900/50 border-white/5 text-white/40 rounded-none py-6"
              />
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">Phone</label>
              <Input
                data-testid="input-profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="bg-zinc-900 border-white/10 text-white rounded-none py-6 focus-visible:border-primary focus-visible:ring-0"
              />
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-serif mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">Current Password</label>
                  <Input
                    data-testid="input-current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="bg-zinc-900 border-white/10 text-white rounded-none py-6 focus-visible:border-primary focus-visible:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-wider text-white/60 mb-2">New Password</label>
                  <Input
                    data-testid="input-new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="bg-zinc-900 border-white/10 text-white rounded-none py-6 focus-visible:border-primary focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>

            <Button
              data-testid="button-save-profile"
              type="submit"
              disabled={profileLoading}
              className="bg-white text-black hover:bg-zinc-200 rounded-none py-6 px-8 uppercase tracking-widest font-medium"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
