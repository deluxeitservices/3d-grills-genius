import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();

  return (
    <div>
      <h1 className="text-2xl font-heading text-white mb-6" data-testid="text-settings-title">Settings</h1>

      <div className="grid gap-6">
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
