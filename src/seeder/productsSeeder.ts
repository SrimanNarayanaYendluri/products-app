import { eq } from "drizzle-orm";
import { db } from "../db/dbConnection";
import { products, NewProduct } from "../schemas/productSchema";
import { faker } from "@faker-js/faker";

export const seedProducts = async () => {
  try {
    console.log("Seeder script has started...");

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const fakeProducts: NewProduct[] = Array.from({ length: 20 }).map(() => {
      const createdAt = faker.date.between({
        from: sixMonthsAgo,
        to: new Date(),
      });
      const updatedAt = faker.date.between({
        from: createdAt,
        to: new Date(),
      });

      return {
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        product_code: faker.string.alphanumeric(10),
        price: parseInt(faker.commerce.price({ min: 0, max: 100000 })),
        quantity: faker.number.int({ min: 1, max: 1000 }),
        is_active: faker.datatype.boolean(),
        created_at: createdAt,
        updated_at: updatedAt,
        deleted_at: null,
      };
    });

    console.log("Generated fake products:", fakeProducts);

    for (const product of fakeProducts) {
      console.log(`Checking product with code: ${product.product_code}`);
      const existingProduct = await db
        .select()
        .from(products)
        .where(eq(products.product_code, product.product_code))
        .limit(1);

      if (existingProduct.length === 0) {
        console.log(`Inserting product: ${product.name}`);
        try {
          await db.insert(products).values(product);
        } catch (error) {
          console.error("Error inserting product:", product, error);
        }
      } else {
        console.log(`Product already exists: ${product.product_code}`);
      }
    }

    console.log("***Products details seeded successfully with UTC timestamps.***");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};