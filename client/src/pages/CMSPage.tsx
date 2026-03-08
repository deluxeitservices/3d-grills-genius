import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/api";
import { useRoute, useLocation } from "wouter";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CmsPageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

const pathToSlugMap: Record<string, string> = {
  "/about": "how-it-works",
  "/contact": "contact-us",
  "/faq": "faq",
};

const subjectOptions = [
  "General Enquiry",
  "Order Support",
  "Custom Order",
  "Returns",
  "Other",
];

function ContactForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General Enquiry",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/contact", form),
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "General Enquiry", message: "" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-serif text-white mb-2" data-testid="text-contact-success">Thank You!</h3>
        <p className="text-white/60 mb-6">Your message has been sent successfully. We'll get back to you soon.</p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="border-white/20 text-white hover:bg-white/10" data-testid="button-send-another">
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto" data-testid="form-contact">
      <div className="space-y-2">
        <Label className="text-white/80">Name *</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-white/5 border-white/20 text-white rounded-none focus:border-primary"
          required
          data-testid="input-contact-name"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-white/80">Email *</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-white/5 border-white/20 text-white rounded-none focus:border-primary"
          required
          data-testid="input-contact-email"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-white/80">Subject</Label>
        <select
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full bg-white/5 border border-white/20 text-white rounded-none px-3 py-2 focus:border-primary focus:outline-none"
          data-testid="select-contact-subject"
        >
          {subjectOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-zinc-900">{opt}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label className="text-white/80">Message *</Label>
        <Textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="bg-white/5 border-white/20 text-white rounded-none focus:border-primary min-h-[150px]"
          required
          data-testid="input-contact-message"
        />
      </div>
      <Button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-none py-3"
        data-testid="button-submit-contact"
      >
        {mutation.isPending ? (
          <Loader2 size={16} className="mr-2 animate-spin" />
        ) : (
          <Send size={16} className="mr-2" />
        )}
        Send Message
      </Button>
    </form>
  );
}

export default function CMSPage() {
  const [, pageParams] = useRoute("/page/:slug");
  const [location] = useLocation();

  const slug = pageParams?.slug || pathToSlugMap[location] || location.replace("/", "");
  const isContactPage = slug === "contact-us";

  const { data: page, isLoading, error } = useQuery<CmsPageData>({
    queryKey: ["/api/cms", slug],
    queryFn: getQueryFn(`/api/cms/${slug}`),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="bg-black text-white min-h-screen pt-24 pb-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="bg-black text-white min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-serif mb-4">Page Not Found</h1>
          <p className="text-white/60">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 data-testid="text-cms-title" className="text-3xl md:text-4xl font-serif mb-10 text-center">{page.title}</h1>
        <div
          data-testid="text-cms-content"
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-serif prose-headings:text-white
            prose-p:text-white/80 prose-p:leading-relaxed
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-ul:text-white/80 prose-ol:text-white/80"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {isContactPage && (
          <div className="mt-16 border-t border-white/10 pt-12">
            <h2 className="text-2xl font-serif text-center mb-8" data-testid="text-contact-form-heading">Get In Touch</h2>
            <ContactForm />
          </div>
        )}
      </div>
    </div>
  );
}
