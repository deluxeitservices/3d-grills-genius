# 3D GRILLS GENIUS - E-Commerce Platform

## Overview
Full-featured e-commerce website for luxury custom grillz/jewellery with admin panel, Stripe checkout, user accounts, and CMS.

## Tech Stack
- **Frontend**: React + Vite, TanStack Query, wouter (routing), Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript, Drizzle ORM
- **Database**: PostgreSQL
- **Payments**: Stripe (session-based checkout)
- **Auth**: Session-based with bcrypt password hashing

## Design System
- Brand: "3D GRILLS GENIUS" (Cinzel serif, gold gradient)
- Colors: black bg, red primary, white text
- Fonts: Oswald (headings via `font-heading`), system sans body
- Logo: `client/src/assets/logo.jpeg`
- Sharp edges: `rounded-none`

## Project Structure
```
shared/schema.ts          - Drizzle schema + Zod insert schemas + types
server/
  db.ts                   - Database connection
  index.ts                - Server entry (Express + Vite)
  routes.ts               - All API routes (public + admin)
  storage.ts              - DatabaseStorage class (all CRUD operations)
  seed.ts                 - Seed data script
  seed-cms.ts             - Seed CMS pages script
client/src/
  App.tsx                 - Root routes (admin + public)
  contexts/               - AuthContext, CartContext
  lib/                    - apiRequest, queryClient
  components/layout/      - Layout, Header, Footer
  pages/                  - Public pages (Home, Shop, ProductDetail, etc.)
  pages/admin/            - Admin panel pages
```

## Admin Panel (/admin)
- **Credentials**: admin@3dgrillsgenius.com / admin123
- **Layout**: Shopify-inspired sidebar with grouped nav sections
- **Pages**: Dashboard, Products (full-page editor), Categories (full-page editor), Banners, Reviews, CMS Pages, Orders, Contacts, Subscribers, SEO, Settings
- **Product/Category editing**: Full-page forms (not modals)
- **Contact submissions**: Public contact form on /page/contact-us, viewable in admin

## Database Tables
users, categories, products, product_prices, product_attributes, product_attribute_values, banners, reviews, orders, order_items, cms_pages, seo_settings, invoices, admin_settings, subscribers, contact_submissions

## Key Patterns
- `resolveImage()` / `resolveAdminImage()` - Maps Vite asset paths to imported modules for seed data images
- `apiRequest()` - Centralized API call utility with error handling
- wouter `<Link>` renders its own `<a>` — never wrap with `<a>`
- Country-based pricing: product_prices table with countryCode/currency
- CMS pages served at /page/:slug, legacy routes (/about, /contact, /faq) mapped via pathToSlugMap

## CMS Pages (seeded)
faq, contact-us, how-it-works, how-to-use-mould-kit, return-exchanges, privacy-policy, terms-of-service, refund-policy
