CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_ar" varchar(80) NOT NULL,
	"name_en" varchar(80) DEFAULT '' NOT NULL,
	"slug" varchar(100) NOT NULL,
	"image_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subcategories" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name_ar" varchar(80) NOT NULL,
	"name_en" varchar(80) DEFAULT '' NOT NULL,
	"slug" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "subcategory_id" integer;--> statement-breakpoint
INSERT INTO "categories" ("name_ar", "name_en", "slug", "sort_order")
SELECT DISTINCT "category", '', 'legacy-' || md5("category"), dense_rank() OVER (ORDER BY "category")
FROM "products";--> statement-breakpoint
UPDATE "products"
SET "category_id" = "categories"."id"
FROM "categories"
WHERE "products"."category" = "categories"."name_ar";--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_active_sort_idx" ON "categories" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "subcategories_slug_idx" ON "subcategories" USING btree ("category_id","slug");--> statement-breakpoint
CREATE INDEX "subcategories_category_sort_idx" ON "subcategories" USING btree ("category_id","sort_order");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id","subcategory_id");
