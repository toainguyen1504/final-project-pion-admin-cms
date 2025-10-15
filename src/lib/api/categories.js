import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PRODUCTION;

const TOKEN = import.meta.env.VITE_API_TOKEN;

export async function fetchCategories() {
  try {
    const response = await axios.get(`${BASE_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
