import axiosInstance from "@/utils/axiosInstance";

// ----------- ADMIN ROUTES (index, show) -----------

// Roles có thể gán cho tài khoản (trừ super_admin, guest) - đang dùng
export async function fetchAvailableRoles() {
  try {
    const response = await axiosInstance.get("/admin/roles/available");
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching available roles:", error);
    return [];
  }
}

// Get all roles - đang (dùng cho table list)
export async function fetchRoles(
  page = 1,
  sort = "updated_at",
  order = "desc",
  search = "",
) {
  try {
    const response = await axiosInstance.get("/admin/roles", {
      params: { page, sort, order, search },
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return { data: [], meta: null };
  }
}

// Get single role - none
export async function fetchRole(id) {
  try {
    const response = await axiosInstance.get(`/admin/roles/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
}

// gán role cho user

// ----------- (create, update, delete, bulk) -----------

// Create role
export async function createRole(payload) {
  try {
    const response = await axiosInstance.post("/admin/roles", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
}

// Update role
export async function updateRole(id, payload) {
  try {
    const response = await axiosInstance.put(`/admin/roles/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
}

// Delete single role
export async function deleteRole(id) {
  try {
    const response = await axiosInstance.delete(`/admin/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
}

// Delete multiple roles
export async function bulkDeleteRoles(ids) {
  try {
    const response = await axiosInstance.post("/admin/roles/bulk-destroy", {
      ids,
    });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting roles:", error);
    throw error;
  }
}
