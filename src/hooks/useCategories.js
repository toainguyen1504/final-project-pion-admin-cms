import { useEffect, useState, useRef } from "react";
import { fetchCategories } from "@/lib/api/categories";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true); // load page
  const [tableLoading, setTableLoading] = useState(false); // loading when change page, sort, search
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated_at");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const isFirstLoad = useRef(true);

  useEffect(() => {
    const load = async () => {
      // fisrt mount -> loading page else loading table
      if (isFirstLoad.current) {
        setLoading(true);
        isFirstLoad.current = false;
      } else {
        setTableLoading(true);
      }

      try {
        const { data, meta } = await fetchCategories(page, sort, order, search);
        setCategories(data);
        setMeta(meta);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
        setTableLoading(false);
      }
    };

    load();
  }, [page, sort, order, search]);

  return {
    categories,
    meta,
    loading,
    tableLoading,
    page,
    setPage,
    sort,
    setSort,
    order,
    setOrder,
    search,
    setSearch,
  };
}