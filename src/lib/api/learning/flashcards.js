import axiosInstance from "@/utils/axiosInstance";

// Get all flashcards (có thể lọc theo lesson/course/program)
export async function fetchFlashcards({
  page = 1,
  sort = "order",
  order = "asc",
  search = "",
  lessonId,
  courseId,
  programId,
  perPage = 10,
}) {
  try {
    const params = {
      page,
      sort,
      order,
      search,
      per_page: perPage,
    };

    if (lessonId) params.lesson_id = Number(lessonId);
    if (courseId) params.course_id = Number(courseId);
    if (programId) params.program_id = Number(programId);

    const response = await axiosInstance.get("/admin/flashcards", { params });

    return {
      data: response.data.data,
      meta: response.data.meta,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return { data: [], meta: null, success: false };
  }
}

// Get single flashcard
export async function fetchFlashcard(id) {
  try {
    const response = await axiosInstance.get(`/admin/flashcards/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching flashcard:", error);
    return null;
  }
}

// Create single flashcard
export async function createFlashcard(payload) {
  try {
    const response = await axiosInstance.post("/admin/flashcards", payload);
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error creating flashcard:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to create flashcard.",
    };
  }
}

// Bulk create flashcards
export async function bulkCreateFlashcards(payload) {
  try {
    const response = await axiosInstance.post(
      "/admin/flashcards/bulk",
      payload,
    );
    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error bulk creating flashcards:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to bulk create flashcards.",
    };
  }
}

// Update flashcard
export async function updateFlashcard(id, payload) {
  try {
    const response = await axiosInstance.put(
      `/admin/flashcards/${id}`,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating flashcard:", error);
    throw error;
  }
}

// Delete single flashcard
export async function deleteFlashcard(id) {
  try {
    const response = await axiosInstance.delete(`/admin/flashcards/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    throw error;
  }
}

// Bulk delete flashcards
export async function bulkDeleteFlashcards(ids) {
  try {
    const response = await axiosInstance.post(
      "/admin/flashcards/bulk-destroy",
      {
        ids,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error bulk deleting flashcards:", error);
    throw error;
  }
}

// Get flashcards by lesson
export async function fetchFlashcardsByLesson(
  lessonId,
  { page = 1, sort = "order", order = "asc", perPage = 10 },
) {
  try {
    const response = await axiosInstance.get(
      `/admin/flashcards/lesson/${lessonId}`,
      {
        params: { page, sort, order, per_page: perPage },
      },
    );
    return {
      data: response.data.data,
      meta: response.data.meta,
      success: true,
    };
  } catch (error) {
    console.error("Error fetching flashcards by lesson:", error);
    return { data: [], meta: null, success: false };
  }
}

//  MỞ RỘNG CHO DETAIL PAGE
// Lấy flashcards theo course
export async function fetchFlashcardsByCourse(courseId) {
  try {
    const response = await axiosInstance.get("/admin/flashcards", {
      params: {
        course_id: courseId,
        page: 1,
        sort: "created_at",
        order: "desc",
      },
    });

    return {
      success: true,
      data: response.data?.data || [],
      meta: response.data?.meta || null,
    };
  } catch (error) {
    console.error("Error fetching flashcards by course:", error);
    return {
      success: false,
      data: [],
      meta: null,
    };
  }
}

// Xóa flashcard nhanh cho detail page
export async function deleteFlashcardLite(id) {
  try {
    const response = await axiosInstance.delete(`/admin/flashcards/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    throw error;
  }
}
