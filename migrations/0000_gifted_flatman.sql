CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"product_code" varchar(100),
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "products_product_code_unique" UNIQUE("product_code")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "code_idx" ON "products" USING btree ("product_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "products" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "price_idx" ON "products" USING btree ("price");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "active_idx" ON "products" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "updated_at_idx" ON "products" USING btree ("updated_at");