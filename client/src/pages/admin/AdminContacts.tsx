import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminContacts() {
  const { toast } = useToast();

  const { data: contacts = [], isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contacts"],
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/admin/contacts/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contacts"] });
      toast({ title: "Contact submission deleted" });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-heading text-white" data-testid="text-contacts-title">Contact Submissions</h1>
          {unreadCount > 0 && (
            <Badge className="bg-red-600 text-white" data-testid="badge-unread-count">{unreadCount} unread</Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className={`border-zinc-800 rounded-none ${contact.isRead ? "bg-zinc-900" : "bg-zinc-900 border-l-4 border-l-red-600"}`} data-testid={`card-contact-${contact.id}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {contact.isRead ? (
                      <MailOpen size={16} className="text-zinc-500" />
                    ) : (
                      <Mail size={16} className="text-red-500" />
                    )}
                    <span className="text-white font-medium" data-testid={`text-contact-name-${contact.id}`}>{contact.name}</span>
                    <span className="text-zinc-500 text-sm" data-testid={`text-contact-email-${contact.id}`}>{contact.email}</span>
                    {!contact.isRead && <Badge className="bg-red-600/20 text-red-400 text-xs">New</Badge>}
                  </div>
                  {contact.subject && (
                    <p className="text-zinc-300 text-sm font-medium mb-1" data-testid={`text-contact-subject-${contact.id}`}>{contact.subject}</p>
                  )}
                  <p className="text-zinc-400 text-sm whitespace-pre-wrap" data-testid={`text-contact-message-${contact.id}`}>{contact.message}</p>
                  <p className="text-zinc-600 text-xs mt-2">
                    {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : ""}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!contact.isRead && (
                    <Button variant="ghost" size="sm" onClick={() => markReadMutation.mutate(contact.id)} className="text-zinc-400 hover:text-white" data-testid={`button-mark-read-${contact.id}`}>
                      <MailOpen size={16} />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(contact.id)} className="text-zinc-400 hover:text-red-500" data-testid={`button-delete-contact-${contact.id}`}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {contacts.length === 0 && <p className="text-zinc-500 text-center py-10">No contact submissions yet</p>}
      </div>
    </div>
  );
}
