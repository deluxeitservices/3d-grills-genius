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
import prodHelloKitty from "@/assets/prod-hello-kitty.png";
import prodWindowHeart from "@/assets/prod-window-heart.png";
import prodSparkleWindow from "@/assets/prod-sparkle-window.png";
import prodLondonBridge from "@/assets/prod-london-bridge.png";
import prodClassicGold from "@/assets/prod-classic-gold.png";
import prodDiamondDust from "@/assets/prod-diamond-dust.png";
import prodRoseGoldFangs from "@/assets/prod-rose-gold-fangs.png";
import prodIcedOut from "@/assets/prod-iced-out.png";
import prodSwarovskiGem from "@/assets/prod-swarovski-gem.png";
import prodMouldKit from "@/assets/prod-mould-kit.png";
import prodRainbowChrome from "@/assets/prod-rainbow-chrome.png";
import prodGoldBottomBar from "@/assets/prod-gold-bottom-bar.png";

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
  "/assets/prod-hello-kitty.png": prodHelloKitty,
  "/assets/prod-window-heart.png": prodWindowHeart,
  "/assets/prod-sparkle-window.png": prodSparkleWindow,
  "/assets/prod-london-bridge.png": prodLondonBridge,
  "/assets/prod-classic-gold.png": prodClassicGold,
  "/assets/prod-diamond-dust.png": prodDiamondDust,
  "/assets/prod-rose-gold-fangs.png": prodRoseGoldFangs,
  "/assets/prod-iced-out.png": prodIcedOut,
  "/assets/prod-swarovski-gem.png": prodSwarovskiGem,
  "/assets/prod-mould-kit.png": prodMouldKit,
  "/assets/prod-rainbow-chrome.png": prodRainbowChrome,
  "/assets/prod-gold-bottom-bar.png": prodGoldBottomBar,
};

export function resolveAdminImage(path: string): string {
  if (!path) return "";
  if (path.startsWith("/uploads/") || path.startsWith("http")) return path;
  if (assetMap[path]) return assetMap[path];
  if (path.startsWith("/assets/")) return "";
  return path;
}
