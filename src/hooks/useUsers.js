import { useCallback, useEffect, useState } from "react";
import { fetchUsers } from "@/lib/api/users";

function normalizeUser(user) {
  return {
    ...user,
    display_name: user.display_name || user.name || "",
    profile_image: user.profile_image || user.avatar || null,
    createdAt: user.createdAt || user.created_at || null,
    role: user.role || null,
  };
}

function mapSortField(sort) {
  const sortMap = {
    display_name: "display_name",
    createdAt: "created_at",
    created_at: "created_at",
    email: "email",
    phone: "phone",
  };

  return sortMap[sort] || "created_at";
}

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetchUsers(
        page,
        mapSortField(sort),
        order,
        search,
      );

      const normalizedUsers = Array.isArray(response.data)
        ? response.data.map(normalizeUser)
        : [];

      setUsers(normalizedUsers);
      setMeta(response.meta);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [page, sort, order, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setPage(1);
  }, [search]);

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
    reloadUsers: loadUsers,
  };
}
