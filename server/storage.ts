import { db } from "./db";
import { eq, desc, asc, like, and, sql, ilike, or, inArray } from "drizzle-orm";
import {
  users, categories, products, productPrices, productAttributes,
  productAttributeValues, banners, reviews, orders, orderItems,
  cmsPages, seoSettings, invoices, adminSettings, subscribers, contactSubmissions,
  type User, type InsertUser, type Category, type InsertCategory,
  type Product, type InsertProduct, type ProductPrice, type InsertProductPrice,
  type ProductAttribute, type InsertProductAttribute,
  type ProductAttributeValue, type InsertProductAttributeValue,
  type Banner, type InsertBanner, type Review, type InsertReview,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type CmsPage, type InsertCmsPage, type SeoSetting, type InsertSeoSetting,
  type Invoice, type InsertInvoice, type AdminSetting, type InsertAdminSetting,
  type Subscriber, type InsertSubscriber,
  type ContactSubmission, type InsertContactSubmission,
} from "@shared/schema";

export class DatabaseStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUser(data: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }
  async listUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }
  async getUserCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    return result.count;
  }

  // Categories
  async getCategory(id: number): Promise<Category | undefined> {
    const [cat] = await db.select().from(categories).where(eq(categories.id, id));
    return cat;
  }
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [cat] = await db.select().from(categories).where(eq(categories.slug, slug));
    return cat;
  }
  async listCategories(activeOnly = false): Promise<Category[]> {
    const conditions = activeOnly ? eq(categories.isActive, true) : undefined;
    return db.select().from(categories).where(conditions).orderBy(asc(categories.sortOrder));
  }
  async createCategory(data: InsertCategory): Promise<Category> {
    const [cat] = await db.insert(categories).values(data).returning();
    return cat;
  }
  async updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined> {
    const [cat] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return cat;
  }
  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    const [prod] = await db.select().from(products).where(eq(products.id, id));
    return prod;
  }
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [prod] = await db.select().from(products).where(eq(products.slug, slug));
    return prod;
  }
  async listProducts(opts: { activeOnly?: boolean; categoryId?: number; search?: string; limit?: number; offset?: number; featured?: boolean } = {}): Promise<{ products: Product[]; total: number }> {
    const conditions = [];
    if (opts.activeOnly) conditions.push(eq(products.isActive, true));
    if (opts.categoryId) conditions.push(eq(products.categoryId, opts.categoryId));
    if (opts.featured) conditions.push(eq(products.isFeatured, true));
    if (opts.search) conditions.push(ilike(products.name, `%${opts.search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const limit = opts.limit || 20;
    const offset = opts.offset || 0;

    const [countResult] = await db.select({ count: sql<number>`count(*)::int` }).from(products).where(where);
    const items = await db.select().from(products).where(where).orderBy(desc(products.createdAt)).limit(limit).offset(offset);

    return { products: items, total: countResult.count };
  }
  async createProduct(data: InsertProduct): Promise<Product> {
    const [prod] = await db.insert(products).values(data).returning();
    return prod;
  }
  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const [prod] = await db.update(products).set(data).where(eq(products.id, id)).returning();
    return prod;
  }
  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Product Prices
  async getProductPrices(productId: number): Promise<ProductPrice[]> {
    return db.select().from(productPrices).where(eq(productPrices.productId, productId));
  }
  async getProductPriceForCountry(productId: number, countryCode: string): Promise<ProductPrice | undefined> {
    const [price] = await db.select().from(productPrices).where(and(eq(productPrices.productId, productId), eq(productPrices.countryCode, countryCode)));
    return price;
  }
  async setProductPrice(data: InsertProductPrice): Promise<ProductPrice> {
    const existing = await this.getProductPriceForCountry(data.productId, data.countryCode);
    if (existing) {
      const [updated] = await db.update(productPrices).set(data).where(eq(productPrices.id, existing.id)).returning();
      return updated;
    }
    const [price] = await db.insert(productPrices).values(data).returning();
    return price;
  }
  async deleteProductPrice(id: number): Promise<void> {
    await db.delete(productPrices).where(eq(productPrices.id, id));
  }

  // Product Attributes
  async listProductAttributes(): Promise<ProductAttribute[]> {
    return db.select().from(productAttributes);
  }
  async createProductAttribute(data: InsertProductAttribute): Promise<ProductAttribute> {
    const [attr] = await db.insert(productAttributes).values(data).returning();
    return attr;
  }
  async updateProductAttribute(id: number, data: Partial<InsertProductAttribute>): Promise<ProductAttribute | undefined> {
    const [attr] = await db.update(productAttributes).set(data).where(eq(productAttributes.id, id)).returning();
    return attr;
  }
  async deleteProductAttribute(id: number): Promise<void> {
    await db.delete(productAttributes).where(eq(productAttributes.id, id));
  }

  // Product Attribute Values
  async getProductAttributeValues(productId: number): Promise<ProductAttributeValue[]> {
    return db.select().from(productAttributeValues).where(eq(productAttributeValues.productId, productId));
  }
  async setProductAttributeValue(data: InsertProductAttributeValue): Promise<ProductAttributeValue> {
    const [val] = await db.insert(productAttributeValues).values(data).returning();
    return val;
  }
  async deleteProductAttributeValues(productId: number): Promise<void> {
    await db.delete(productAttributeValues).where(eq(productAttributeValues.productId, productId));
  }

  // Banners
  async listBanners(page?: string, activeOnly = false): Promise<Banner[]> {
    const conditions = [];
    if (page) conditions.push(eq(banners.page, page));
    if (activeOnly) conditions.push(eq(banners.isActive, true));
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    return db.select().from(banners).where(where).orderBy(asc(banners.sortOrder));
  }
  async createBanner(data: InsertBanner): Promise<Banner> {
    const [banner] = await db.insert(banners).values(data).returning();
    return banner;
  }
  async updateBanner(id: number, data: Partial<InsertBanner>): Promise<Banner | undefined> {
    const [banner] = await db.update(banners).set(data).where(eq(banners.id, id)).returning();
    return banner;
  }
  async deleteBanner(id: number): Promise<void> {
    await db.delete(banners).where(eq(banners.id, id));
  }

  // Reviews
  async listReviews(activeOnly = false): Promise<Review[]> {
    const where = activeOnly ? eq(reviews.isActive, true) : undefined;
    return db.select().from(reviews).where(where).orderBy(desc(reviews.createdAt));
  }
  async createReview(data: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(data).returning();
    return review;
  }
  async updateReview(id: number, data: Partial<InsertReview>): Promise<Review | undefined> {
    const [review] = await db.update(reviews).set(data).where(eq(reviews.id, id)).returning();
    return review;
  }
  async deleteReview(id: number): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  // Orders
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order;
  }
  async getOrderByStripeSession(sessionId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.stripeSessionId, sessionId));
    return order;
  }
  async listOrders(opts: { userId?: number; status?: string; limit?: number; offset?: number } = {}): Promise<{ orders: Order[]; total: number }> {
    const conditions = [];
    if (opts.userId) conditions.push(eq(orders.userId, opts.userId));
    if (opts.status) conditions.push(eq(orders.status, opts.status));
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const limit = opts.limit || 20;
    const offset = opts.offset || 0;
    const [countResult] = await db.select({ count: sql<number>`count(*)::int` }).from(orders).where(where);
    const items = await db.select().from(orders).where(where).orderBy(desc(orders.createdAt)).limit(limit).offset(offset);
    return { orders: items, total: countResult.count };
  }
  async createOrder(data: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(data).returning();
    return order;
  }
  async updateOrder(id: number, data: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db.update(orders).set(data).where(eq(orders.id, id)).returning();
    return order;
  }
  async getOrderCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
    return result.count;
  }
  async getRevenue(): Promise<string> {
    const [result] = await db.select({ total: sql<string>`COALESCE(sum(total::numeric), 0)::text` }).from(orders).where(eq(orders.status, "delivered"));
    return result.total;
  }
  async getRecentOrders(limit = 10): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  async createOrderItem(data: InsertOrderItem): Promise<OrderItem> {
    const [item] = await db.insert(orderItems).values(data).returning();
    return item;
  }

  // CMS Pages
  async listCmsPages(activeOnly = false): Promise<CmsPage[]> {
    const where = activeOnly ? eq(cmsPages.isActive, true) : undefined;
    return db.select().from(cmsPages).where(where);
  }
  async getCmsPage(id: number): Promise<CmsPage | undefined> {
    const [page] = await db.select().from(cmsPages).where(eq(cmsPages.id, id));
    return page;
  }
  async getCmsPageBySlug(slug: string): Promise<CmsPage | undefined> {
    const [page] = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug));
    return page;
  }
  async createCmsPage(data: InsertCmsPage): Promise<CmsPage> {
    const [page] = await db.insert(cmsPages).values(data).returning();
    return page;
  }
  async updateCmsPage(id: number, data: Partial<InsertCmsPage>): Promise<CmsPage | undefined> {
    const [page] = await db.update(cmsPages).set(data).where(eq(cmsPages.id, id)).returning();
    return page;
  }
  async deleteCmsPage(id: number): Promise<void> {
    await db.delete(cmsPages).where(eq(cmsPages.id, id));
  }

  // SEO Settings
  async getSeoSetting(pagePath: string): Promise<SeoSetting | undefined> {
    const [setting] = await db.select().from(seoSettings).where(eq(seoSettings.pagePath, pagePath));
    return setting;
  }
  async listSeoSettings(): Promise<SeoSetting[]> {
    return db.select().from(seoSettings);
  }
  async upsertSeoSetting(data: InsertSeoSetting): Promise<SeoSetting> {
    const existing = await this.getSeoSetting(data.pagePath);
    if (existing) {
      const [updated] = await db.update(seoSettings).set(data).where(eq(seoSettings.id, existing.id)).returning();
      return updated;
    }
    const [setting] = await db.insert(seoSettings).values(data).returning();
    return setting;
  }

  // Invoices
  async listInvoices(): Promise<Invoice[]> {
    return db.select().from(invoices).orderBy(desc(invoices.createdAt));
  }
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [inv] = await db.select().from(invoices).where(eq(invoices.id, id));
    return inv;
  }
  async getInvoiceByOrder(orderId: number): Promise<Invoice | undefined> {
    const [inv] = await db.select().from(invoices).where(eq(invoices.orderId, orderId));
    return inv;
  }
  async createInvoice(data: InsertInvoice): Promise<Invoice> {
    const [inv] = await db.insert(invoices).values(data).returning();
    return inv;
  }

  // Admin Settings
  async getSetting(key: string): Promise<string | null> {
    const [setting] = await db.select().from(adminSettings).where(eq(adminSettings.key, key));
    return setting?.value ?? null;
  }
  async setSetting(key: string, value: string): Promise<void> {
    const existing = await this.getSetting(key);
    if (existing !== null) {
      await db.update(adminSettings).set({ value }).where(eq(adminSettings.key, key));
    } else {
      await db.insert(adminSettings).values({ key, value });
    }
  }
  async listSettings(): Promise<AdminSetting[]> {
    return db.select().from(adminSettings);
  }
  // Subscribers
  async addSubscriber(email: string): Promise<Subscriber> {
    const [sub] = await db.insert(subscribers).values({ email }).onConflictDoNothing().returning();
    if (!sub) {
      const [existing] = await db.select().from(subscribers).where(eq(subscribers.email, email));
      return existing;
    }
    return sub;
  }
  async listSubscribers(): Promise<Subscriber[]> {
    return db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
  }
  async deleteSubscriber(id: number): Promise<void> {
    await db.delete(subscribers).where(eq(subscribers.id, id));
  }
  async getSubscriberCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)::int` }).from(subscribers);
    return result.count;
  }

  async getProductCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)::int` }).from(products);
    return result.count;
  }

  async createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission> {
    const [sub] = await db.insert(contactSubmissions).values(data).returning();
    return sub;
  }
  async listContactSubmissions(): Promise<ContactSubmission[]> {
    return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }
  async markContactRead(id: number): Promise<ContactSubmission | undefined> {
    const [sub] = await db.update(contactSubmissions).set({ isRead: true }).where(eq(contactSubmissions.id, id)).returning();
    return sub;
  }
  async deleteContactSubmission(id: number): Promise<void> {
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  }
  async getUnreadContactCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`count(*)::int` }).from(contactSubmissions).where(eq(contactSubmissions.isRead, false));
    return result.count;
  }
}

export const storage = new DatabaseStorage();
