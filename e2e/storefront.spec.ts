import { expect, test } from "@playwright/test";

test("uses real routes and renders the RTL storefront", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: /اكتشف نكهاتنا/ })).toBeVisible();
  await page.getByRole("navigation", { name: "التنقل الرئيسي" }).getByRole("link", { name: "المتجر", exact: true }).click();
  await expect(page).toHaveURL(/\/shop/);
  await expect(page.getByRole("heading", { name: "الفئات" })).toBeVisible();
});

test("filters products and carries the in-memory cart to checkout", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("button", { name: /غموس/ }).click();
  await expect(page.getByText("محبوج", { exact: true })).toBeVisible();
  await page.locator(".product-card").first().getByRole("button", { name: /أضف للسلة/ }).click();
  await page.getByRole("button", { name: /السلة/ }).click();
  await expect(page.getByRole("dialog", { name: "سلة التسوق" })).toBeVisible();
  await page.getByRole("link", { name: "إتمام الطلب" }).click();
  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByText("عند الاستلام", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: /بطاقة/ })).toBeDisabled();
});

test("custom product sort menu supports keyboard selection", async ({ page }) => {
  await page.goto("/shop");
  const sortTrigger = page.getByRole("button", { name: /ترتيب المنتجات/ });
  await expect(page.locator(".shop-toolbar select")).toHaveCount(0);
  await sortTrigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("listbox", { name: "ترتيب المنتجات" })).toBeVisible();
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(sortTrigger).toContainText("الاسم أبجدياً");
});

test("product cards expose cart quantity controls for the selected size", async ({ page }) => {
  await page.goto("/shop");
  const card = page.locator(".product-card").first();
  await card.getByRole("button", { name: /أضف للسلة/ }).click();
  await expect(card.getByRole("group", { name: /كمية/ })).toBeVisible();
  await expect(card.locator(".image-quantity-control output")).toHaveText("1");
  await card.getByRole("button", { name: /زيادة كمية/ }).click();
  await expect(card.locator(".image-quantity-control output")).toHaveText("2");
  await card.getByRole("button", { name: /تقليل كمية/ }).click();
  await card.getByRole("button", { name: /تقليل كمية/ }).click();
  await expect(card.getByRole("button", { name: /أضف للسلة/ })).toBeVisible();
});

test("mobile add-to-cart motion reaches the visible tab and updates its state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/shop");
  const card = page.locator(".product-card").first();
  const cartTab = page.getByRole("navigation", { name: "التنقل عبر التطبيق" }).getByRole("button", { name: /^السلة/ });

  await expect(cartTab).toBeVisible();
  await card.getByRole("button", { name: /أضف للسلة/ }).click();

  await expect(page.locator(".global-cart-flight")).toBeVisible();
  await expect(cartTab).toHaveAttribute("aria-label", /السلة، 1 منتجات/);
  await expect(card.locator(".image-quantity-control output")).toHaveText("1");
  await expect(page.locator(".global-cart-flight")).toHaveCount(0, { timeout: 2_000 });

  await cartTab.click();
  await expect(page.getByRole("dialog", { name: "سلة التسوق" }).locator(".cart-item")).toHaveCount(1);
});

test("cart drawer opens on the right and closes without mobile overflow", async ({ page }) => {
  await page.setViewportSize({ width: 365, height: 750 });
  await page.goto("/");
  await page.getByRole("button", { name: /السلة/ }).click();

  const dialog = page.getByRole("dialog", { name: "سلة التسوق" });
  await expect(dialog).toBeVisible();
  await expect(page.locator(".cart-drawer")).toHaveCSS("right", "0px");
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);

  await page.getByRole("button", { name: "إغلاق", exact: true }).click();
  await expect(dialog).toBeHidden();
});

test("mobile home behaves like an app and opens the dedicated search screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.locator(".brand")).toContainText("تغميسة");
  await expect(page.locator(".mobile-carousel-slide")).toHaveCount(3);
  await page.getByRole("button", { name: "إيقاف العرض التلقائي" }).click();
  await page.getByRole("button", { name: "عرض الشريحة 1" }).click();
  const carousel = await page.locator(".mobile-carousel-viewport").boundingBox();
  expect(carousel).not.toBeNull();
  await page.mouse.move(carousel!.x + 90, carousel!.y + carousel!.height / 2);
  await page.mouse.down();
  await page.mouse.move(carousel!.x + 200, carousel!.y + carousel!.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(page.getByRole("button", { name: "عرض الشريحة 2" })).toHaveAttribute("aria-current", "true");
  await expect(page.locator(".category-card-media").first()).toBeVisible();

  await page.getByRole("link", { name: /ابحث عن منتج/ }).click();
  await expect(page).toHaveURL(/\/search/);
  await expect(page.getByRole("heading", { name: "دوّري على نكهتك" })).toBeVisible();
  await page.getByRole("searchbox", { name: "ابحثي في المنتجات" }).fill("ورق عنب");
  await expect(page.getByRole("heading", { name: "ورق عنب", exact: true })).toBeVisible();
});

test("mobile carousel responds to an RTL touch swipe", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "إيقاف العرض التلقائي" }).click();
  await page.getByRole("button", { name: "عرض الشريحة 1" }).click();

  const carousel = await page.locator(".mobile-carousel-viewport").boundingBox();
  expect(carousel).not.toBeNull();
  const session = await context.newCDPSession(page);
  const y = carousel!.y + carousel!.height / 2;
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: carousel!.x + 90, y }] });
  for (let x = 110; x <= 210; x += 20) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: carousel!.x + x, y }] });
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });

  await expect(page.getByRole("button", { name: "عرض الشريحة 2" })).toHaveAttribute("aria-current", "true");
  await context.close();
});

test("opens a responsive product details page and adds the selected size", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop");
  await page.locator(".product-card").first().getByRole("link", { name: /اعرف المزيد/ }).click();
  await expect(page).toHaveURL(/\/products\/\d+/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator(".detail-size-options button").last().click();
  await page.locator(".detail-buy").getByRole("button", { name: /أضف إلى السلة/ }).click();
  await expect(page.locator(".detail-buy").getByRole("button", { name: /تمت الإضافة/ })).toBeVisible();
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).resolves.toBe(true);
});

test("theme and mobile bottom navigation remain keyboard-operable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "تبديل المظهر" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "فتح القائمة" })).toHaveCount(0);
  const appNavigation = page.getByRole("navigation", { name: "التنقل عبر التطبيق" });
  await expect(appNavigation).toBeVisible();
  await expect(appNavigation).toHaveCSS("bottom", "0px");
  await expect(appNavigation).toHaveCSS("border-radius", "0px");
  await expect(appNavigation).toHaveCSS("box-shadow", "none");
  await expect(page.getByRole("link", { name: /تسجيل الدخول|حسابي/ })).toBeVisible();
  expect((await appNavigation.getByRole("link", { name: "المتجر", exact: true }).boundingBox())!.height).toBeGreaterThanOrEqual(44);

  await appNavigation.getByRole("button", { name: /^السلة/ }).click();
  const cartDialog = page.getByRole("dialog", { name: "سلة التسوق" });
  await expect(cartDialog).toBeVisible();
  await expect(cartDialog).toHaveAttribute("aria-hidden", "false");
  const layers = await page.evaluate(() => ({
    navigation: Number.parseInt(getComputedStyle(document.querySelector<HTMLElement>(".mobile-bottom-nav")!).zIndex, 10),
    cart: Number.parseInt(getComputedStyle(document.querySelector<HTMLElement>(".cart-overlay")!).zIndex, 10),
  }));
  expect(layers.cart).toBeGreaterThan(layers.navigation);
  await cartDialog.getByRole("button", { name: "إغلاق", exact: true }).click();

  await appNavigation.getByRole("link", { name: "المتجر", exact: true }).click();
  await expect(page).toHaveURL(/\/shop/);
});

test("bottom navigation remains visible in a scaled tablet preview", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 730 });
  await page.goto("/");
  const appNavigation = page.getByRole("navigation", { name: "التنقل عبر التطبيق" });
  await expect(appNavigation).toBeVisible();
  await expect(appNavigation).toHaveCSS("height", "60px");
  await expect(appNavigation).toHaveCSS("bottom", "0px");
});

test("admin pages enforce authentication", async ({ page }) => {
  await page.goto("/admin/products");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { name: "لوحة التحكم" })).toBeVisible();
});

test("customer email and password forms are available", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByRole("heading", { name: "إنشاء حساب" })).toBeVisible();
  await expect(page.getByLabel("الاسم")).toBeVisible();
  await expect(page.getByLabel("البريد الإلكتروني")).toBeVisible();
  await page.getByRole("link", { name: "سجّل الدخول" }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: "تسجيل الدخول" })).toBeVisible();
});

test("configured admin credentials can sign in", async ({ page }) => {
  test.skip(!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD, "Requires a seeded test database");
  await page.goto("/admin/login");
  await page.getByLabel("البريد الإلكتروني").fill(process.env.E2E_ADMIN_EMAIL!);
  await page.getByLabel("كلمة المرور").fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "دخول" }).click();
  await expect(page).toHaveURL(/\/admin\/products/);
  await expect(page.getByRole("heading", { name: /المنتجات/ })).toBeVisible();
});
