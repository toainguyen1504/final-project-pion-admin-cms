import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api/categories";
import { fetchPosts } from "@/lib/api/posts";

export function useMenuCounts() {
  const [counts, setCounts] = useState({
    categories: null,
    posts: null,
  });

  useEffect(() => {
    async function loadCounts() {
      try {
        const [categoryRes, postRes] = await Promise.all([
          fetchCategories(1),
          fetchPosts(1),
        ]);

        setCounts({
          categories: categoryRes.meta?.total || 0,
          posts: postRes.meta?.total || 0,
        });
      } catch (error) {
        console.error("Error loading menu counts:", error);
        setCounts({
          categories: 0,
          posts: 0,
        });
      }
    }

    loadCounts();
  }, []);

  return counts;
}
