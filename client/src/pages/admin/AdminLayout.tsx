import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link, Redirect } from "wouter";
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
  Mail,
  MessageSquare,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpeg";

const navSections = [
  {
    label: "Sales",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/contacts", label: "Contacts", icon: MessageSquare },
    ],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/banners", label: "Banners", icon: Image },
      { href: "/admin/cms", label: "CMS Pages", icon: FileText },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
      { href: "/admin/seo", label: "SEO", icon: Search },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

function getPageTitle(location: string): string {
  for (const section of navSections) {
    for (const item of section.items) {
      if (location === item.href || (item.href !== "/admin" && location.startsWith(item.href))) {
        return item.label;
      }
    }
  }
  return "Dashboard";
}

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
    return <Redirect to="/admin/login" />;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const pageTitle = getPageTitle(location);
  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : "A";

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-zinc-950 border-r border-zinc-800/60 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-zinc-800/60 shrink-0">
          <Link href="/admin" className="flex items-center gap-3" data-testid="link-admin-home">
            <img src={logo} alt="Logo" className="w-9 h-9 rounded-lg object-cover" />
            <span className="text-lg font-heading font-semibold text-white tracking-tight">Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navSections.map((section) => (
            <div key={section.label}>
              <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                {section.label}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-amber-500/10 text-amber-400 shadow-sm"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-800/70"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                      data-testid={`link-admin-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150 ${
                        isActive
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-zinc-800/50 text-zinc-500 group-hover:bg-zinc-700/50 group-hover:text-zinc-300"
                      }`}>
                        <item.icon size={16} />
                      </div>
                      <span className="flex-1">{item.label}</span>
                      {isActive && <ChevronRight size={14} className="text-amber-400/60" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 p-4 border-t border-zinc-800/60 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-zinc-300 font-medium truncate">{user.email}</div>
              <div className="text-[10px] text-zinc-500">Administrator</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800/70 rounded-lg text-sm"
            data-testid="button-admin-logout"
          >
            <LogOut size={15} className="mr-2" />
            Log out
          </Button>
          <div className="pt-3 border-t border-zinc-800/60 mt-3 text-center">
            <a href="https://deluxe-it-services.co.uk/" target="_blank" rel="noopener noreferrer" className="text-[10px] text-zinc-500 hover:text-amber-400 transition-colors" data-testid="link-developer-credit">
              Development by <span className="font-semibold">Deluxe IT Services</span>
            </a>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-14 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800/60 flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-zinc-400 hover:text-white transition-colors p-1"
              data-testid="button-toggle-sidebar"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-white font-heading font-semibold text-lg">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-amber-400 transition-colors"
              data-testid="link-view-store"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">View Store</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold">
              {userInitial}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-zinc-900">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
