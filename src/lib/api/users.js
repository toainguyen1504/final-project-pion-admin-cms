import axiosInstance from "@/utils/axiosInstance";

// ----------- PUBLIC ROUTES (index, show, stats) -----------
// MOCKUP -> FIX sau khi code backend

// Get all users
export async function fetchUsers(page = 1, sort = "created_at", order = "desc", search = "") {
  try {
    const response = await axiosInstance.get("/users", {
      params: { page, sort, order, search },
    });

    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      data: [],
      meta: null,
    };
  }
}

// Get single user
export async function fetchUser(id) {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Get user stats
export async function fetchUserStats() {
  try {
    const response = await axiosInstance.get("/users/stats");
    const { data } = response.data;

    return {
      total: data.total || 0,
      active: data.active || 0,
      inactive: data.inactive || 0,
      this_month: data.this_month || 0,
    };
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      this_month: 0,
    };
  }
}

// ----------- ADMIN ROUTES (create, update, delete, bulk) -----------

// Create user
export async function createUser(payload) {
  try {
    const response = await axiosInstance.post("/admin/users", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Update user
export async function updateUser(id, payload) {
  try {
    const response = await axiosInstance.put(`/admin/users/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Delete single user
export async function deleteUser(id) {
  try {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Bulk delete users
export async function bulkDeleteUsers(ids) {
  try {
    const response = await axiosInstance.post("/admin/users/bulk-destroy", { ids });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting users:", error);
    throw error;
  }
}
