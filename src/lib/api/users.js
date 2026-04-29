import axiosInstance from "@/utils/axiosInstance";

// ----------- PUBLIC ROUTES (index, show, stats) -----------
// get /me để lấy thông tin cơ bản cho profile và update

// ----------- ADMIN ROUTES (create, update, delete, bulk) -----------

// Get all users
export async function fetchUsers(
  page = 1,
  sort = "created_at",
  order = "desc",
  search = "",
) {
  try {
    const response = await axiosInstance.get("/admin/users", {
      params: { page, sort, order, search },
    });

    return {
      data: response?.data?.data || [],
      meta: response?.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      data: [],
      meta: null,
    };
  }
}

// Get single user - chưa
export async function fetchUser(id) {
  try {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response?.data?.data || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Get user stats
export async function fetchUserStats(field = "created_at") {
  try {
    const response = await axiosInstance.get("/admin/users/stats", {
      params: { field },
    });

    const data = response?.data?.data || {};

    return {
      total: data.total || 0,
      this_month: data.this_month || 0,
      last_month: data.last_month || 0,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      total: 0,
      this_month: 0,
      last_month: 0,
    };
  }
}

// Create user - đang dùng
export async function createUser(payload) {
  try {
    const response = await axiosInstance.post("/admin/users", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Update user - chưa
export async function updateUser(id, payload) {
  try {
    const response = await axiosInstance.put(`/admin/users/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Delete single user - chưa
export async function deleteUser(id) {
  try {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// Bulk delete users - chưa
export async function bulkDeleteUsers(ids) {
  try {
    const response = await axiosInstance.post("/admin/users/bulk-destroy", {
      ids,
    });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting users:", error);
    throw error;
  }
}

// Reset password - đang dùng
export async function resetUserPassword(id) {
  try {
    const response = await axiosInstance.post(
      `/admin/users/${id}/reset-password`,
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}

// gán role cho user
