import product1png from "@/assets/product_1.png";
import product1jpg from "@/assets/product_1.jpg";
import product2png from "@/assets/product_2.png";
import product2jpg from "@/assets/product_2.jpg";
import product3png from "@/assets/product_3.png";
import product3jpg from "@/assets/product_3.jpg";

const assetMap: Record<string, string> = {
  "/assets/product_1.png": product1png,
  "/assets/product_1.jpg": product1jpg,
  "/assets/product_2.png": product2png,
  "/assets/product_2.jpg": product2jpg,
  "/assets/product_3.png": product3png,
  "/assets/product_3.jpg": product3jpg,
};

export function resolveAdminImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("/uploads/") || path.startsWith("http")) return path;
  if (assetMap[path]) return assetMap[path];
  return path;
}
