import axiosInstance from "@/utils/axiosInstance";

const TOKEN = import.meta.env.VITE_API_TOKEN;

// ----------- PUBLIC ROUTES (index, show, stats) -----------
// Get Categories
export async function fetchCategories(
  page = 1,
  sort = "updated_at",
  order = "desc",
  search = ""
) {
  try {
    const response = await axiosInstance.get("/categories", {
      params: { page, sort, order, search },
    });

    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      data: [],
      meta: null,
    };
  }
}

// Tính thống kê cho stats dashboard
export async function fetchCategoryStats() {
  try {
    const response = await axiosInstance.get("/categories/stats");
    const { data } = response.data;

    return {
      total: data.total || 0,
      this_month: data.this_month || 0,
      last_month: data.last_month || 0,
    };
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // console.error("Error fetching category stats:", error);
    return {
      total: 0,
      this_month: 0,
      last_month: 0,
    };
  }
}

// Get single category
export async function fetchCategory(id) {
  try {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

// ----------- ADMIN ROUTES (create, update, delete, bulk) -----------
// Create Category
export async function createCategory(payload) {
  try {
    const response = await axiosInstance.post("/admin/categories", payload);

    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

// Update Category
export async function updateCategory(id, payload) {
  try {
    const response = await axiosInstance.put(`/admin/categories/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

// Delete single category
export async function deleteCategory(id) {
  try {
    const response = await axiosInstance.delete(`/admin/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

// Delete multiple categories
export async function bulkDeleteCategories(ids) {
  try {
    const response = await axiosInstance.post("/admin/categories/bulk-destroy", {
      ids,
    });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting categories:", error);
    throw error;
  }
}
