import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, TrendingUp, Mail } from "lucide-react";

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/dashboard"],
  });

  if (isLoading) {
    return <div className="text-zinc-400">Loading dashboard...</div>;
  }

  const stats = [
    {
      title: "Total Orders",
      value: data?.orderCount || 0,
      icon: ShoppingCart,
      color: "text-blue-500",
    },
    {
      title: "Total Revenue",
      value: `£${parseFloat(data?.revenue || "0").toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Customers",
      value: data?.userCount || 0,
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Subscribers",
      value: data?.subscriberCount || 0,
      icon: Mail,
      color: "text-yellow-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-heading text-white mb-6" data-testid="text-dashboard-title">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-zinc-900 border-zinc-800 rounded-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 uppercase">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1" data-testid={`text-stat-${stat.title.toLowerCase().replace(/\s/g, "-")}`}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={`${stat.color} h-8 w-8`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-900 border-zinc-800 rounded-none">
        <CardHeader>
          <CardTitle className="text-white text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.recentOrders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500">
                    <th className="text-left py-2 px-3">Order #</th>
                    <th className="text-left py-2 px-3">Email</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-right py-2 px-3">Total</th>
                    <th className="text-left py-2 px-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order: any) => (
                    <tr key={order.id} className="border-b border-zinc-800/50 text-zinc-300">
                      <td className="py-2 px-3 font-mono text-xs" data-testid={`text-order-number-${order.id}`}>{order.orderNumber}</td>
                      <td className="py-2 px-3">{order.customerEmail || "—"}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 text-xs rounded-none ${
                          order.status === "paid" ? "bg-green-900/30 text-green-400" :
                          order.status === "shipped" ? "bg-blue-900/30 text-blue-400" :
                          order.status === "delivered" ? "bg-emerald-900/30 text-emerald-400" :
                          order.status === "cancelled" ? "bg-red-900/30 text-red-400" :
                          "bg-yellow-900/30 text-yellow-400"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">£{parseFloat(order.total).toFixed(2)}</td>
                      <td className="py-2 px-3 text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-zinc-500">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
