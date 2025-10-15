import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api/categories";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      setLoading(false);
    };

    load();
  }, []);

  return { categories, loading };
}