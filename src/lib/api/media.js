import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PRODUCTION;

const TOKEN = import.meta.env.VITE_API_TOKEN;

// 🧩 Lấy toàn bộ media (KHÔNG phân trang)
export async function fetchMedia() {
  try {
    const response = await axios.get(`${BASE_URL}/media`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    console.log(">>> get data media", response.data.data);
    // Nếu API trả về { data: [...], meta: {...} }
    // thì chỉ cần trả về mảng data
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Error fetching media:", error);
    return [];
  }
}

// 🧩 Upload media (1 hoặc nhiều file)
export async function uploadMedia(files) {
  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files[]", files[i]);
    }

    const response = await axios.post(`${BASE_URL}/media`, formData, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Upload response:", response.data);
    return response.data.data || [];
  } catch (error) {
    console.error("❌ Error uploading media:", error);
    throw error;
  }
}
