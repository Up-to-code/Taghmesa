import { describe, expect, it } from "vitest";
import { filterProducts } from "@/domains/catalog/filter-products";
import { seedProducts } from "@/domains/catalog/seed-data";
import { orderInput, statusInput } from "@/lib/api/schemas";

describe("catalog filtering", () => {
  it("filters by category and price", () => {
    const result = filterProducts(seedProducts, { category: "غموس", query: "", minPrice: 36, maxPrice: 80, sort: "price-asc" });
    expect(result.map((product) => product.nameAr)).toEqual(["تعتيمة"]);
  });
  it("searches Arabic and English names", () => {
    expect(filterProducts(seedProducts, { category: "الكل", query: "Jaresh", minPrice: 0, maxPrice: 200, sort: "default" })[0].id).toBe(3);
  });
});

describe("API validation", () => {
  it("accepts only cash on delivery", () => {
    const base = { firstName: "أحمد", lastName: "محمد", phone: "0500000000", city: "الرياض", address: "عنوان صالح", items: [{ productId: 1, sizeId: 1, quantity: 1 }] };
    expect(orderInput.safeParse({ ...base, paymentMethod: "cod" }).success).toBe(true);
    expect(orderInput.safeParse({ ...base, paymentMethod: "card" }).success).toBe(false);
  });
  it("allows only known order statuses", () => {
    expect(statusInput.safeParse({ status: "delivered" }).success).toBe(true);
    expect(statusInput.safeParse({ status: "unknown" }).success).toBe(false);
  });
});
