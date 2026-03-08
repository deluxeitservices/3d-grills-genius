import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Mail, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSubscribers() {
  const { toast } = useToast();

  const { data: subscribers = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/subscribers"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/subscribers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscribers"] });
      toast({ title: "Subscriber removed" });
    },
  });

  const exportCSV = () => {
    const csv = "Email,Subscribed Date\n" + subscribers.map((s: any) => 
      `${s.email},${new Date(s.createdAt).toLocaleDateString()}`
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className="text-zinc-400">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading text-white" data-testid="text-subscribers-title">Newsletter Subscribers</h1>
          <p className="text-zinc-500 text-sm mt-1">{subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}</p>
        </div>
        {subscribers.length > 0 && (
          <Button onClick={exportCSV} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-none" data-testid="button-export-subscribers">
            <Download size={16} className="mr-2" /> Export CSV
          </Button>
        )}
      </div>

      <div className="grid gap-2">
        {subscribers.map((sub: any) => (
          <Card key={sub.id} className="bg-zinc-900 border-zinc-800 rounded-none">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center">
                  <Mail size={16} className="text-zinc-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm" data-testid={`text-subscriber-email-${sub.id}`}>{sub.email}</p>
                  <p className="text-xs text-zinc-500">
                    Subscribed {new Date(sub.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(sub.id)} className="text-zinc-400 hover:text-red-500" data-testid={`button-delete-subscriber-${sub.id}`}>
                <Trash2 size={16} />
              </Button>
            </CardContent>
          </Card>
        ))}
        {subscribers.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <Mail size={40} className="mx-auto mb-4 text-zinc-700" />
            <p>No subscribers yet</p>
            <p className="text-xs mt-1">Subscribers will appear here when customers sign up via the newsletter form on the website</p>
          </div>
        )}
      </div>
    </div>
  );
}
