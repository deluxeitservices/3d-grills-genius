import { db } from "./db";
import { categories, products, productPrices, reviews, banners } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  const cats = await db.insert(categories).values([
    { name: "Single Grillz", slug: "single-grillz", description: "Individual tooth grillz for a subtle shine", sortOrder: 1, isActive: true },
    { name: "Gold Set Grillz", slug: "gold-set-grillz", description: "Complete sets of gold grillz for top and bottom teeth", sortOrder: 2, isActive: true },
    { name: "Diamond Grillz", slug: "diamond-grillz", description: "Premium diamond-encrusted grillz", sortOrder: 3, isActive: true },
    { name: "Curves & Colour", slug: "curves-colour", description: "Colourful and uniquely shaped grillz designs", sortOrder: 4, isActive: true },
    { name: "Tooth Gems", slug: "tooth-gems", description: "Sparkling gems to add to individual teeth", sortOrder: 5, isActive: true },
    { name: "Tooth Mould Kit", slug: "tooth-mould-kit", description: "DIY mould kits for custom-fit grillz", sortOrder: 6, isActive: true },
  ]).returning();

  console.log(`Created ${cats.length} categories`);

  const prods = await db.insert(products).values([
    {
      name: "Hello Kitty + Heart Set",
      slug: "hello-kitty-heart-set",
      description: "A playful and iconic Hello Kitty grillz set with heart accents. Crafted in premium gold with intricate detailing, this set features a cute Hello Kitty motif on one tooth and a heart design on another. Perfect for those who love bold, statement jewellery.",
      images: ["/assets/product_1.png"],
      categoryId: cats[1].id,
      quantity: 25,
      isActive: true,
      isFeatured: true,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping. International shipping available from £9.99. Delivery within 7-14 business days.",
      returnExchanges: "We accept returns within 14 days of delivery. Custom items can be adjusted for fit.",
    },
    {
      name: "Window And Heart Cap",
      slug: "window-and-heart-cap",
      description: "Elegant window-cut design paired with a heart-shaped cap grillz. Features an open-face window design that shows your natural tooth through the gold frame, combined with a solid heart cap on the adjacent tooth.",
      images: ["/assets/product_2.png"],
      categoryId: cats[0].id,
      quantity: 18,
      isActive: true,
      isFeatured: true,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping. International shipping available from £9.99.",
      returnExchanges: "14-day return policy. Custom items can be adjusted.",
    },
    {
      name: "Sparkle + Window Grillz Set",
      slug: "sparkle-window-grillz-set",
      description: "A dazzling combination of sparkle-finish and window-cut grillz. This set includes multiple teeth with a brilliant sparkle texture alongside open-face window designs. The contrast between the textured and open styles creates a unique look.",
      images: ["/assets/product_3.png"],
      categoryId: cats[1].id,
      quantity: 12,
      isActive: true,
      isFeatured: true,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping. International shipping available from £9.99.",
      returnExchanges: "14-day return policy. Custom items can be adjusted.",
    },
    {
      name: "London Bridge Design (Window Canines)",
      slug: "london-bridge-design",
      description: "Inspired by the iconic London Bridge, this grillz set features architectural window-cut canines with bridging gold bars. A sophisticated design for those who appreciate London's heritage with modern jewellery.",
      images: ["/assets/cat-grillz.png"],
      categoryId: cats[2].id,
      quantity: 15,
      isActive: true,
      isFeatured: true,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping. International shipping available from £9.99.",
      returnExchanges: "14-day return policy. Custom items can be adjusted.",
    },
    {
      name: "Classic Gold Single Tooth Cap",
      slug: "classic-gold-single-cap",
      description: "The timeless single tooth gold cap. A smooth, polished gold grillz that fits perfectly over one tooth. Ideal for first-time buyers or those who prefer a clean, minimal look.",
      images: ["/assets/product_1.png"],
      categoryId: cats[0].id,
      quantity: 50,
      isActive: true,
      isFeatured: false,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping.",
      returnExchanges: "14-day return policy.",
    },
    {
      name: "Diamond Dust Bottom 6",
      slug: "diamond-dust-bottom-6",
      description: "Six bottom teeth covered in diamond dust finish for maximum sparkle. Each tooth is hand-finished with a diamond dust texture that catches light from every angle. A favourite among artists and performers.",
      images: ["/assets/product_2.png"],
      categoryId: cats[2].id,
      quantity: 8,
      isActive: true,
      isFeatured: false,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 7-10 business days",
      shippingInfo: "Free UK shipping. International from £12.99.",
      returnExchanges: "14-day return policy. Diamond items require careful handling.",
    },
    {
      name: "Rose Gold Fangs Set",
      slug: "rose-gold-fangs-set",
      description: "Striking rose gold fang grillz for a bold vampire-inspired look. Features extended canine designs in beautiful rose gold, creating a fierce yet elegant aesthetic. Perfect for special occasions and photoshoots.",
      images: ["/assets/product_3.png"],
      categoryId: cats[3].id,
      quantity: 20,
      isActive: true,
      isFeatured: true,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping.",
      returnExchanges: "14-day return policy.",
    },
    {
      name: "Iced Out Full Set (Top & Bottom)",
      slug: "iced-out-full-set",
      description: "The ultimate statement piece — a full top and bottom set completely iced out with CZ stones. Every tooth is covered in brilliant-cut cubic zirconia for non-stop shine. For those who want to go all out.",
      images: ["/assets/cat-grillz.png"],
      categoryId: cats[2].id,
      quantity: 5,
      isActive: true,
      isFeatured: true,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 10-14 business days",
      shippingInfo: "Free express UK shipping. International from £14.99.",
      returnExchanges: "14-day return policy. Premium items include complimentary adjustments.",
    },
    {
      name: "Swarovski Crystal Tooth Gem (Single)",
      slug: "swarovski-crystal-tooth-gem",
      description: "A single Swarovski crystal gem bonded to your tooth for instant sparkle. Non-invasive application that lasts 6-12 months. Available in clear, pink, blue, and green crystal options.",
      images: ["/assets/product_1.png"],
      categoryId: cats[4].id,
      quantity: 100,
      isActive: true,
      isFeatured: false,
      howItWorks: "Visit our studio or a partnered dentist for professional application. Takes only 15 minutes.",
      shippingInfo: "Studio appointment required. Home kits available for £19.99 extra.",
      returnExchanges: "Non-refundable once applied. Replacement available if gem falls off within 30 days.",
    },
    {
      name: "Premium Mould Kit",
      slug: "premium-mould-kit",
      description: "Everything you need to take perfect tooth impressions at home. Includes dental-grade putty, mixing trays, instruction guide, and a prepaid return envelope. Required for all custom grillz orders.",
      images: ["/assets/product_2.png"],
      categoryId: cats[5].id,
      quantity: 200,
      isActive: true,
      isFeatured: false,
      howItWorks: "1. Mix the putty as instructed\n2. Press into the tray\n3. Bite down for 2 minutes\n4. Let set and send back to us",
      shippingInfo: "Free UK shipping. Dispatched within 24 hours.",
      returnExchanges: "Unused kits can be returned within 14 days for a full refund.",
    },
    {
      name: "Rainbow Chrome Top 4",
      slug: "rainbow-chrome-top-4",
      description: "Four top teeth in a stunning rainbow chrome finish. Each tooth transitions through different colours — gold, rose, silver, and blue — creating an eye-catching gradient effect.",
      images: ["/assets/product_3.png"],
      categoryId: cats[3].id,
      quantity: 10,
      isActive: true,
      isFeatured: false,
    },
    {
      name: "Solid Gold Bottom 8 Bar",
      slug: "solid-gold-bottom-8-bar",
      description: "A connected 8-tooth bottom bar in solid gold. Unlike individual caps, this piece connects all 8 front bottom teeth in one smooth bar for a seamless, ultra-clean look.",
      images: ["/assets/cat-grillz.png"],
      categoryId: cats[1].id,
      quantity: 7,
      isActive: true,
      isFeatured: false,
    },
  ]).returning();

  console.log(`Created ${prods.length} products`);

  const priceData = prods.flatMap((p, idx) => {
    const basePrices = [
      { gbp: 120, usd: 150, eur: 140 },
      { gbp: 260, usd: 325, eur: 300 },
      { gbp: 274, usd: 340, eur: 315 },
      { gbp: 240, usd: 300, eur: 278 },
      { gbp: 85, usd: 105, eur: 98 },
      { gbp: 480, usd: 600, eur: 555 },
      { gbp: 195, usd: 245, eur: 225 },
      { gbp: 850, usd: 1060, eur: 980 },
      { gbp: 35, usd: 45, eur: 40 },
      { gbp: 25, usd: 30, eur: 28 },
      { gbp: 320, usd: 400, eur: 370 },
      { gbp: 550, usd: 690, eur: 635 },
    ];
    const base = basePrices[idx] || { gbp: 100, usd: 125, eur: 115 };
    const hasDiscount = [1, 2, 5, 7].includes(idx);
    const discountFactor = 0.85;

    return [
      {
        productId: p.id,
        countryCode: "GB",
        currency: "GBP",
        price: base.gbp.toFixed(2),
        discountPrice: hasDiscount ? (base.gbp * discountFactor).toFixed(2) : null,
      },
      {
        productId: p.id,
        countryCode: "US",
        currency: "USD",
        price: base.usd.toFixed(2),
        discountPrice: hasDiscount ? (base.usd * discountFactor).toFixed(2) : null,
      },
      {
        productId: p.id,
        countryCode: "EU",
        currency: "EUR",
        price: base.eur.toFixed(2),
        discountPrice: hasDiscount ? (base.eur * discountFactor).toFixed(2) : null,
      },
    ];
  });

  await db.insert(productPrices).values(priceData);
  console.log(`Created ${priceData.length} product prices`);

  await db.insert(reviews).values([
    { author: "James R.", text: "icl these are the best grillz ive gotten from a jewellers defo my new plug", rating: 5, isActive: true },
    { author: "Ayesha M.", text: "I've never felt more confident with a piece of jewelry. The gold grillz I got are stunning—sleek, shiny, and crafted to perfection. I wear them everywhere and always get compliments.", rating: 5, isActive: true },
    { author: "Marcus L.", text: "The process was super easy, and the result was even better than I expected! My custom grillz fit perfectly, feel amazing, and have the perfect shine. 3D GRILLS GENIUS made sure I was happy with every detail. Totally worth it!", rating: 5, isActive: true },
    { author: "Sophia T.", text: "Ordered a single gold cap and it arrived within a week. Quality is insane for the price. Already planning my next order for a full set!", rating: 5, isActive: true },
    { author: "Daniel K.", text: "Got the diamond dust set for my birthday and I'm obsessed. The sparkle is unreal. Everyone keeps asking where I got them from.", rating: 5, isActive: true },
    { author: "Priya N.", text: "The mould kit was so easy to use. I was nervous about doing it at home but the instructions were clear and my grillz fit perfectly first time.", rating: 4, isActive: true },
  ]);
  console.log("Created 6 reviews");

  await db.insert(banners).values([
    {
      title: "LUXURY CUSTOM GRILLZ",
      subtitle: "Shop Grillz Now",
      image: "/assets/hero.png",
      link: "/shop",
      page: "home",
      sortOrder: 1,
      isActive: true,
    },
    {
      title: "MADE FOR YOU",
      subtitle: "Explore Custom Designs",
      image: "/assets/hero.png",
      link: "/shop",
      page: "mid",
      sortOrder: 1,
      isActive: true,
    },
  ]);
  console.log("Created 2 banners");

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
