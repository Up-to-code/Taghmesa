import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createImageStorage, InvalidImageError, MAX_IMAGE_SIZE } from "@/lib/image-storage";

const temporaryDirectories: string[] = [];

async function localStorage() {
  const directory = await mkdtemp(path.join(tmpdir(), "taghmeesa-uploads-"));
  temporaryDirectories.push(directory);
  return {
    directory,
    storage: createImageStorage({
      mode: "local",
      publicUploadsDirectory: directory,
      blobClient: { put: vi.fn(), del: vi.fn() },
    }),
  };
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("image storage", () => {
  it("stores a validated image under a secure generated filename", async () => {
    const { directory, storage } = await localStorage();
    const file = new File([new Uint8Array([1, 2, 3])], "../../unsafe.png", { type: "image/png" });

    const url = await storage.save({ namespace: "products", ownerId: 12, file });

    expect(url).toMatch(/^\/uploads\/products\/12-[0-9a-f-]{36}\.png$/);
    expect(await readFile(path.join(directory, url.replace("/uploads/", "")))).toEqual(Buffer.from([1, 2, 3]));
    expect(url).not.toContain("unsafe");
  });

  it("rejects unsupported and empty files", async () => {
    const { storage } = await localStorage();

    await expect(storage.save({
      namespace: "categories",
      ownerId: 1,
      file: new File(["not an image"], "image.svg", { type: "image/svg+xml" }),
    })).rejects.toBeInstanceOf(InvalidImageError);
    await expect(storage.save({
      namespace: "categories",
      ownerId: 1,
      file: new File([], "empty.png", { type: "image/png" }),
    })).rejects.toBeInstanceOf(InvalidImageError);
    await expect(storage.save({
      namespace: "categories",
      ownerId: 1,
      file: new File([new Uint8Array(MAX_IMAGE_SIZE + 1)], "large.png", { type: "image/png" }),
    })).rejects.toBeInstanceOf(InvalidImageError);
  });

  it("deletes local uploads but refuses traversal and unrelated public files", async () => {
    const { directory, storage } = await localStorage();
    const file = new File(["image"], "image.webp", { type: "image/webp" });
    const url = await storage.save({ namespace: "categories", ownerId: 4, file });
    const storedPath = path.join(directory, url.replace("/uploads/", ""));

    await storage.remove("/products/1.webp");
    await storage.remove("/uploads/../outside.webp");
    await storage.remove(url);

    await expect(readFile(storedPath)).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("uses Blob for production storage and Blob URL deletion", async () => {
    const put = vi.fn().mockResolvedValue({ url: "https://store.public.blob.vercel-storage.com/products/image.png" });
    const del = vi.fn().mockResolvedValue(undefined);
    const storage = createImageStorage({
      mode: "blob",
      publicUploadsDirectory: "/unused",
      blobClient: { put, del },
    });
    const file = new File(["image"], "image.png", { type: "image/png" });

    const url = await storage.save({ namespace: "products", ownerId: 9, file });
    await storage.remove(url);

    expect(put).toHaveBeenCalledOnce();
    expect(put.mock.calls[0][0]).toMatch(/^products\/9-[0-9a-f-]{36}\.png$/);
    expect(del).toHaveBeenCalledWith(url);
  });
});
