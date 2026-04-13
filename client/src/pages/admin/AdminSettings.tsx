import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Save, Loader2, CheckCircle, XCircle, CreditCard, Zap } from "lucide-react";

export default function AdminSettings() {
  const { toast } = useToast();

  const { data: stripeSettings, isLoading: stripeLoading } = useQuery<{
    publishableKey: string;
    secretKeyMasked: string;
    hasSecretKey: boolean;
    isConfigured: boolean;
  }>({
    queryKey: ["/api/admin/stripe-settings"],
  });

  const [publishableKey, setPublishableKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showPublishable, setShowPublishable] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (stripeSettings) {
      setPublishableKey(stripeSettings.publishableKey);
    }
  }, [stripeSettings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/stripe-settings", {
        publishableKey,
        secretKey,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stripe-settings"] });
      toast({ title: "Stripe keys saved successfully" });
      setTestResult(null);
    },
    onError: (err: Error) => {
      toast({ title: "Failed to save", description: err.message, variant: "destructive" });
    },
  });

  const handleTest = async () => {
    if (!secretKey || !secretKey.startsWith("sk_")) {
      setTestResult({ success: false, message: "Please enter a valid secret key starting with 'sk_'" });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await apiRequest("POST", "/api/admin/stripe-test", { secretKey });
      const data = await res.json();
      setTestResult({ success: true, message: data.message || "Connection successful" });
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || "Connection failed" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading text-white mb-6" data-testid="text-settings-title">Settings</h1>

      <div className="grid gap-6">
        <Card className="bg-zinc-900 border-zinc-800 rounded-none">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-red-500" />
              Payment / Stripe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-2 text-sm">
              {stripeLoading ? (
                <span className="text-zinc-500">Loading...</span>
              ) : stripeSettings?.isConfigured ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-500">Stripe keys configured</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500">Stripe keys not configured</span>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-zinc-400">Publishable Key</Label>
                <div className="relative mt-1">
                  <Input
                    type={showPublishable ? "text" : "password"}
                    value={publishableKey}
                    onChange={(e) => setPublishableKey(e.target.value)}
                    placeholder="pk_live_... or pk_test_..."
                    className="bg-zinc-800 border-zinc-700 text-white rounded-none pr-10 font-mono text-sm"
                    data-testid="input-stripe-publishable-key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPublishable(!showPublishable)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    data-testid="button-toggle-publishable"
                  >
                    {showPublishable ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-zinc-600 mt-1">Starts with pk_live_ or pk_test_</p>
              </div>

              <div>
                <Label className="text-zinc-400">Secret Key</Label>
                <div className="relative mt-1">
                  <Input
                    type={showSecret ? "text" : "password"}
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder={stripeSettings?.hasSecretKey ? stripeSettings.secretKeyMasked : "sk_live_... or sk_test_..."}
                    className="bg-zinc-800 border-zinc-700 text-white rounded-none pr-10 font-mono text-sm"
                    data-testid="input-stripe-secret-key"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    data-testid="button-toggle-secret"
                  >
                    {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-zinc-600 mt-1">Starts with sk_live_ or sk_test_</p>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3 text-sm flex items-center gap-2 ${
                  testResult.success
                    ? "bg-green-900/30 border border-green-800 text-green-400"
                    : "bg-red-900/30 border border-red-800 text-red-400"
                }`}
                data-testid="stripe-test-result"
              >
                {testResult.success ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0" />
                )}
                {testResult.message}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending || !publishableKey || !secretKey}
                className="bg-red-600 hover:bg-red-700 text-white rounded-none"
                data-testid="button-save-stripe"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Keys
              </Button>
              <Button
                onClick={handleTest}
                disabled={testing || !secretKey}
                variant="outline"
                className="border-zinc-700 text-white hover:bg-zinc-800 rounded-none"
                data-testid="button-test-stripe"
              >
                {testing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 rounded-none">
          <CardHeader>
            <CardTitle className="text-white text-lg">Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-500 text-sm">
              Store settings and configuration can be managed here. Use the navigation to manage products, categories, banners, and other content.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-400">Store Name</Label>
                <Input defaultValue="3D GRILLS GENIUS" className="bg-zinc-800 border-zinc-700 text-white rounded-none mt-1" readOnly data-testid="input-store-name" />
              </div>
              <div>
                <Label className="text-zinc-400">Currency</Label>
                <Input defaultValue="GBP" className="bg-zinc-800 border-zinc-700 text-white rounded-none mt-1" readOnly data-testid="input-store-currency" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 rounded-none">
          <CardHeader>
            <CardTitle className="text-white text-lg">Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "Products", href: "/admin/products" },
                { label: "Categories", href: "/admin/categories" },
                { label: "Banners", href: "/admin/banners" },
                { label: "Reviews", href: "/admin/reviews" },
                { label: "CMS Pages", href: "/admin/cms" },
                { label: "Orders", href: "/admin/orders" },
                { label: "SEO", href: "/admin/seo" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block p-3 bg-zinc-800 hover:bg-zinc-700 text-white text-center text-sm transition-colors"
                  data-testid={`link-settings-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
