import { useEffect, useState, useRef } from "react";
import { fetchCategories } from "@/lib/api/categories";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true); // load page
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated_at");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const isFirstLoad = useRef(true);

  const fetchData = async () => {
    // fisrt mount -> loading page else loading table
    if (isFirstLoad.current) {
      setLoading(true);
      isFirstLoad.current = false;
    }

    try {
      const { data, meta } = await fetchCategories(page, sort, order, search);
      setCategories(data);
      setMeta(meta);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sort, order, search]);

  return {
    categories,
    meta,
    loading,
    page,
    setPage,
    sort,
    setSort,
    order,
    setOrder,
    search,
    setSearch,
    reloadCategories: fetchData,
  };
}