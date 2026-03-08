import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/api";
import { useRoute } from "wouter";
import { Loader2 } from "lucide-react";

interface CmsPageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

export default function CMSPage() {
  const [, params] = useRoute("/page/:slug");
  const slug = params?.slug;

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
      </div>
    </div>
  );
}
