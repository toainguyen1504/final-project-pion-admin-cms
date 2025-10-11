import { useEffect, useState } from "react";
import { mockPosts } from "@/data/mockPosts";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch call api
    const fetchData = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500)); // mock delay
      setPosts(mockPosts);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { posts, loading };
}
