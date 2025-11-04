import axiosInstance from "@/utils/axiosInstance";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PRODUCTION;

const TOKEN = import.meta.env.VITE_API_TOKEN;

// ----------- PUBLIC ROUTES (index, show, stats) -----------
// 🧩 Lấy toàn bộ media (KHÔNG phân trang)
export async function fetchMedia() {
  try {
    const response = await axiosInstance.get("/media");

    // console.log(">>> get data media", response.data.data);
    // Nếu API trả về { data: [...], meta: {...} }
    // thì chỉ cần trả về mảng data
    return response.data.data || [];
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // console.error("❌ Error fetching media:", error);
    return [];
  }
}

// ----------- ADMIN ROUTES (create, update, delete, bulk) -----------
// 🧩 Upload media (1 hoặc nhiều file)
export async function uploadMedia(files) {
  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files[]", files[i]);
    }

    const response = await axiosInstance.post("/admin/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // console.log("Upload response:", response.data);
    return response.data.data || [];
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
}

// Xóa media theo ID
export async function deleteMedia(id) {
  try {
    const response = await axiosInstance.delete(`/admin/media/${id}`);

    // console.log("Media deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting media:", error);
    throw error;
  }
}
