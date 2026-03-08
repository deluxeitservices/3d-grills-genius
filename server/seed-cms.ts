import { db } from "./db";
import { cmsPages } from "@shared/schema";

async function seedCMS() {
  console.log("Seeding CMS pages...");

  const pages = [
    {
      title: "FAQs",
      slug: "faq",
      isActive: true,
      content: `
<h2>Frequently Asked Questions</h2>

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
<p>We accept returns within 14 days of delivery. Custom-made items can be adjusted for fit free of charge. Please see our Return & Exchanges page for full details.</p>
      `,
    },
    {
      title: "Contact Us",
      slug: "contact-us",
      isActive: true,
      content: `
<h2>Get In Touch</h2>
<p>We'd love to hear from you! Whether you have a question about our products, need help with an order, or want to discuss a custom design, our team is here to help.</p>

<h3>Email</h3>
<p>For general enquiries: <strong>info@3dgrillsgenius.com</strong></p>
<p>For order support: <strong>orders@3dgrillsgenius.com</strong></p>

<h3>Social Media</h3>
<p>Follow us on Instagram, Facebook, and YouTube for the latest designs, behind-the-scenes content, and exclusive offers.</p>

<h3>Business Hours</h3>
<p>Monday - Friday: 9:00 AM - 6:00 PM (GMT)<br>
Saturday: 10:00 AM - 4:00 PM (GMT)<br>
Sunday: Closed</p>

<h3>Custom Orders</h3>
<p>Looking for something truly unique? We specialise in custom designs. Send us your idea and we'll work with you to bring it to life. Contact us at <strong>custom@3dgrillsgenius.com</strong> with your design concept.</p>
      `,
    },
    {
      title: "How It Works",
      slug: "how-it-works",
      isActive: true,
      content: `
<h2>How It Works</h2>
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
<p>If your grillz don't fit perfectly, we'll adjust them free of charge. Your satisfaction is our priority.</p>
      `,
    },
    {
      title: "How To Use Mould Kit",
      slug: "how-to-use-mould-kit",
      isActive: true,
      content: `
<h2>How To Use Your Mould Kit</h2>
<p>Follow these instructions carefully to ensure a perfect fit for your custom grillz.</p>

<h3>What's In The Kit</h3>
<ul>
<li>2 x dental putty containers (base + catalyst)</li>
<li>2 x impression trays (top and bottom)</li>
<li>Instruction card</li>
<li>Prepaid return envelope</li>
</ul>

<h3>Instructions</h3>
<ol>
<li><strong>Wash your hands</strong> and brush your teeth before starting.</li>
<li><strong>Mix the putty:</strong> Take equal amounts of the base (white) and catalyst (coloured) putty. Knead them together until you get a uniform colour (about 30 seconds).</li>
<li><strong>Fill the tray:</strong> Press the mixed putty firmly into the impression tray, filling it evenly.</li>
<li><strong>Take the impression:</strong> Place the tray over your teeth and push up firmly. Bite down gently and hold for 2-3 minutes until the putty sets.</li>
<li><strong>Remove carefully:</strong> Gently pull the tray straight down to remove. Check that all teeth are clearly visible in the impression.</li>
<li><strong>Repeat</strong> for the other arch if needed.</li>
<li><strong>Let dry</strong> for 10 minutes, then place in the prepaid envelope and post back to us.</li>
</ol>

<h3>Tips For A Perfect Mould</h3>
<ul>
<li>Don't eat or drink 30 minutes before taking impressions</li>
<li>Make sure the putty is mixed thoroughly</li>
<li>Push the tray up firmly — don't be gentle</li>
<li>Hold completely still while the putty sets</li>
<li>If the first attempt isn't perfect, use the spare putty to try again</li>
</ul>
      `,
    },
    {
      title: "Return & Exchanges",
      slug: "return-exchanges",
      isActive: true,
      content: `
<h2>Return & Exchange Policy</h2>

<h3>Returns</h3>
<p>We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 14 days of delivery for a full refund or exchange.</p>

<h3>Custom Items</h3>
<p>Custom-made grillz are crafted specifically for you and cannot be returned for a refund. However, if your custom grillz don't fit properly, we'll adjust them free of charge.</p>

<h3>How To Return</h3>
<ol>
<li>Contact us at <strong>returns@3dgrillsgenius.com</strong> with your order number</li>
<li>We'll provide you with a return address and instructions</li>
<li>Ship the item back in its original packaging</li>
<li>Once received and inspected, we'll process your refund within 5-7 business days</li>
</ol>

<h3>Exchanges</h3>
<p>Want to swap for a different style or size? Contact us and we'll arrange an exchange. Simply return the original item and we'll send out the replacement.</p>

<h3>Damaged Items</h3>
<p>If your item arrives damaged, please contact us immediately with photos of the damage. We'll arrange a replacement at no extra cost.</p>

<h3>Refund Processing</h3>
<p>Refunds are processed to the original payment method within 5-7 business days of receiving the returned item. Please allow an additional 3-5 business days for the refund to appear in your account.</p>
      `,
    },
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      isActive: true,
      content: `
<h2>Privacy Policy</h2>
<p>Last updated: March 2026</p>

<h3>Information We Collect</h3>
<p>We collect information you provide directly, including your name, email address, shipping address, phone number, and payment information when you make a purchase or create an account.</p>

<h3>How We Use Your Information</h3>
<ul>
<li>To process and fulfil your orders</li>
<li>To communicate with you about your orders and account</li>
<li>To send promotional emails (with your consent)</li>
<li>To improve our products and services</li>
<li>To comply with legal obligations</li>
</ul>

<h3>Data Security</h3>
<p>We use industry-standard security measures to protect your personal information. Payment processing is handled securely through Stripe, and we never store your full card details.</p>

<h3>Cookies</h3>
<p>We use cookies to enhance your browsing experience, remember your preferences, and analyse site traffic. You can disable cookies in your browser settings.</p>

<h3>Third-Party Services</h3>
<p>We may share your information with trusted third parties who assist us in operating our website, conducting our business, or serving you (e.g., shipping carriers, payment processors).</p>

<h3>Your Rights</h3>
<p>You have the right to access, correct, or delete your personal data. Contact us at <strong>privacy@3dgrillsgenius.com</strong> to exercise these rights.</p>

<h3>Contact</h3>
<p>For any privacy-related questions, please contact us at <strong>privacy@3dgrillsgenius.com</strong>.</p>
      `,
    },
    {
      title: "Terms of Service",
      slug: "terms-of-service",
      isActive: true,
      content: `
<h2>Terms of Service</h2>
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
<p>For questions about these terms, contact us at <strong>legal@3dgrillsgenius.com</strong>.</p>
      `,
    },
    {
      title: "Refund Policy",
      slug: "refund-policy",
      isActive: true,
      content: `
<h2>Refund Policy</h2>

<h3>Standard Items</h3>
<p>We offer a full refund on standard (non-custom) items returned within 14 days of delivery. Items must be in their original condition and packaging.</p>

<h3>Custom Items</h3>
<p>Custom-made grillz cannot be refunded as they are uniquely crafted for your teeth. However, if there is an issue with fit or quality, we will adjust or remake them at no additional cost.</p>

<h3>Mould Kits</h3>
<p>Unopened and unused mould kits can be returned for a full refund. Used kits are non-refundable.</p>

<h3>Processing Time</h3>
<p>Refunds are processed within 5-7 business days of receiving the returned item. The refund will be credited to the original payment method.</p>

<h3>How To Request A Refund</h3>
<p>Email us at <strong>returns@3dgrillsgenius.com</strong> with your order number and reason for return. We'll provide return instructions within 24 hours.</p>
      `,
    },
  ];

  for (const page of pages) {
    try {
      await db.insert(cmsPages).values(page).onConflictDoNothing();
      console.log(`Created page: ${page.title}`);
    } catch (err: any) {
      if (err.code === "23505") {
        console.log(`Page already exists: ${page.title}`);
      } else {
        throw err;
      }
    }
  }

  console.log("CMS seed complete!");
  process.exit(0);
}

seedCMS().catch((err) => {
  console.error("CMS seed error:", err);
  process.exit(1);
});
