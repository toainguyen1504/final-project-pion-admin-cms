import { useEffect, useState } from "react";
import { mockCategories } from "@/data/mockCategories";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch call api
    const fetchData = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500)); // mock delay
      setCategories(mockCategories);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { categories, loading };
}
