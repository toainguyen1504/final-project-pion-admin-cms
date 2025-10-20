import { useState, useEffect } from "react";
import { slugify } from "@/lib/utils";

/**
 * SEO snippet hook
 * Logic SEO state (good / ok / bad) for title, description, slug
 */
export function useSeoSnippet() {
  const BASE_URL = "https://pion.edu.vn/";

  // --- Default constants
  const DEFAULT_SEO = {
    title: "Your post title will appear here...",
    slug: "your-post-url",
    desc: "A short SEO-friendly description of your post will appear here...",
  };

  // States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);

  // Limits
  const MAX_TITLE = 60;
  const MAX_SLUG = 60;
  const MAX_DESC = 160;

  // Auto slugify if not manually edited
  useEffect(() => {
    if (!isSlugEdited) setSlug(slugify(title));
  }, [title, isSlugEdited]);

  const handleSlugChange = (value) => {
    setSlug(value);
    setIsSlugEdited(true);
  };

  /**   
    Dynamic progress colors
   */
  const getProgressColor = (type, value) => {
    if (!value) return "bg-gray-300";

    // --- Title ---
    if (type === "title") {
      const len = value.length;
      if (len >= 50 && len <= 60)
        return "bg-gradient-to-r from-green-400 to-green-500"; // good
      if (len >= 36 && len < 50)
        return "bg-gradient-to-r from-yellow-400 to-yellow-500"; // ok
      return "bg-gradient-to-r from-red-500 to-red-600"; // bad
    }

    // --- Description ---
    if (type === "description") {
      const len = value.length;
      if (len >= 120 && len <= 160)
        return "bg-gradient-to-r from-green-400 to-green-500";
      if (len >= 90 && len < 120)
        return "bg-gradient-to-r from-yellow-400 to-yellow-500";
      return "bg-gradient-to-r from-red-500 to-red-600";
    }

    // --- Slug ---
    if (type === "slug") {
      const normalized = slugify(value);
      const len = normalized.length;
      const words = normalized.split("-").filter(Boolean).length;

      if ((len >= 20 && len <= 35) || (words >= 3 && words <= 5))
        return "bg-gradient-to-r from-green-400 to-green-500";
      if ((len >= 36 && len <= 60) || (words >= 6 && words <= 8))
        return "bg-gradient-to-r from-yellow-400 to-yellow-500";
      return "bg-gradient-to-r from-red-500 to-red-600";
    }

    return "bg-gray-300";
  };

  return {
    BASE_URL,
    DEFAULT_SEO,
    title,
    slug,
    desc,
    setTitle,
    setSlug: handleSlugChange,
    setDesc,
    MAX_TITLE,
    MAX_SLUG,
    MAX_DESC,
    getProgressColor,
  };
}
