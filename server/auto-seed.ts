import { db } from "./db";
import { categories, products, productPrices, productAttributes, productAttributeValues, reviews, banners, cmsPages } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function autoSeed() {
  const existingCats = await db.select().from(categories);
  const existingProds = await db.select().from(products);
  const existingPrices = await db.select().from(productPrices);
  const existingVariants = await db.select().from(productAttributeValues);
  const existingReviews = await db.select().from(reviews);
  const existingBanners = await db.select().from(banners);
  const existingCms = await db.select().from(cmsPages);

  if (existingCats.length >= 6 && existingProds.length >= 12 && existingPrices.length >= 36
      && existingVariants.length >= 120 && existingReviews.length >= 6
      && existingBanners.length >= 2 && existingCms.length >= 8) {
    console.log("Database already seeded, skipping auto-seed");
    return;
  }

  console.log("Auto-seeding database (filling missing data)...");

  let cats = existingCats;
  if (existingCats.length === 0) {
    cats = await db.insert(categories).values([
      { name: "Single Grillz", slug: "single-grillz", image: "/assets/cat-grillz.png", description: "Individual tooth grillz for a subtle shine", sortOrder: 1, isActive: true },
      { name: "Gold Set Grillz", slug: "gold-set-grillz", image: "/assets/cat-chains.png", description: "Complete sets of gold grillz for top and bottom teeth", sortOrder: 2, isActive: true },
      { name: "Diamond Grillz", slug: "diamond-grillz", image: "/assets/cat-rings.png", description: "Premium diamond-encrusted grillz", sortOrder: 3, isActive: true },
      { name: "Curves & Colour", slug: "curves-colour", image: "/assets/cat-bracelets.png", description: "Colourful and uniquely shaped grillz designs", sortOrder: 4, isActive: true },
      { name: "Tooth Gems", slug: "tooth-gems", image: "/assets/product_1.png", description: "Sparkling gems to add to individual teeth", sortOrder: 5, isActive: true },
      { name: "Tooth Mould Kit", slug: "tooth-mould-kit", image: "/assets/product_2.png", description: "DIY mould kits for custom-fit grillz", sortOrder: 6, isActive: true },
    ]).returning();
    console.log(`Created ${cats.length} categories`);
  } else {
    console.log(`Categories already exist (${cats.length}), skipping`);
    const catImageMap: Record<string, string> = {
      "single-grillz": "/assets/cat-grillz.png",
      "gold-set-grillz": "/assets/cat-chains.png",
      "diamond-grillz": "/assets/cat-rings.png",
      "curves-colour": "/assets/cat-bracelets.png",
      "tooth-gems": "/assets/product_1.png",
      "tooth-mould-kit": "/assets/product_2.png",
    };
    for (const cat of cats) {
      const expected = catImageMap[cat.slug];
      if (expected && cat.image !== expected) {
        await db.update(categories).set({ image: expected }).where(eq(categories.id, cat.id));
        console.log(`Updated category image: ${cat.slug} -> ${expected}`);
      }
    }
  }

  const catBySlug = (slug: string) => cats.find(c => c.slug === slug);

  let prods = existingProds;
  if (existingProds.length === 0) {
    prods = await db.insert(products).values([
    {
      name: "Hello Kitty + Heart Set",
      slug: "hello-kitty-heart-set",
      description: "A playful and iconic Hello Kitty grillz set with heart accents. Crafted in premium gold with intricate detailing, this set features a cute Hello Kitty motif on one tooth and a heart design on another. Perfect for those who love bold, statement jewellery.",
      images: ["/assets/product_1.png"],
      categoryId: catBySlug("curves-colour")?.id,
      quantity: 25,
      isActive: true,
      isFeatured: true,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping. International shipping available from £9.99. Delivery within 7-14 business days.",
      returnExchanges: "We accept returns within 14 days of delivery. Custom items can be adjusted for fit.",
      trustBadge: "Shipping protected, mould kit ready to ship",
    },
    {
      name: "Window And Heart Cap",
      slug: "window-and-heart-cap",
      description: "Elegant window-cut design paired with a heart-shaped cap grillz. Features an open-face window design that shows your natural tooth through the gold frame, combined with a solid heart cap on the adjacent tooth.",
      images: ["/assets/product_2.png"],
      categoryId: catBySlug("single-grillz")?.id,
      quantity: 18,
      shippingCharges: "10.00",
      taxPercentage: "20.00",
      isActive: true,
      isFeatured: true,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping. International shipping available from £9.99.",
      returnExchanges: "14-day return policy. Custom items can be adjusted.",
      trustBadge: "Shipping protected, mould kit ready to ship",
    },
    {
      name: "Sparkle + Window Grillz Set",
      slug: "sparkle-window-grillz-set",
      description: "A dazzling combination of sparkle-finish and window-cut grillz. This set includes multiple teeth with a brilliant sparkle texture alongside open-face window designs. The contrast between the textured and open styles creates a unique look.",
      images: ["/assets/product_3.png"],
      categoryId: catBySlug("gold-set-grillz")?.id,
      quantity: 12,
      shippingCharges: "10.00",
      taxPercentage: "20.00",
      isActive: true,
      isFeatured: true,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping. International shipping available from £9.99.",
      returnExchanges: "14-day return policy. Custom items can be adjusted.",
      trustBadge: "Shipping protected, mould kit ready to ship",
    },
    {
      name: "London Bridge Design (Window Canines)",
      slug: "london-bridge-design",
      description: "Inspired by the iconic London Bridge, this grillz set features architectural window-cut canines with bridging gold bars. A sophisticated design for those who appreciate London's heritage with modern jewellery.",
      images: ["/assets/cat-grillz.png"],
      categoryId: catBySlug("diamond-grillz")?.id,
      quantity: 15,
      isActive: true,
      isFeatured: true,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping. International shipping available from £9.99.",
      returnExchanges: "14-day return policy. Custom items can be adjusted.",
      trustBadge: "Shipping protected, mould kit ready to ship",
    },
    {
      name: "Classic Gold Single Tooth Cap",
      slug: "classic-gold-single-tooth-cap",
      description: "The timeless single tooth gold cap. A smooth, polished gold grillz that fits perfectly over one tooth. Ideal for first-time buyers or those who prefer a clean, minimal look.",
      images: ["/assets/product_1.png"],
      categoryId: catBySlug("single-grillz")?.id,
      quantity: 50,
      shippingCharges: "10.00",
      taxPercentage: "20.00",
      isActive: true,
      isFeatured: false,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping.",
      returnExchanges: "14-day return policy.",
      trustBadge: "Shipping protected, mould kit ready to ship",
    },
    {
      name: "Diamond Dust Bottom 6",
      slug: "diamond-dust-bottom-6",
      description: "Six bottom teeth covered in diamond dust finish for maximum sparkle. Each tooth is hand-finished with a diamond dust texture that catches light from every angle. A favourite among artists and performers.",
      images: ["/assets/product_2.png"],
      categoryId: catBySlug("diamond-grillz")?.id,
      quantity: 8,
      isActive: true,
      isFeatured: false,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 7-10 business days",
      shippingInfo: "Free UK shipping. International from £12.99.",
      returnExchanges: "14-day return policy. Diamond items require careful handling.",
      trustBadge: "Shipping protected, mould kit ready to ship",
    },
    {
      name: "Rose Gold Fangs Set",
      slug: "rose-gold-fangs-set",
      description: "Striking rose gold fang grillz for a bold vampire-inspired look. Features extended canine designs in beautiful rose gold, creating a fierce yet elegant aesthetic. Perfect for special occasions and photoshoots.",
      images: ["/assets/product_3.png"],
      categoryId: catBySlug("curves-colour")?.id,
      quantity: 20,
      isActive: true,
      isFeatured: true,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping.",
      returnExchanges: "14-day return policy.",
      trustBadge: "Shipping protected, mould kit ready to ship",
    },
    {
      name: "Iced Out Full Set (Top & Bottom)",
      slug: "iced-out-full-set",
      description: "The ultimate statement piece — a full top and bottom set completely iced out with CZ stones. Every tooth is covered in brilliant-cut cubic zirconia for non-stop shine. For those who want to go all out.",
      images: ["/assets/cat-grillz.png"],
      categoryId: catBySlug("diamond-grillz")?.id,
      quantity: 5,
      isActive: true,
      isFeatured: true,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 10-14 business days",
      shippingInfo: "Free express UK shipping. International from £14.99.",
      returnExchanges: "14-day return policy. Premium items include complimentary adjustments.",
      trustBadge: "Shipping protected, mould kit ready to ship",
    },
    {
      name: "Swarovski Crystal Tooth Gem (Single)",
      slug: "swarovski-crystal-tooth-gem",
      description: "A single Swarovski crystal gem bonded to your tooth for instant sparkle. Non-invasive application that lasts 6-12 months. Available in clear, pink, blue, and green crystal options.",
      images: ["/assets/product_1.png"],
      categoryId: catBySlug("tooth-gems")?.id,
      quantity: 100,
      isActive: true,
      isFeatured: false,
      howItWorks: "Visit our studio or a partnered dentist for professional application. Takes only 15 minutes.",
      shippingInfo: "Studio appointment required. Home kits available for £19.99 extra.",
      returnExchanges: "Non-refundable once applied. Replacement available if gem falls off within 30 days.",
      trustBadge: "Shipping protected, mould kit ready to ship",
    },
    {
      name: "Premium Mould Kit",
      slug: "premium-mould-kit",
      description: "Everything you need to take perfect tooth impressions at home. Includes dental-grade putty, mixing trays, instruction guide, and a prepaid return envelope. Required for all custom grillz orders.",
      images: ["/assets/product_2.png"],
      categoryId: catBySlug("tooth-mould-kit")?.id,
      quantity: 200,
      shippingCharges: "10.00",
      taxPercentage: "20.00",
      isActive: true,
      isFeatured: false,
      howItWorks: "1. Mix the putty as instructed\n2. Press into the tray\n3. Bite down for 2 minutes\n4. Let set and send back to us",
      shippingInfo: "Free UK shipping. Dispatched within 24 hours.",
      returnExchanges: "Unused kits can be returned within 14 days for a full refund.",
      trustBadge: "Shipping protected, mould kit ready to ship",
    },
    {
      name: "Rainbow Chrome Top 4",
      slug: "rainbow-chrome-top-4",
      description: "Four top teeth in a stunning rainbow chrome finish. Each tooth transitions through different colours — gold, rose, silver, and blue — creating an eye-catching gradient effect.",
      images: ["/assets/product_3.png"],
      categoryId: catBySlug("curves-colour")?.id,
      quantity: 10,
      isActive: true,
      isFeatured: false,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping. International shipping available from £9.99.",
      returnExchanges: "14-day return policy. Custom items can be adjusted.",
      trustBadge: "Shipping protected, mould kit ready to ship",
    },
    {
      name: "Solid Gold Bottom 8 Bar",
      slug: "solid-gold-bottom-8-bar",
      description: "A connected 8-tooth bottom bar in solid gold. Unlike individual caps, this piece connects all 8 front bottom teeth in one smooth bar for a seamless, ultra-clean look.",
      images: ["/assets/cat-grillz.png"],
      categoryId: catBySlug("gold-set-grillz")?.id,
      quantity: 7,
      isActive: true,
      isFeatured: false,
      howItWorks: "1. Order your mould kit\n2. Take impressions at home\n3. Send moulds back to us\n4. Receive your custom grillz in 5-7 business days",
      shippingInfo: "Free UK shipping. International shipping available from £9.99.",
      returnExchanges: "14-day return policy. Custom items can be adjusted.",
      trustBadge: "Shipping protected, mould kit ready to ship",
    },
    ]).returning();
    console.log(`Created ${prods.length} products`);
  } else {
    console.log(`Products already exist (${prods.length}), skipping`);
  }

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

  if (existingPrices.length === 0) {
    const priceData = prods.flatMap((p, idx) => {
      const base = basePrices[idx];
      const hasDiscount = [1, 2, 5, 7].includes(idx);
      const discountFactor = 0.85;
      return [
        { productId: p.id, countryCode: "GB", currency: "GBP", price: base.gbp.toFixed(2), discountPrice: hasDiscount ? (base.gbp * discountFactor).toFixed(2) : null },
        { productId: p.id, countryCode: "US", currency: "USD", price: base.usd.toFixed(2), discountPrice: hasDiscount ? (base.usd * discountFactor).toFixed(2) : null },
        { productId: p.id, countryCode: "EU", currency: "EUR", price: base.eur.toFixed(2), discountPrice: hasDiscount ? (base.eur * discountFactor).toFixed(2) : null },
      ];
    });
    await db.insert(productPrices).values(priceData);
    console.log(`Created ${priceData.length} product prices`);
  } else {
    console.log(`Product prices already exist (${existingPrices.length}), skipping`);
  }

  if (existingVariants.length === 0) {
    let metalAttr = (await db.select().from(productAttributes))[0];
    if (!metalAttr) {
      const [created] = await db.insert(productAttributes).values({
        name: "Metal & Stone Type",
        values: [],
      }).returning();
      metalAttr = created;
    }

    const variants = [
      { value: "Silver & Real Diamond", priceModifier: "0" },
      { value: "Silver & Cz", priceModifier: "20" },
      { value: "Dental Yellow Gold & Cz", priceModifier: "50" },
      { value: "Dental Yellow Gold & Real Diamonds", priceModifier: "100" },
      { value: "Dental White Gold & Cz", priceModifier: "50" },
      { value: "Dental White Gold & Real Diamonds", priceModifier: "100" },
      { value: "14k Yellow Gold & Cz", priceModifier: "150" },
      { value: "14k Yellow Gold & Real Diamonds", priceModifier: "200" },
      { value: "14k Rose Gold & Cz", priceModifier: "150" },
      { value: "14k Rose Gold & Real Diamonds", priceModifier: "200" },
    ];

    const variantData = prods.flatMap(p =>
      variants.map(v => ({
        productId: p.id,
        attributeId: metalAttr.id,
        value: v.value,
        priceModifier: v.priceModifier,
      }))
    );
    await db.insert(productAttributeValues).values(variantData);
    console.log(`Created ${variantData.length} product attribute values`);
  } else {
    console.log(`Product variants already exist (${existingVariants.length}), skipping`);
  }

  if (existingReviews.length === 0) {
    await db.insert(reviews).values([
    { author: "James R.", text: "icl these are the best grillz ive gotten from a jewellers defo my new plug", rating: 5, isActive: true },
    { author: "Ayesha M.", text: "I've never felt more confident with a piece of jewelry. The gold grillz I got are stunning—sleek, shiny, and crafted to perfection. I wear them everywhere and always get compliments.", rating: 5, isActive: true },
    { author: "Marcus L.", text: "The process was super easy, and the result was even better than I expected! My custom grillz fit perfectly, feel amazing, and have the perfect shine. 3D GRILLS GENIUS made sure I was happy with every detail. Totally worth it!", rating: 5, isActive: true },
    { author: "Sophia T.", text: "Ordered a single gold cap and it arrived within a week. Quality is insane for the price. Already planning my next order for a full set!", rating: 5, isActive: true },
    { author: "Daniel K.", text: "Got the diamond dust set for my birthday and I'm obsessed. The sparkle is unreal. Everyone keeps asking where I got them from.", rating: 5, isActive: true },
    { author: "Priya N.", text: "The mould kit was so easy to use. I was nervous about doing it at home but the instructions were clear and my grillz fit perfectly first time.", rating: 4, isActive: true },
    ]);
    console.log("Created 6 reviews");
  } else {
    console.log(`Reviews already exist (${existingReviews.length}), skipping`);
  }

  if (existingBanners.length === 0) {
    await db.insert(banners).values([
      { title: "LUXURY CUSTOM GRILLZ", subtitle: "Shop Grillz Now", image: "/assets/hero.png", link: "/shop", page: "home", sortOrder: 1, isActive: true },
      { title: "MADE FOR YOU", subtitle: "Explore Custom Designs", image: "/assets/hero.png", link: "/shop", page: "mid", sortOrder: 1, isActive: true },
    ]);
    console.log("Created 2 banners");
  } else {
    console.log(`Banners already exist (${existingBanners.length}), skipping`);
  }

  if (existingCms.length === 0) {
    const cmsPageData = [
    {
      title: "FAQs", slug: "faq", isActive: true,
      content: `<h2>Frequently Asked Questions</h2>
<h3>What are grillz?</h3>
<p>Grillz are decorative covers, often made of gold, silver, or jewel-encrusted precious metals, that snap over one or more teeth. They are a form of jewellery and a fashion statement.</p>
<h3>How do I order custom grillz?</h3>
<p>It's simple! First, order a mould kit from our store. Take your tooth impressions at home following our easy instructions, then send the moulds back to us. We'll craft your custom grillz and ship them to you within 5-14 business days depending on the design.</p>
<h3>Do grillz damage your teeth?</h3>
<p>When made professionally and worn responsibly, grillz should not damage your teeth. Our grillz are custom-fitted to your teeth for comfort and safety. We recommend removing them before eating and cleaning them regularly.</p>
<h3>What materials do you use?</h3>
<p>We use high-quality materials including 10K, 14K, and 18K gold, sterling silver, and premium cubic zirconia stones. All our materials are dental-safe and hypoallergenic.</p>
<h3>How long do grillz last?</h3>
<p>With proper care, gold grillz can last a lifetime. We recommend cleaning them regularly and storing them in the provided case when not in use.</p>
<h3>Can I eat with my grillz on?</h3>
<p>We recommend removing your grillz before eating to maintain their quality and shine. Food particles can get trapped and cause buildup if worn while eating.</p>
<h3>How do I clean my grillz?</h3>
<p>Clean your grillz with warm water and a soft toothbrush. You can also use non-abrasive jewellery cleaner. Avoid harsh chemicals or abrasive materials.</p>
<h3>Do you ship internationally?</h3>
<p>Yes! We ship worldwide. UK shipping is free on all orders. International shipping starts from £9.99 depending on your location.</p>
<h3>What is your return policy?</h3>
<p>We accept returns within 14 days of delivery. Custom-made items can be adjusted for fit free of charge. Please see our Return & Exchanges page for full details.</p>`,
    },
    {
      title: "Contact Us", slug: "contact-us", isActive: true,
      content: `<h2>Get In Touch</h2>
<p>We'd love to hear from you! Whether you have a question about our products, need help with an order, or want to discuss a custom design, our team is here to help.</p>
<h3>Email</h3>
<p>For general enquiries: <strong>info@3dgrillsgenius.com</strong></p>
<p>For order support: <strong>orders@3dgrillsgenius.com</strong></p>
<h3>Social Media</h3>
<p>Follow us on Instagram, Facebook, and YouTube for the latest designs, behind-the-scenes content, and exclusive offers.</p>
<h3>Business Hours</h3>
<p>Monday - Friday: 9:00 AM - 6:00 PM (GMT)<br>Saturday: 10:00 AM - 4:00 PM (GMT)<br>Sunday: Closed</p>
<h3>Custom Orders</h3>
<p>Looking for something truly unique? We specialise in custom designs. Send us your idea and we'll work with you to bring it to life. Contact us at <strong>custom@3dgrillsgenius.com</strong> with your design concept.</p>`,
    },
    {
      title: "How It Works", slug: "how-it-works", isActive: true,
      content: `<h2>How It Works</h2>
<p>Getting your custom grillz from 3D GRILLS GENIUS is easy. Follow these simple steps:</p>
<h3>Step 1: Choose Your Design</h3>
<p>Browse our collection and choose from our range of designs, or contact us for a fully custom piece. Select your preferred metal, stones, and style.</p>
<h3>Step 2: Order Your Mould Kit</h3>
<p>Once you've placed your order, we'll send you a professional mould kit. This contains everything you need to take perfect impressions of your teeth at home.</p>
<h3>Step 3: Take Your Impressions</h3>
<p>Follow our step-by-step instructions to take your tooth impressions. It only takes about 5 minutes and doesn't require any dental visits.</p>
<h3>Step 4: Send Your Moulds Back</h3>
<p>Use the prepaid return envelope included in your kit to send your moulds back to us. We'll start crafting your grillz as soon as we receive them.</p>
<h3>Step 5: Receive Your Grillz</h3>
<p>Your custom grillz will be handcrafted by our skilled jewellers and shipped to you within 5-14 business days. Each piece is quality-checked before dispatch.</p>
<h3>Perfect Fit Guarantee</h3>
<p>If your grillz don't fit perfectly, we'll adjust them free of charge. Your satisfaction is our priority.</p>`,
    },
    {
      title: "How To Use Mould Kit", slug: "how-to-use-mould-kit", isActive: true,
      content: `<h2>How To Use Your Mould Kit</h2>
<p>Follow these instructions carefully to ensure a perfect fit for your custom grillz.</p>
<h3>What's In The Kit</h3>
<ul><li>2 x dental putty containers (base + catalyst)</li><li>2 x impression trays (top and bottom)</li><li>Instruction card</li><li>Prepaid return envelope</li></ul>
<h3>Instructions</h3>
<ol><li><strong>Wash your hands</strong> and brush your teeth before starting.</li><li><strong>Mix the putty:</strong> Take equal amounts of the base (white) and catalyst (coloured) putty. Knead them together until you get a uniform colour (about 30 seconds).</li><li><strong>Fill the tray:</strong> Press the mixed putty firmly into the impression tray, filling it evenly.</li><li><strong>Take the impression:</strong> Place the tray over your teeth and push up firmly. Bite down gently and hold for 2-3 minutes until the putty sets.</li><li><strong>Remove carefully:</strong> Gently pull the tray straight down to remove. Check that all teeth are clearly visible in the impression.</li><li><strong>Repeat</strong> for the other arch if needed.</li><li><strong>Let dry</strong> for 10 minutes, then place in the prepaid envelope and post back to us.</li></ol>
<h3>Tips For A Perfect Mould</h3>
<ul><li>Don't eat or drink 30 minutes before taking impressions</li><li>Make sure the putty is mixed thoroughly</li><li>Push the tray up firmly — don't be gentle</li><li>Hold completely still while the putty sets</li><li>If the first attempt isn't perfect, use the spare putty to try again</li></ul>`,
    },
    {
      title: "Return & Exchanges", slug: "return-exchanges", isActive: true,
      content: `<h2>Return & Exchange Policy</h2>
<h3>Returns</h3>
<p>We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 14 days of delivery for a full refund or exchange.</p>
<h3>Custom Items</h3>
<p>Custom-made grillz are crafted specifically for you and cannot be returned for a refund. However, if your custom grillz don't fit properly, we'll adjust them free of charge.</p>
<h3>How To Return</h3>
<ol><li>Contact us at <strong>returns@3dgrillsgenius.com</strong> with your order number</li><li>We'll provide you with a return address and instructions</li><li>Ship the item back in its original packaging</li><li>Once received and inspected, we'll process your refund within 5-7 business days</li></ol>
<h3>Exchanges</h3>
<p>Want to swap for a different style or size? Contact us and we'll arrange an exchange. Simply return the original item and we'll send out the replacement.</p>
<h3>Damaged Items</h3>
<p>If your item arrives damaged, please contact us immediately with photos of the damage. We'll arrange a replacement at no extra cost.</p>
<h3>Refund Processing</h3>
<p>Refunds are processed to the original payment method within 5-7 business days of receiving the returned item. Please allow an additional 3-5 business days for the refund to appear in your account.</p>`,
    },
    {
      title: "Privacy Policy", slug: "privacy-policy", isActive: true,
      content: `<h2>Privacy Policy</h2>
<p>Last updated: March 2026</p>
<h3>Information We Collect</h3>
<p>We collect information you provide directly, including your name, email address, shipping address, phone number, and payment information when you make a purchase or create an account.</p>
<h3>How We Use Your Information</h3>
<ul><li>To process and fulfil your orders</li><li>To communicate with you about your orders and account</li><li>To send promotional emails (with your consent)</li><li>To improve our products and services</li><li>To comply with legal obligations</li></ul>
<h3>Data Security</h3>
<p>We use industry-standard security measures to protect your personal information. Payment processing is handled securely through Stripe, and we never store your full card details.</p>
<h3>Cookies</h3>
<p>We use cookies to enhance your browsing experience, remember your preferences, and analyse site traffic. You can disable cookies in your browser settings.</p>
<h3>Third-Party Services</h3>
<p>We may share your information with trusted third parties who assist us in operating our website, conducting our business, or serving you (e.g., shipping carriers, payment processors).</p>
<h3>Your Rights</h3>
<p>You have the right to access, correct, or delete your personal data. Contact us at <strong>privacy@3dgrillsgenius.com</strong> to exercise these rights.</p>
<h3>Contact</h3>
<p>For any privacy-related questions, please contact us at <strong>privacy@3dgrillsgenius.com</strong>.</p>`,
    },
    {
      title: "Terms of Service", slug: "terms-of-service", isActive: true,
      content: `<h2>Terms of Service</h2>
<p>Last updated: March 2026</p>
<h3>Agreement</h3>
<p>By accessing and using the 3D GRILLS GENIUS website and services, you agree to be bound by these Terms of Service.</p>
<h3>Products & Orders</h3>
<p>All products are subject to availability. We reserve the right to limit quantities and refuse orders. Prices are subject to change without notice.</p>
<h3>Custom Orders</h3>
<p>Custom-made items are non-refundable as they are crafted specifically for you. By placing a custom order, you acknowledge this policy. We guarantee the quality and fit of all custom pieces.</p>
<h3>Payment</h3>
<p>We accept payment via Stripe (credit/debit cards). All prices are displayed in GBP unless otherwise specified. Payment is required in full at the time of purchase.</p>
<h3>Shipping</h3>
<p>We aim to dispatch all orders within 1-3 business days. Custom orders require 5-14 business days for production before shipping. Delivery times vary by location.</p>
<h3>Intellectual Property</h3>
<p>All content on this website, including images, text, logos, and designs, is the property of 3D GRILLS GENIUS and is protected by copyright laws.</p>
<h3>Limitation of Liability</h3>
<p>3D GRILLS GENIUS shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
<h3>Governing Law</h3>
<p>These terms are governed by the laws of England and Wales. Any disputes shall be resolved in the courts of England and Wales.</p>
<h3>Contact</h3>
<p>For questions about these terms, contact us at <strong>legal@3dgrillsgenius.com</strong>.</p>`,
    },
    {
      title: "Refund Policy", slug: "refund-policy", isActive: true,
      content: `<h2>Refund Policy</h2>
<h3>Standard Items</h3>
<p>We offer a full refund on standard (non-custom) items returned within 14 days of delivery. Items must be in their original condition and packaging.</p>
<h3>Custom Items</h3>
<p>Custom-made grillz cannot be refunded as they are uniquely crafted for your teeth. However, if there is an issue with fit or quality, we will adjust or remake them at no additional cost.</p>
<h3>Mould Kits</h3>
<p>Unopened and unused mould kits can be returned for a full refund. Used kits are non-refundable.</p>
<h3>Processing Time</h3>
<p>Refunds are processed within 5-7 business days of receiving the returned item. The refund will be credited to the original payment method.</p>
<h3>How To Request A Refund</h3>
<p>Email us at <strong>returns@3dgrillsgenius.com</strong> with your order number and reason for return. We'll provide return instructions within 24 hours.</p>`,
    },
  ];

    for (const page of cmsPageData) {
      try {
        await db.insert(cmsPages).values(page).onConflictDoNothing();
      } catch (err: any) {
        if (err.code !== "23505") throw err;
      }
    }
    console.log(`Created ${cmsPageData.length} CMS pages`);
  } else {
    console.log(`CMS pages already exist (${existingCms.length}), skipping`);
  }

  console.log("Auto-seed complete!");
}
