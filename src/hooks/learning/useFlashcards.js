import { useState, useEffect, useCallback, useRef } from "react";
import { fetchFlashcards } from "@/lib/api/learning/flashcards";

export function useFlashcards({ lessonId, courseId, programId, perPage = 10 }) {
  const [flashcards, setFlashcards] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("order");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const isFirstLoad = useRef(true);

  const loadFlashcards = useCallback(async () => {
    if (isFirstLoad.current) {
      setLoading(true);
      isFirstLoad.current = false;
    }

    try {
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
        setFlashcards(result.data || []);
        setMeta(result.meta || null);
      } else {
        setFlashcards([]);
        setMeta(null);
      }
    } catch (error) {
      console.error("Error loading flashcards:", error);
      setFlashcards([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
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
