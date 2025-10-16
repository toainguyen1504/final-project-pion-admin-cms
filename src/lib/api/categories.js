import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PRODUCTION;

const TOKEN = import.meta.env.VITE_API_TOKEN;

// Get Categories
export async function fetchCategories(
  page = 1,
  sort = "updated_at",
  order = "desc",
  search = ""
) {
  try {
    const response = await axios.get(`${BASE_URL}/categories`, {
      params: {
        page,
        sort,
        order,
        search,
      },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
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

// Create Category
export async function createCategory(payload) {
  try {
    const response = await axios.post(`${BASE_URL}/categories`, payload, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

// Delete single category
export async function deleteCategory(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/categories/${id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

// Delete multiple categories
export async function bulkDeleteCategories(ids) {
  try {
    const response = await axios.post(
      `${BASE_URL}/categories/bulk-destroy`,
      { ids }, // body
      {
        headers: { Authorization: `Bearer ${TOKEN}` }, // config
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting categories:", error);
    throw error;
  }
}
