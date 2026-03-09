import product1png from "@/assets/product_1.png";
import product1jpg from "@/assets/product_1.jpg";
import product2png from "@/assets/product_2.png";
import product2jpg from "@/assets/product_2.jpg";
import product3png from "@/assets/product_3.png";
import product3jpg from "@/assets/product_3.jpg";
import catGrillzPng from "@/assets/cat-grillz.png";
import catGrillzJpg from "@/assets/cat-grillz.jpg";
import catBraceletsPng from "@/assets/cat-bracelets.png";
import catBraceletsJpg from "@/assets/cat-bracelets.jpg";
import catChainsPng from "@/assets/cat-chains.png";
import catChainsJpg from "@/assets/cat-chains.jpg";
import catRingsJpg from "@/assets/cat-rings.jpg";
import catRingsPng from "@/assets/cat-rings.png";
import heroPng from "@/assets/hero.png";
import heroJpg from "@/assets/hero.jpg";

const assetMap: Record<string, string> = {
  "/assets/product_1.png": product1png,
  "/assets/product_1.jpg": product1jpg,
  "/assets/product_2.png": product2png,
  "/assets/product_2.jpg": product2jpg,
  "/assets/product_3.png": product3png,
  "/assets/product_3.jpg": product3jpg,
  "/assets/cat-grillz.png": catGrillzPng,
  "/assets/cat-grillz.jpg": catGrillzJpg,
  "/assets/cat-bracelets.png": catBraceletsPng,
  "/assets/cat-bracelets.jpg": catBraceletsJpg,
  "/assets/cat-chains.png": catChainsPng,
  "/assets/cat-chains.jpg": catChainsJpg,
  "/assets/cat-rings.png": catRingsPng,
  "/assets/cat-rings.jpg": catRingsJpg,
  "/assets/hero.png": heroPng,
  "/assets/hero.jpg": heroJpg,
};

export function resolveAdminImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("/uploads/") || path.startsWith("http")) return path;
  if (assetMap[path]) return assetMap[path];
  if (path.startsWith("/assets/")) return "";
  return path;
}
