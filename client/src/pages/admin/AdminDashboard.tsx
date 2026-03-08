import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Mail,
  Package,
  TrendingUp,
  TrendingDown,
  Plus,
  FolderPlus,
  ClipboardList,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-zinc-900 border-zinc-800 animate-pulse">
              <CardContent className="p-5">
                <div className="h-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Orders",
      value: data?.orderCount || 0,
      icon: ShoppingCart,
      bgColor: "bg-blue-500/15",
      iconColor: "text-blue-400",
      change: "+12.5%",
      changeUp: true,
    },
    {
      title: "Total Revenue",
      value: `£${parseFloat(data?.revenue || "0").toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      bgColor: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      change: "+8.2%",
      changeUp: true,
    },
    {
      title: "Customers",
      value: data?.userCount || 0,
      icon: Users,
      bgColor: "bg-purple-500/15",
      iconColor: "text-purple-400",
      change: "+4.1%",
      changeUp: true,
    },
    {
      title: "Total Products",
      value: data?.productCount || 0,
      icon: Package,
      bgColor: "bg-amber-500/15",
      iconColor: "text-amber-400",
      change: "+2",
      changeUp: true,
    },
    {
      title: "Subscribers",
      value: data?.subscriberCount || 0,
      icon: Mail,
      bgColor: "bg-pink-500/15",
      iconColor: "text-pink-400",
      change: "+15.3%",
      changeUp: true,
    },
  ];

  const quickActions = [
    {
      label: "Add Product",
      href: "/admin/products/new",
      icon: Plus,
      description: "Create a new product listing",
      bgColor: "bg-blue-500/10 hover:bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      label: "Add Category",
      href: "/admin/categories/new",
      icon: FolderPlus,
      description: "Create a new category",
      bgColor: "bg-emerald-500/10 hover:bg-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      label: "View Orders",
      href: "/admin/orders",
      icon: ClipboardList,
      description: "Manage customer orders",
      bgColor: "bg-purple-500/10 hover:bg-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      label: "View Store",
      href: "/",
      icon: ExternalLink,
      description: "See your live storefront",
      bgColor: "bg-amber-500/10 hover:bg-amber-500/20",
      iconColor: "text-amber-400",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20";
      case "shipped":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/20";
      case "delivered":
        return "bg-green-500/15 text-green-400 border border-green-500/20";
      case "cancelled":
        return "bg-red-500/15 text-red-400 border border-red-500/20";
      case "pending":
        return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20";
      default:
        return "bg-zinc-500/15 text-zinc-400 border border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all duration-200"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`${stat.iconColor} h-5 w-5`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.changeUp ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {stat.changeUp ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p
                className="text-2xl font-bold text-white"
                data-testid={`text-stat-${stat.title.toLowerCase().replace(/\s/g, "-")}`}
              >
                {stat.value}
              </p>
              <p className="text-xs text-zinc-500 mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg font-semibold">
                  Recent Orders
                </CardTitle>
                <Link
                  href="/admin/orders"
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                  data-testid="link-view-all-orders"
                >
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {data?.recentOrders?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-3 px-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {data.recentOrders.map((order: any) => (
                        <tr
                          key={order.id}
                          className="hover:bg-zinc-800/30 transition-colors"
                        >
                          <td
                            className="py-3 px-3 font-mono text-xs text-zinc-300"
                            data-testid={`text-order-number-${order.id}`}
                          >
                            {order.orderNumber}
                          </td>
                          <td className="py-3 px-3 text-zinc-300">
                            {order.customerEmail || "—"}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusStyle(order.status)}`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-zinc-300 font-medium">
                            £{parseFloat(order.total).toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-xs text-zinc-500">
                            {new Date(order.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm">No orders yet</p>
                  <p className="text-zinc-600 text-xs mt-1">
                    Orders will appear here once customers make purchases
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg font-semibold">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  data-testid={`link-quick-action-${action.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <div
                    className={`flex items-center gap-3 p-3 rounded-lg ${action.bgColor} transition-all duration-200 cursor-pointer group`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-zinc-800/50 flex items-center justify-center">
                      <action.icon className={`h-4 w-4 ${action.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">
                        {action.label}
                      </p>
                      <p className="text-xs text-zinc-500">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
