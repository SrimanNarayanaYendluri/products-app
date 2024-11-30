import { pgTable, serial, text, varchar, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  product_code: varchar("product_code").unique().notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity"). notNull(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at"),
  deleted_at: timestamp("deleted_at"),
}, (table) => ({
  productCodeIndex: index("code_idx").on(table.product_code),
  nameIndex: index("name_idx").on(table.name),
  priceIndex: index("price_idx").on(table.price),
  activeIndex: index("active_idx").on(table.is_active),
  updatedIndex: index("updated_at_idx").on(table.updated_at),
  createdAtIndex: index("created_at_idx").on(table.created_at),
  deletedIndex: index("deleted_at_idx").on(table.deleted_at),
}));

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert; 
export type ProductsTable = typeof products;
