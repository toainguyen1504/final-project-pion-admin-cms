import { useState, useEffect, useCallback } from "react";
import { fetchFlashcards } from "@/lib/api/learning/flashcards";

export function useFlashcards({ lessonId, courseId, programId, perPage = 10 }) {
  const [flashcards, setFlashcards] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("order");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const loadFlashcards = useCallback(async () => {
    setLoading(true);
    const result = await fetchFlashcards({
      page,
      sort,
      order,
      search,
      lessonId,
      courseId,
      programId,
      perPage,
    });
    if (result.success) {
      setFlashcards(result.data);
      setMeta(result.meta);
    }
    setLoading(false);
  }, [page, sort, order, search, lessonId, courseId, programId, perPage]);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  return {
    flashcards,
    meta,
    loading,
    page,
    setPage,
    sort,
    order,
    setSort,
    setOrder,
    search,
    setSearch,
    reloadFlashcards: loadFlashcards,
  };
}
