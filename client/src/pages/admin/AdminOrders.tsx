import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusOptions = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default function AdminOrders() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/orders"],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest("PATCH", `/api/admin/orders/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({ title: "Order updated" });
      setSelectedOrder(null);
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const orders = data?.orders || [];
  const filtered = statusFilter === "all" ? orders : orders.filter((o: any) => o.status === statusFilter);

  const openOrder = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNotes(order.notes || "");
  };

  const handleUpdate = () => {
    if (!selectedOrder) return;
    updateMutation.mutate({ id: selectedOrder.id, data: { status: newStatus, notes } });
  };

  if (isLoading) return <div className="text-zinc-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-heading text-white" data-testid="text-orders-title">Orders</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="select-order-status-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500">
              <th className="text-left py-3 px-3">Order #</th>
              <th className="text-left py-3 px-3">Customer</th>
              <th className="text-left py-3 px-3">Status</th>
              <th className="text-right py-3 px-3">Total</th>
              <th className="text-left py-3 px-3">Date</th>
              <th className="text-right py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order: any) => (
              <tr key={order.id} className="border-b border-zinc-800/50 text-zinc-300 hover:bg-zinc-800/30">
                <td className="py-2 px-3 font-mono text-xs" data-testid={`text-admin-order-number-${order.id}`}>{order.orderNumber}</td>
                <td className="py-2 px-3">{order.customerEmail || "Guest"}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 text-xs rounded-none ${
                    order.status === "paid" ? "bg-green-900/30 text-green-400" :
                    order.status === "shipped" ? "bg-blue-900/30 text-blue-400" :
                    order.status === "delivered" ? "bg-emerald-900/30 text-emerald-400" :
                    order.status === "cancelled" ? "bg-red-900/30 text-red-400" :
                    order.status === "processing" ? "bg-purple-900/30 text-purple-400" :
                    "bg-yellow-900/30 text-yellow-400"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-3 text-right">{order.currency} {parseFloat(order.total).toFixed(2)}</td>
                <td className="py-2 px-3 text-xs text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => openOrder(order)} className="text-zinc-400 hover:text-white" data-testid={`button-view-order-${order.id}`}>
                    <Eye size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-zinc-500 text-center py-8">No orders found</p>}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white rounded-none max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Order {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500">Email</p>
                  <p className="text-white">{selectedOrder.customerEmail || "—"}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Total</p>
                  <p className="text-white">{selectedOrder.currency} {parseFloat(selectedOrder.total).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Date</p>
                  <p className="text-white">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Payment</p>
                  <p className="text-white text-xs">{selectedOrder.stripePaymentIntentId || "—"}</p>
                </div>
              </div>

              {selectedOrder.items?.length > 0 && (
                <div>
                  <p className="text-zinc-500 text-sm mb-2">Items</p>
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-zinc-800/50">
                      {item.productImage && <img src={item.productImage} alt="" className="w-10 h-10 object-cover" />}
                      <div className="flex-1">
                        <p className="text-white text-sm">{item.productName}</p>
                        <p className="text-zinc-500 text-xs">Qty: {item.quantity} × {parseFloat(item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedOrder.shippingAddress && (
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Shipping Address</p>
                  <p className="text-zinc-300 text-sm whitespace-pre-line">{typeof selectedOrder.shippingAddress === "object" ? JSON.stringify(selectedOrder.shippingAddress, null, 2) : selectedOrder.shippingAddress}</p>
                </div>
              )}

              <div className="border-t border-zinc-800 pt-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="select-order-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Notes</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white rounded-none" data-testid="input-order-notes" />
                </div>
                <Button onClick={handleUpdate} className="w-full bg-red-600 hover:bg-red-700 rounded-none" data-testid="button-update-order">
                  Update Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
