import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PRODUCTION;

const TOKEN = import.meta.env.VITE_API_TOKEN;

export async function fetchCategories(
  page = 1,
  sort = "updated_at",
  order = "desc"
) {
  try {
    const response = await axios.get(`${BASE_URL}/categories`, {
      params: {
        page,
        sort,
        order,
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