import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import slugify from "slugify";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

function generateOrderNumber(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

function generateInvoiceNumber(): string {
  return `INV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

function requireAuth(req: Request, res: Response, next: Function) {
  if (!(req.session as any)?.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!(req.session as any)?.userId || (req.session as any)?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(uploadDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  // File upload endpoint
  app.post("/api/upload", requireAdmin, upload.array("files", 10), (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const urls = files.map(f => `/uploads/${f.filename}`);
    res.json({ urls });
  });

  // ─── AUTH ───────────────────────────────────────────────
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });

      const existing = await storage.getUserByEmail(email);
      if (existing) return res.status(400).json({ error: "Email already registered" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ email, password: hashedPassword, firstName, lastName, phone, role: "customer" });

      (req.session as any).userId = user.id;
      (req.session as any).role = user.role;

      res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: "Invalid credentials" });

      (req.session as any).userId = user.id;
      (req.session as any).role = user.role;

      res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy(() => res.json({ success: true }));
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    const userId = (req.session as any)?.userId;
    if (!userId) return res.json({ user: null });
    const user = await storage.getUser(userId);
    if (!user) return res.json({ user: null });
    res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role } });
  });

  app.patch("/api/auth/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      const { firstName, lastName, phone, currentPassword, newPassword } = req.body;
      const updateData: any = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (phone !== undefined) updateData.phone = phone;
      if (newPassword && currentPassword) {
        const user = await storage.getUser(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid) return res.status(400).json({ error: "Current password is incorrect" });
        updateData.password = await bcrypt.hash(newPassword, 10);
      }
      const user = await storage.updateUser(userId, updateData);
      res.json({ user: { id: user!.id, email: user!.email, firstName: user!.firstName, lastName: user!.lastName, phone: user!.phone, role: user!.role } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── PUBLIC API ─────────────────────────────────────────
  app.get("/api/categories", async (_req: Request, res: Response) => {
    const cats = await storage.listCategories(true);
    res.json(cats);
  });

  app.get("/api/products", async (req: Request, res: Response) => {
    const { category, search, limit, offset, featured } = req.query;
    let categoryId: number | undefined;
    if (category) {
      const cat = await storage.getCategoryBySlug(category as string);
      if (cat) categoryId = cat.id;
    }
    const result = await storage.listProducts({
      activeOnly: true,
      categoryId,
      search: search as string,
      featured: featured === "true",
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    });

    const productsWithPrices = await Promise.all(
      result.products.map(async (p) => {
        const prices = await storage.getProductPrices(p.id);
        const attrs = await storage.getProductAttributeValues(p.id);
        return { ...p, prices, attributes: attrs };
      })
    );

    res.json({ products: productsWithPrices, total: result.total });
  });

  app.get("/api/products/:slug", async (req: Request, res: Response) => {
    const product = await storage.getProductBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: "Product not found" });
    const prices = await storage.getProductPrices(product.id);
    const attrs = await storage.getProductAttributeValues(product.id);
    const category = product.categoryId ? await storage.getCategory(product.categoryId) : null;
    res.json({ ...product, prices, attributes: attrs, category });
  });

  app.get("/api/banners", async (req: Request, res: Response) => {
    const page = req.query.page as string | undefined;
    const bannerList = await storage.listBanners(page, true);
    res.json(bannerList);
  });

  app.get("/api/reviews", async (_req: Request, res: Response) => {
    const reviewList = await storage.listReviews(true);
    res.json(reviewList);
  });

  app.post("/api/subscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email is required" });
      }
      await storage.addSubscriber(email.toLowerCase().trim());
      res.json({ success: true, message: "Subscribed successfully!" });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }
      if (typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email is required" });
      }
      const submission = await storage.createContactSubmission({ name, email, subject: subject || null, message });
      res.json({ success: true, message: "Your message has been sent successfully!" });
    } catch (err: any) {
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  app.get("/api/cms/:slug", async (req: Request, res: Response) => {
    const page = await storage.getCmsPageBySlug(req.params.slug);
    if (!page || !page.isActive) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  });

  app.get("/api/seo/:pagePath", async (req: Request, res: Response) => {
    const setting = await storage.getSeoSetting(req.params.pagePath);
    res.json(setting || {});
  });

  app.get("/api/product-attributes", async (_req: Request, res: Response) => {
    const attrs = await storage.listProductAttributes();
    res.json(attrs);
  });

  app.get("/api/search", async (req: Request, res: Response) => {
    const q = req.query.q as string;
    if (!q || q.length < 2) return res.json({ products: [], total: 0 });
    const result = await storage.listProducts({ activeOnly: true, search: q, limit: 10 });
    res.json(result);
  });

  // ─── STRIPE / CHECKOUT ─────────────────────────────────
  app.get("/api/stripe/publishable-key", async (_req: Request, res: Response) => {
    try {
      const key = await getStripePublishableKey();
      res.json({ publishableKey: key });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/checkout/create-session", async (req: Request, res: Response) => {
    try {
      const { items, customerEmail, shippingAddress, currency = "gbp" } = req.body;
      if (!items || !items.length) return res.status(400).json({ error: "No items provided" });

      const stripe = await getUncachableStripeClient();

      const lineItems = await Promise.all(items.map(async (item: any) => {
        const product = await storage.getProduct(item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        return {
          price_data: {
            currency,
            product_data: {
              name: product.name,
              images: product.images.length > 0 ? [product.images[0].startsWith('http') ? product.images[0] : `${req.headers['x-forwarded-proto'] || req.protocol || 'https'}://${req.get('host')}${product.images[0]}`] : [],
            },
            unit_amount: Math.round(parseFloat(item.price) * 100),
          },
          quantity: item.quantity,
        };
      }));

      const orderNumber = generateOrderNumber();
      const subtotal = items.reduce((sum: number, item: any) => sum + (parseFloat(item.price) * item.quantity), 0);
      const total = subtotal;

      const order = await storage.createOrder({
        orderNumber,
        userId: (req.session as any)?.userId || null,
        status: "pending",
        subtotal: subtotal.toString(),
        total: total.toString(),
        currency: currency.toUpperCase(),
        customerEmail,
        shippingAddress,
      });

      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          productName: product?.name || item.name || "Product",
          productImage: product?.images?.[0] || null,
          quantity: item.quantity,
          price: item.price.toString(),
          attributes: item.attributes || null,
        });
      }

      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
      const host = `${protocol}://${req.get('host')}`;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${host}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${host}/checkout/cancel`,
        customer_email: customerEmail,
        metadata: { orderId: order.id.toString(), orderNumber },
      });

      await storage.updateOrder(order.id, { stripeSessionId: session.id });

      res.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
      console.error("Checkout error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/checkout/verify/:sessionId", async (req: Request, res: Response) => {
    try {
      const stripe = await getUncachableStripeClient();
      const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

      if (session.payment_status === "paid") {
        const order = await storage.getOrderByStripeSession(session.id);
        if (order && order.status === "pending") {
          await storage.updateOrder(order.id, {
            status: "paid",
            stripePaymentIntentId: session.payment_intent as string,
            customerEmail: session.customer_email || order.customerEmail,
          });

          const inv = await storage.createInvoice({
            orderId: order.id,
            invoiceNumber: generateInvoiceNumber(),
            data: { sessionId: session.id, amount: session.amount_total, currency: session.currency },
          });
        }
        res.json({ success: true, orderNumber: order?.orderNumber });
      } else {
        res.json({ success: false });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── USER ORDERS ───────────────────────────────────────
  app.get("/api/my/orders", requireAuth, async (req: Request, res: Response) => {
    const userId = (req.session as any).userId;
    const result = await storage.listOrders({ userId });
    const ordersWithItems = await Promise.all(
      result.orders.map(async (o) => {
        const items = await storage.getOrderItems(o.id);
        return { ...o, items };
      })
    );
    res.json({ orders: ordersWithItems, total: result.total });
  });

  app.get("/api/my/orders/:id", requireAuth, async (req: Request, res: Response) => {
    const order = await storage.getOrder(parseInt(req.params.id));
    if (!order || order.userId !== (req.session as any).userId) return res.status(404).json({ error: "Order not found" });
    const items = await storage.getOrderItems(order.id);
    const invoice = await storage.getInvoiceByOrder(order.id);
    res.json({ ...order, items, invoice });
  });

  // ─── ADMIN API ──────────────────────────────────────────
  // Dashboard
  app.get("/api/admin/dashboard", requireAdmin, async (_req: Request, res: Response) => {
    try {
      const [orderCount, userCount, revenue, recentOrders, subscriberCount, productCount] = await Promise.all([
        storage.getOrderCount(),
        storage.getUserCount(),
        storage.getRevenue(),
        storage.getRecentOrders(10),
        storage.getSubscriberCount(),
        storage.getProductCount(),
      ]);
      res.json({ orderCount, userCount, revenue, recentOrders, subscriberCount, productCount });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Categories
  app.get("/api/admin/categories", requireAdmin, async (_req: Request, res: Response) => {
    const cats = await storage.listCategories();
    res.json(cats);
  });
  app.post("/api/admin/categories", requireAdmin, async (req: Request, res: Response) => {
    try {
      const slug = slugify(req.body.name, { lower: true, strict: true });
      const cat = await storage.createCategory({ ...req.body, slug });
      res.json(cat);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });
  app.patch("/api/admin/categories/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true, strict: true });
      const cat = await storage.updateCategory(parseInt(req.params.id), req.body);
      res.json(cat);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });
  app.delete("/api/admin/categories/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteCategory(parseInt(req.params.id));
    res.json({ success: true });
  });

  // Admin Products
  app.get("/api/admin/products", requireAdmin, async (req: Request, res: Response) => {
    const { limit, offset, search } = req.query;
    const result = await storage.listProducts({
      search: search as string,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
    });
    const productsWithPrices = await Promise.all(
      result.products.map(async (p) => {
        const prices = await storage.getProductPrices(p.id);
        const attributes = await storage.getProductAttributeValues(p.id);
        return { ...p, prices, attributes };
      })
    );
    res.json({ products: productsWithPrices, total: result.total });
  });
  app.post("/api/admin/products", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { prices, attributeValues, ...productData } = req.body;
      const slug = slugify(productData.name, { lower: true, strict: true });
      const product = await storage.createProduct({ ...productData, slug });

      if (prices && Array.isArray(prices)) {
        for (const p of prices) {
          const cleaned = { ...p, productId: product.id, discountPrice: p.discountPrice || null };
          await storage.setProductPrice(cleaned);
        }
      }
      if (attributeValues && Array.isArray(attributeValues)) {
        for (const av of attributeValues) {
          if (!av.value || !av.attributeId || isNaN(parseFloat(av.priceModifier))) continue;
          await storage.setProductAttributeValue({ ...av, productId: product.id });
        }
      }

      const allPrices = await storage.getProductPrices(product.id);
      res.json({ ...product, prices: allPrices });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });
  app.patch("/api/admin/products/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { prices, attributeValues, ...productData } = req.body;
      if (productData.name) productData.slug = slugify(productData.name, { lower: true, strict: true });
      const product = await storage.updateProduct(id, productData);

      if (prices && Array.isArray(prices)) {
        for (const p of prices) {
          const cleaned = { ...p, productId: id, discountPrice: p.discountPrice || null };
          await storage.setProductPrice(cleaned);
        }
      }
      if (attributeValues && Array.isArray(attributeValues)) {
        await storage.deleteProductAttributeValues(id);
        for (const av of attributeValues) {
          if (!av.value || !av.attributeId || isNaN(parseFloat(av.priceModifier))) continue;
          await storage.setProductAttributeValue({ ...av, productId: id });
        }
      }

      const allPrices = await storage.getProductPrices(id);
      const attrs = await storage.getProductAttributeValues(id);
      res.json({ ...product, prices: allPrices, attributes: attrs });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });
  app.delete("/api/admin/products/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteProduct(parseInt(req.params.id));
    res.json({ success: true });
  });

  // Admin Product Attributes
  app.get("/api/admin/product-attributes", requireAdmin, async (_req: Request, res: Response) => {
    const attrs = await storage.listProductAttributes();
    res.json(attrs);
  });
  app.post("/api/admin/product-attributes", requireAdmin, async (req: Request, res: Response) => {
    const attr = await storage.createProductAttribute(req.body);
    res.json(attr);
  });
  app.patch("/api/admin/product-attributes/:id", requireAdmin, async (req: Request, res: Response) => {
    const attr = await storage.updateProductAttribute(parseInt(req.params.id), req.body);
    res.json(attr);
  });
  app.delete("/api/admin/product-attributes/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteProductAttribute(parseInt(req.params.id));
    res.json({ success: true });
  });

  // Admin Banners
  app.get("/api/admin/banners", requireAdmin, async (_req: Request, res: Response) => {
    const bannerList = await storage.listBanners();
    res.json(bannerList);
  });
  app.post("/api/admin/banners", requireAdmin, async (req: Request, res: Response) => {
    const banner = await storage.createBanner(req.body);
    res.json(banner);
  });
  app.patch("/api/admin/banners/:id", requireAdmin, async (req: Request, res: Response) => {
    const banner = await storage.updateBanner(parseInt(req.params.id), req.body);
    res.json(banner);
  });
  app.delete("/api/admin/banners/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteBanner(parseInt(req.params.id));
    res.json({ success: true });
  });

  // Admin Reviews
  app.get("/api/admin/reviews", requireAdmin, async (_req: Request, res: Response) => {
    const reviewList = await storage.listReviews();
    res.json(reviewList);
  });
  app.post("/api/admin/reviews", requireAdmin, async (req: Request, res: Response) => {
    const review = await storage.createReview(req.body);
    res.json(review);
  });
  app.patch("/api/admin/reviews/:id", requireAdmin, async (req: Request, res: Response) => {
    const review = await storage.updateReview(parseInt(req.params.id), req.body);
    res.json(review);
  });
  app.delete("/api/admin/reviews/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteReview(parseInt(req.params.id));
    res.json({ success: true });
  });

  // Admin CMS Pages
  app.get("/api/admin/cms-pages", requireAdmin, async (_req: Request, res: Response) => {
    const pages = await storage.listCmsPages();
    res.json(pages);
  });
  app.post("/api/admin/cms-pages", requireAdmin, async (req: Request, res: Response) => {
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const page = await storage.createCmsPage({ ...req.body, slug });
    res.json(page);
  });
  app.patch("/api/admin/cms-pages/:id", requireAdmin, async (req: Request, res: Response) => {
    if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    const page = await storage.updateCmsPage(parseInt(req.params.id), req.body);
    res.json(page);
  });
  app.delete("/api/admin/cms-pages/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteCmsPage(parseInt(req.params.id));
    res.json({ success: true });
  });

  // Admin SEO Settings
  app.get("/api/admin/seo-settings", requireAdmin, async (_req: Request, res: Response) => {
    const settings = await storage.listSeoSettings();
    res.json(settings);
  });
  app.post("/api/admin/seo-settings", requireAdmin, async (req: Request, res: Response) => {
    const setting = await storage.upsertSeoSetting(req.body);
    res.json(setting);
  });

  // Admin Orders
  app.get("/api/admin/orders", requireAdmin, async (req: Request, res: Response) => {
    const { status, limit, offset } = req.query;
    const result = await storage.listOrders({
      status: status as string,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
    });
    const ordersWithItems = await Promise.all(
      result.orders.map(async (o) => {
        const items = await storage.getOrderItems(o.id);
        return { ...o, items };
      })
    );
    res.json({ orders: ordersWithItems, total: result.total });
  });
  app.get("/api/admin/orders/:id", requireAdmin, async (req: Request, res: Response) => {
    const order = await storage.getOrder(parseInt(req.params.id));
    if (!order) return res.status(404).json({ error: "Order not found" });
    const items = await storage.getOrderItems(order.id);
    const invoice = await storage.getInvoiceByOrder(order.id);
    const user = order.userId ? await storage.getUser(order.userId) : null;
    res.json({ ...order, items, invoice, user });
  });
  app.patch("/api/admin/orders/:id", requireAdmin, async (req: Request, res: Response) => {
    const order = await storage.updateOrder(parseInt(req.params.id), req.body);
    res.json(order);
  });

  // Admin Invoices
  app.get("/api/admin/invoices", requireAdmin, async (_req: Request, res: Response) => {
    const invoiceList = await storage.listInvoices();
    res.json(invoiceList);
  });
  app.post("/api/admin/invoices", requireAdmin, async (req: Request, res: Response) => {
    const inv = await storage.createInvoice({
      ...req.body,
      invoiceNumber: generateInvoiceNumber(),
    });
    res.json(inv);
  });

  // Admin Settings
  app.get("/api/admin/settings", requireAdmin, async (_req: Request, res: Response) => {
    const settings = await storage.listSettings();
    res.json(settings);
  });
  app.post("/api/admin/settings", requireAdmin, async (req: Request, res: Response) => {
    const { key, value } = req.body;
    await storage.setSetting(key, value);
    res.json({ success: true });
  });

  // Admin Stripe Settings
  app.get("/api/admin/stripe-settings", requireAdmin, async (_req: Request, res: Response) => {
    const publishableKey = await storage.getSetting("stripe_publishable_key");
    const secretKey = await storage.getSetting("stripe_secret_key");
    const maskSecret = (key: string | null) => {
      if (!key || key.length < 12) return "";
      return key.substring(0, 7) + "••••••••" + key.substring(key.length - 4);
    };
    res.json({
      publishableKey: publishableKey || "",
      secretKeyMasked: maskSecret(secretKey),
      hasSecretKey: !!secretKey,
      isConfigured: !!(publishableKey && secretKey),
    });
  });
  app.post("/api/admin/stripe-settings", requireAdmin, async (req: Request, res: Response) => {
    const { publishableKey, secretKey } = req.body;
    if (!publishableKey) {
      return res.status(400).json({ error: "Publishable key is required" });
    }
    if (!publishableKey.startsWith("pk_")) {
      return res.status(400).json({ error: "Publishable key must start with 'pk_'" });
    }
    if (secretKey) {
      if (!secretKey.startsWith("sk_")) {
        return res.status(400).json({ error: "Secret key must start with 'sk_'" });
      }
      await storage.setSetting("stripe_secret_key", secretKey);
    }
    await storage.setSetting("stripe_publishable_key", publishableKey);
    res.json({ success: true });
  });
  app.post("/api/admin/stripe-test", requireAdmin, async (req: Request, res: Response) => {
    const { secretKey } = req.body;
    if (!secretKey || !secretKey.startsWith("sk_")) {
      return res.status(400).json({ error: "Valid secret key required" });
    }
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(secretKey);
      await stripe.balance.retrieve();
      res.json({ success: true, message: "Stripe connection successful" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(400).json({ error: `Stripe connection failed: ${message}` });
    }
  });

  // Admin Users
  app.get("/api/admin/users", requireAdmin, async (_req: Request, res: Response) => {
    const userList = await storage.listUsers();
    res.json(userList.map(u => ({ ...u, password: undefined })));
  });

  // Admin Subscribers
  app.get("/api/admin/subscribers", requireAdmin, async (_req: Request, res: Response) => {
    const subs = await storage.listSubscribers();
    res.json(subs);
  });
  app.delete("/api/admin/subscribers/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteSubscriber(parseInt(req.params.id));
    res.json({ success: true });
  });

  // Admin Contacts
  app.get("/api/admin/contacts", requireAdmin, async (_req: Request, res: Response) => {
    const submissions = await storage.listContactSubmissions();
    res.json(submissions);
  });
  app.patch("/api/admin/contacts/:id/read", requireAdmin, async (req: Request, res: Response) => {
    const submission = await storage.markContactRead(parseInt(req.params.id));
    res.json(submission);
  });
  app.delete("/api/admin/contacts/:id", requireAdmin, async (req: Request, res: Response) => {
    await storage.deleteContactSubmission(parseInt(req.params.id));
    res.json({ success: true });
  });

  return httpServer;
}
