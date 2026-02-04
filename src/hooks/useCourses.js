import { useEffect, useState, useRef } from "react";
import { fetchCourses } from "@/lib/api/courses";

export function useCourses() {
  const [courses, setCourses] = useState([]);
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
      const result = await fetchCourses(page, sort, order, search);
      setCourses(result.data || []);
      setMeta(result.meta || null);
    } catch (error) {
      console.error("Error loading courses:", error);
      setCourses([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sort, order, search]);

  return {
    courses,
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
    reloadCourses: fetchData,
  };
}
