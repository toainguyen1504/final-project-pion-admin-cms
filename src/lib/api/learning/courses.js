import axiosInstance from "@/utils/axiosInstance";

// ----------- ADMIN ROUTES (index, create, update, delete, bulk) -----------
// ----------- chỉ có admin, super_admin và teacher có quyền -----------

// Get all courses
export async function fetchCourses(
  page = 1,
  sort = "created_at",
  order = "desc",
  search = "",
) {
  try {
    const response = await axiosInstance.get("/admin/courses", {
      params: { page, sort, order, search },
    });
    return {
      data: response.data.data,
      meta: response.data.meta,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return { data: [], meta: null, success: false };
  }
}

// Get single course
export async function fetchCourse(id) {
  try {
    const response = await axiosInstance.get(`/admin/courses/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

// Create course
export async function createCourse(payload) {
  try {
    const response = await axiosInstance.post("/admin/courses", payload);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create course.",
    };
  }
}

// Update course
export async function updateCourse(id, payload) {
  try {
    const response = await axiosInstance.put(`/admin/courses/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
}

// Delete single course
export async function deleteCourse(id) {
  try {
    const response = await axiosInstance.delete(`/admin/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
}

// Bulk delete courses
export async function bulkDeleteCourses(ids) {
  try {
    const response = await axiosInstance.post("/admin/courses/bulk-destroy", {
      ids,
    });
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting courses:", error);
    throw error;
  }
}

// Stats (nếu cần cho dashboard)
export async function fetchCourseStats() {
  try {
    const response = await axiosInstance.get("/admin/courses/stats");
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
