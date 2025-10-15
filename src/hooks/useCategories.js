import { useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api/categories";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [sort, setSort] = useState("updated_at");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, meta } = await fetchCategories(page, sort, order);
      setCategories(data);
      setMeta(meta);
      setLoading(false);
    };

    load();
  }, [page, sort, order]);

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
  };
}