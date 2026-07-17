import { afterEach, describe, expect, it, vi } from "vitest";

describe("auth initialization", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("does not require DATABASE_URL while route modules are evaluated", async () => {
    vi.stubEnv("DATABASE_URL", "");

    const authModule = await import("@/lib/auth");
    const apiModule = await import("@/lib/api/app");

    expect(authModule.getAuth).toBeTypeOf("function");
    expect(apiModule.default).toBeDefined();
  });
});
