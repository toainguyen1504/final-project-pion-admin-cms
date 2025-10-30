import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function normalizeText(input) {
  // đảm bảo trả về chuỗi rỗng với các giá trị null/undefined
  const str = typeof input === "string" ? input : input ?? "";
  return str.normalize
    ? str.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    : str.toLowerCase().trim();
}

export function slugify(input) {
  if (typeof input !== "string") return "";

  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function truncateText(text, maxLength = 60) {
  if (!text) return "—";
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}

export const getImagePostSrc = (media) => {
  if (!media) return "";
  const BASE_MEDIA_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_BASE_MEDIA_URL_LOCAL
      : import.meta.env.VITE_BASE_MEDIA_URL_PRODUCTION;

  return `${BASE_MEDIA_URL}${media.meta?.variants?.medium?.url || media.url}`;
};

export const getImageOGSrc = (media) => {
  if (!media) return "";

  const BASE_MEDIA_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_BASE_MEDIA_URL_LOCAL
      : import.meta.env.VITE_BASE_MEDIA_URL_PRODUCTION;

  // 1. Nếu có variant OG (chuẩn Open Graph)
  if (media.meta?.variants?.og?.url) {
    return `${BASE_MEDIA_URL}${media.meta.variants.og.url}`;
  }

  // 2. Nếu variant dùng `path` thay vì `url`
  if (media.meta?.variants?.og?.path) {
    return `${BASE_MEDIA_URL}/storage/${media.meta.variants.og.path}`;
  }

  // 3. Nếu không có OG → fallback sang thumbnail
  if (media.meta?.variants?.thumbnail?.url) {
    return `${BASE_MEDIA_URL}${media.meta.variants.thumbnail.url}`;
  }

  if (media.meta?.variants?.thumbnail?.path) {
    return `${BASE_MEDIA_URL}/storage/${media.meta.variants.thumbnail.path}`;
  }

  // 4. Cuối cùng fallback sang đường dẫn gốc
  if (media.url) {
    return `${BASE_MEDIA_URL}${
      media.url.startsWith("/") ? media.url : "/" + media.url
    }`;
  }

  // 5. Nếu không có gì → ảnh placeholder
  return "/placeholder_img.png";
};
