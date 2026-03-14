import axiosInstance from "@/utils/axiosInstance";

// ----------- ADMIN ROUTES (index, create, update, delete, bulk) -----------
// ----------- chỉ có admin, super_admin và teacher có quyền -----------

// Get all lessons (không filter theo courseId)
export async function fetchAllLessons(
  page = 1,
  sort = "created_at",
  order = "desc",
  search = "",
) {
  try {
    const response = await axiosInstance.get("/admin/lessons", {
      params: { page, sort, order, search },
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching all lessons:", error);
    return { data: [], meta: null, success: false };
  }
}

// Get all lessons by course id , dùng object param để dễ mở rộng filter sau này
export async function fetchLessons({
  courseId,
  page = 1,
  sort = "created_at",
  order = "desc",
  search = "",
}) {
  try {
    const response = await axiosInstance.get(
      `/admin/courses/${courseId}/lessons`,
      {
        params: { page, sort, order, search },
      },
    );
    return {
      data: response.data.data,
      meta: response.data.meta,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return { data: [], meta: null, success: false };
  }
}

// Get single lesson - detail
export async function fetchLesson(id) {
  try {
    const response = await axiosInstance.get(`/admin/lessons/${id}`);
    // console.log("Fetched lesson:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return null;
  }
}

// Create lesson
export async function createLesson(payload) {
  try {
    const response = await axiosInstance.post("/admin/lessons", payload);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error creating lesson:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create lesson.",
    };
  }
}

// Update lesson
export async function updateLesson(id, payload) {
  try {
    const response = await axiosInstance.put(`/admin/lessons/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating lesson:", error);
    throw error;
  }
}

// Delete single lesson
export async function deleteLesson(id) {
  try {
    const response = await axiosInstance.delete(`/admin/lessons/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting lesson:", error);
    throw error;
  }
}

// Bulk delete lessons
export async function bulkDeleteLessons(ids) {
  try {
    const response = await axiosInstance.post("/admin/lessons/bulk-destroy", {
      ids,
    });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting lessons:", error);
    throw error;
  }
}
