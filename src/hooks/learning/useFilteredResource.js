import { useState, useEffect, useCallback } from "react";

export function useFilteredResource(
  fetchFn,
  {
    filters = {},
    perPage = 10,
    defaultSort = "created_at",
    defaultOrder = "desc",
  },
) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(defaultSort);
  const [order, setOrder] = useState(defaultOrder);
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchFn({
        page,
        sort,
        order,
        search,
        perPage,
        ...filters,
      });
      setItems(result.data || []);
      setMeta(result.meta || null);
    } catch (err) {
      console.error("Error loading resource:", err);
      setItems([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [page, sort, order, search, perPage, filters, fetchFn]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    items,
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
    reload: loadData,
  };
}

// Cách dùng:
// CourseListPage: const { items: courses, meta, loading, ... } = useFilteredResource(fetchCoursesByProgram, { filters: { programId } });
// LessonListPage: const { items: lessons, meta, loading, ... } = useFilteredResource(fetchLessons, { filters: { programId, courseId } });
// FlashcardListPage: const { items: flashcards, meta, loading, ... } = useFilteredResource(fetchFlashcards, { filters: { programId, courseId, lessonId }, perPage: 20, defaultSort: "order", defaultOrder: "asc" });


