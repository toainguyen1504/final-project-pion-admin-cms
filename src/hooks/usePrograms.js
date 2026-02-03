import { useEffect, useState, useRef } from "react";
import { fetchPrograms } from "@/lib/api/programs";

export function usePrograms() {
  const [programs, setPrograms] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const isFirstLoad = useRef(true);

  const fetchData = async () => {
    if (isFirstLoad.current) {
      setLoading(true);
      isFirstLoad.current = false;
    }

    try {
      const result = await fetchPrograms(page, sort, order, search);
      setPrograms(result.data || []);
      setMeta(result.meta || null);
    } catch (error) {
      console.error("Error loading programs:", error);
      setPrograms([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sort, order, search]);

  return {
    programs,
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
    reloadPrograms: fetchData,
  };
}
