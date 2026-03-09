import { db } from "./db";
import { productAttributes, productAttributeValues, products } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedVariants() {
  console.log("Seeding metal type variants...");

  let metalAttr = (await db.select().from(productAttributes))[0];
  if (!metalAttr) {
    const [created] = await db.insert(productAttributes).values({
      name: "Metal & Stone Type",
      values: [],
    }).returning();
    metalAttr = created;
    console.log("Created 'Metal & Stone Type' attribute");
  } else {
    console.log(`Using existing attribute: ${metalAttr.name}`);
  }

  const variants = [
    { value: "Silver & Real Diamond", priceModifier: "0" },
    { value: "Silver & Cz", priceModifier: "-20" },
    { value: "Dental Yellow Gold & Cz", priceModifier: "50" },
    { value: "Dental Yellow Gold & Real Diamonds", priceModifier: "100" },
    { value: "Dental White Gold & Cz", priceModifier: "50" },
    { value: "Dental White Gold & Real Diamonds", priceModifier: "100" },
    { value: "14k Yellow Gold & Cz", priceModifier: "150" },
    { value: "14k Yellow Gold & Real Diamonds", priceModifier: "200" },
    { value: "14k Rose Gold & Cz", priceModifier: "150" },
    { value: "14k Rose Gold & Real Diamonds", priceModifier: "200" },
  ];

  const allProducts = await db.select().from(products);
  console.log(`Found ${allProducts.length} products`);

  for (const product of allProducts) {
    const existing = await db.select().from(productAttributeValues)
      .where(eq(productAttributeValues.productId, product.id));
    
    if (existing.length > 0) {
      console.log(`  ${product.name}: already has ${existing.length} variants, skipping`);
      continue;
    }

    for (const v of variants) {
      await db.insert(productAttributeValues).values({
        productId: product.id,
        attributeId: metalAttr.id,
        value: v.value,
        priceModifier: v.priceModifier,
      });
    }
    console.log(`  ${product.name}: added ${variants.length} variants`);
  }

  console.log("Variant seed complete!");
  process.exit(0);
}

seedVariants().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
