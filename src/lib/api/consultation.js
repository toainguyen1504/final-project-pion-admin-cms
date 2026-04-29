import axiosInstance from "@/utils/axiosInstance";

// Lấy danh sách consultations (admin)
export const getConsultations = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/admin/consultations", {
      params,
    });
    // console.log("Consultations API:", response.data);

    // return response.data; // { success, data, meta }
    return response.data.data || []; // get data
  } catch (error) {
    console.error("Lỗi khi lấy danh sách consultations:", error);
    throw error.response?.data || error;
  }
};

// Xuất file Excel
export const exportConsultations = async () => {
  try {
    const response = await axiosInstance.get("/admin/consultations/export", {
      responseType: "blob", // Quan trọng để tải file Excel
    });

    // Tạo URL blob và tự động tải xuống
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "consultations.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // Dọn bộ nhớ
  } catch (error) {
    console.error("Lỗi khi xuất Excel:", error);
    throw error.response?.data || error;
  }
};

// hiển thị cho dashboard - thống kê
export async function fetchConsultationStats(field = "created_at") {
  try {
    const response = await axiosInstance.get("/admin/consultations/stats", {
      params: { field },
    });

    const data = response?.data?.data || {};

    return {
      total: data.total || 0,
      this_month: data.this_month || 0,
      last_month: data.last_month || 0,
    };
  } catch (error) {
    console.error("Error fetching consultation stats:", error);
    return {
      total: 0,
      this_month: 0,
      last_month: 0,
    };
  }
}