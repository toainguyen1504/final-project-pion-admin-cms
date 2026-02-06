import { useEffect, useState, useRef } from "react";
import { fetchLessons } from "@/lib/api/learning/lessons";

export function useLessons(courseId) {
  const [lessons, setLessons] = useState([]);
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
      const result = await fetchLessons(courseId, page, sort, order, search);
      setLessons(result.data || []);
      setMeta(result.meta || null);
    } catch (error) {
      console.error("Error loading lessons:", error);
      setLessons([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId, page, sort, order, search]);

  return {
    lessons,
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
    reloadLessons: fetchData,
  };
}
