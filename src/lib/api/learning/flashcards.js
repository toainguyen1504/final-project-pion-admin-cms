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
    const response = await axiosInstance.get("/admin/flashcards", {
      params: {
        page,
        sort,
        order,
        search,
        lesson_id: lessonId,
        course_id: courseId,
        program_id: programId,
        per_page: perPage,
      },
    });
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
