import axiosInstance from "@/utils/axiosInstance";

// ----------- ADMIN ROUTES (index, create, update, delete, bulk) -----------
// ----------- chỉ có admin, super_admin và teacher có quyền -----------

// Get all programs
export async function fetchPrograms(
  page = 1,
  sort = "created_at",
  order = "desc",
  search = "",
) {
  try {
    const response = await axiosInstance.get("/admin/programs", {
      params: { page, sort, order, search },
    });

    return {
      data: response.data.data,
      meta: response.data.meta,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching programs:", error);
    return { data: [], meta: null, success: false };
  }
}

// Get single program
export async function fetchProgram(id) {
  try {
    const response = await axiosInstance.get(`/admin/programs/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching program:", error);
    return null;
  }
}

// Create program
export async function createProgram(payload) {
  try {
    const response = await axiosInstance.post("/admin/programs", payload);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error creating program:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create program.",
    };
  }
}

// Update program
export async function updateProgram(id, payload) {
  try {
    const response = await axiosInstance.put(`/admin/programs/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating program:", error);
    throw error;
  }
}

// Delete single program
export async function deleteProgram(id) {
  try {
    const response = await axiosInstance.delete(`/admin/programs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting program:", error);
    throw error;
  }
}

// Bulk delete programs
export async function bulkDeletePrograms(ids) {
  try {
    const response = await axiosInstance.post("/admin/programs/bulk-destroy", {
      ids,
    });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting programs:", error);
    throw error;
  }
}

// Stats (nếu cần cho dashboard)
export async function fetchProgramStats() {
  try {
    const response = await axiosInstance.get("/admin/programs/stats");
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
