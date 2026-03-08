import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image,
  Star,
  FileText,
  ShoppingCart,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/cms", label: "CMS Pages", icon: FileText },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, logout } = useAuth();
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    navigate("/admin/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-black flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
          <Link href="/admin" className="text-xl font-heading text-white" data-testid="link-admin-home">
            Admin Panel
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-400">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-none text-sm transition-colors ${
                  isActive
                    ? "bg-red-600/20 text-red-500 border-l-2 border-red-500"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
                onClick={() => setSidebarOpen(false)}
                data-testid={`link-admin-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
          <div className="text-xs text-zinc-500 mb-2">{user.email}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-zinc-400 hover:text-white rounded-none"
            data-testid="button-admin-logout"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
          <Link href="/" className="block mt-2 text-xs text-zinc-500 hover:text-white transition-colors" data-testid="link-back-to-site">
            ← Back to site
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-zinc-400" data-testid="button-toggle-sidebar">
            <Menu size={24} />
          </button>
          <span className="ml-4 text-white font-heading">Admin</span>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
