import { useEffect, useState, useRef } from "react";
import { mockRoles } from "@/data/mockRoles"; // mock data

export function useRoles() {
  const [roles, setRoles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updatedAt");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const isFirstLoad = useRef(true);

  const fetchData = async () => {
    if (isFirstLoad.current) {
      setLoading(true);
      isFirstLoad.current = false;
    }

    try {
      let data = [...mockRoles];

      // search theo name hoặc label
      if (search) {
        data = data.filter(
          (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            (r.label && r.label.toLowerCase().includes(search.toLowerCase()))
        );
      }

      // sort
      data.sort((a, b) => {
        const valA = a[sort];
        const valB = b[sort];
        if (order === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });

      // phân trang giả lập (5 item/trang)
      const perPage = 5;
      const start = (page - 1) * perPage;
      const paginated = data.slice(start, start + perPage);

      setRoles(paginated);
      setMeta({
        current_page: page,
        last_page: Math.ceil(data.length / perPage),
        total: data.length,
      });
    } catch (error) {
      console.error("Error loading roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sort, order, search]);

  return {
    roles,
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
    reloadRoles: fetchData,
  };
}
