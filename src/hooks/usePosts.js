import { useEffect, useState, useRef } from "react";
import { fetchPosts } from "@/lib/api/posts";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true); // loading page
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated_at");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const isFirstLoad = useRef(true);

  const fetchData = async () => {
    // load page
    if (isFirstLoad.current) {
      setLoading(true);
      isFirstLoad.current = false;
    }

    try {
      const { data, meta } = await fetchPosts(page, sort, order, search);
      setPosts(data);
      setMeta(meta);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sort, order, search]);

  return {
    posts,
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
    reloadPosts: fetchData,
  };
}