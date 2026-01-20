import { useEffect, useState, useRef } from "react";
// import { fetchUsers } from "@/lib/api/users"; // FIX sau khi code backend xong
import { mockUsers } from "@/data/mockUsers"; // mock data

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true); // load page
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const isFirstLoad = useRef(true);

  const fetchData = async () => {
    if (isFirstLoad.current) {
      setLoading(true);
      isFirstLoad.current = false;
    }
    
    try {
      // giả lập filter, sort, search trên mockUsers
      let data = [...mockUsers];

      // search theo display_name hoặc email
      if (search) {
        data = data.filter(
          (u) =>
            u.display_name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      // sort theo field

      data.sort((a, b) => {
        const valA = a[sort];
        const valB = b[sort];
        if (order === "asc") return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });

      // phân trang giả lập (10 item mỗi trang)
      const perPage = 6;
      const start = (page - 1) * perPage;
      const paginated = data.slice(start, start + perPage);
      setUsers(paginated);
      setMeta({
        current_page: page,
        last_page: Math.ceil(data.length / perPage),
        total: data.length,
      });
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sort, order, search]);

  return {
    users,
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
    reloadUsers: fetchData,
  };
}
