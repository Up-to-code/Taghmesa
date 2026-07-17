import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

export const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const IMAGE_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type ImageNamespace = "categories" | "products";

type BlobClient = {
  put: (pathname: string, file: File, options: { access: "public"; addRandomSuffix: boolean }) => Promise<{ url: string }>;
  del: (url: string) => Promise<void>;
};

type ImageStorageOptions = {
  mode: "blob" | "local";
  publicUploadsDirectory: string;
  blobClient: BlobClient;
};

type SaveImageInput = {
  namespace: ImageNamespace;
  ownerId: number;
  file: File;
};

export class InvalidImageError extends Error {
  constructor() {
    super("الصورة يجب أن تكون JPG أو PNG أو WebP وأقل من 4MB");
    this.name = "InvalidImageError";
  }
}

function imageExtension(file: File) {
  if (file.size <= 0 || file.size > MAX_IMAGE_SIZE) throw new InvalidImageError();
  const extension = IMAGE_EXTENSIONS[file.type as keyof typeof IMAGE_EXTENSIONS];
  if (!extension) throw new InvalidImageError();
  return extension;
}

function isBlobUrl(url: string) {
  try {
    const hostname = new URL(url).hostname;
    return hostname === "blob.vercel-storage.com" || hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

function localUploadPath(url: string, publicUploadsDirectory: string) {
  if (!url.startsWith("/uploads/")) return null;
  const pathname = url.split(/[?#]/, 1)[0];
  let relativePath: string;
  try {
    relativePath = decodeURIComponent(pathname.slice("/uploads/".length));
  } catch {
    return null;
  }
  if (!relativePath || path.isAbsolute(relativePath)) return null;
  const root = path.resolve(publicUploadsDirectory);
  const target = path.resolve(root, relativePath);
  return target.startsWith(`${root}${path.sep}`) ? target : null;
}

export function createImageStorage(options: ImageStorageOptions) {
  async function save({ namespace, ownerId, file }: SaveImageInput) {
    if (!Number.isSafeInteger(ownerId) || ownerId < 1) throw new Error("Invalid image owner");
    const extension = imageExtension(file);
    const filename = `${ownerId}-${randomUUID()}.${extension}`;
    const pathname = `${namespace}/${filename}`;

    if (options.mode === "blob") {
      const stored = await options.blobClient.put(pathname, file, {
        access: "public",
        addRandomSuffix: false,
      });
      return stored.url;
    }

    const directory = path.join(options.publicUploadsDirectory, namespace);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, filename), new Uint8Array(await file.arrayBuffer()), { flag: "wx" });
    return `/uploads/${pathname}`;
  }

  async function remove(url: string | null | undefined) {
    if (!url) return;
    if (isBlobUrl(url)) {
      await options.blobClient.del(url);
      return;
    }

    const target = localUploadPath(url, options.publicUploadsDirectory);
    if (!target) return;
    try {
      await unlink(target);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  return { save, remove };
}

const hasBlobCredentials = Boolean(
  process.env.BLOB_READ_WRITE_TOKEN || (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID),
);

export const imageStorage = createImageStorage({
  mode: process.env.NODE_ENV !== "production" && !hasBlobCredentials ? "local" : "blob",
  publicUploadsDirectory: path.join(process.cwd(), "public", "uploads"),
  blobClient: { put, del },
});
