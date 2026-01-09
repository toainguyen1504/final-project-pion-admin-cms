import axiosInstance from "@/utils/axiosInstance";

// ----------- PUBLIC ROUTES (index, show, stats) -----------
// MOCKUP -> FIX sau khi code backend

// Get all roles
export async function fetchRoles(page = 1, sort = "updated_at", order = "desc", search = "") {
  try {
    const response = await axiosInstance.get("/roles", {
      params: { page, sort, order, search },
    });

    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return {
      data: [],
      meta: null,
    };
  }
}

// Get single role
export async function fetchRole(id) {
  try {
    const response = await axiosInstance.get(`/roles/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
}

// Get role stats
export async function fetchRoleStats() {
  try {
    const response = await axiosInstance.get("/roles/stats");
    const { data } = response.data;

    return {
      total: data.total || 0,
      this_month: data.this_month || 0,
      last_month: data.last_month || 0,
    };
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return {
      total: 0,
      this_month: 0,
      last_month: 0,
    };
  }
}

// ----------- ADMIN ROUTES (create, update, delete, bulk) -----------

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

// Bulk delete roles
export async function bulkDeleteRoles(ids) {
  try {
    const response = await axiosInstance.post("/admin/roles/bulk-destroy", { ids });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting roles:", error);
    throw error;
  }
}
