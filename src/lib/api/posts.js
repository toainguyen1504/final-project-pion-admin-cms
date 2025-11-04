import axiosInstance from "@/utils/axiosInstance";

// ----------- PUBLIC ROUTES (index, show, stats) -----------
// ===========================
// GET ALL POSTS (with pagination) - index
// ===========================
export async function fetchPosts(
  page = 1,
  sort = "publish_at",
  order = "desc",
  search = ""
) {
  try {
    const response = await axiosInstance.get("/posts", {
      params: { page, sort, order, search },
    });

    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      data: [],
      meta: { current_page: 1, last_page: 1, total: 0 },
    };
  }
}

// ===========================
// GET SINGLE POST (for Edit Page) - show
// ===========================
export async function getPostById(id) {
  try {
    const response = await axiosInstance.get(`/posts/${id}`);
    // console.log("GET SINGLE POST (for Edit Page)", response.data.data);
    return response.data.data;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // console.error("Error fetching post by ID:", error);
    return null;
  }
}

// Tính thống kê cho stats dashboard - stats
export async function fetchPostStats() {
  try {
    const response = await axiosInstance.get("/posts/stats");

    const { data } = response.data;

    return {
      total: data.total || 0,
      this_month: data.this_month || 0,
      last_month: data.last_month || 0,
    };
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // console.error("Error fetching post stats:", error);
    return {
      total: 0,
      this_month: 0,
      last_month: 0,
    };
  }
}

// ----------- ADMIN ROUTES (create, update, delete, bulk) -----------
// ===========================
// CREATE POST
// ===========================
export async function createPost(payload) {
  try {
    const response = await axiosInstance.post("/admin/posts", {
      title: payload.title,
      sapo_text: payload.sapo_text,
      slug: payload.slug,
      category_ids: payload.category_ids || [],
      featured_media_id: payload.featured_media_id || null,
      seo_title: payload.seo_title,
      seo_description: payload.seo_description,
      seo_keywords: payload.seo_keywords,
      status: payload.status || "draft",
      visibility: payload.visibility || "private",
      publish_at: payload.publish_at,
      content: payload.content || "",
    });

    return {
      success: response.data.success,
      message: response.data.message || "Post created successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to create post. Please check your input.",
    };
  }
}

// ===========================
// UPDATE POST
// ===========================
export async function updatePost(id, payload) {
  try {
    const response = await axiosInstance.put(`/admin/posts/${id}`, {
      title: payload.title,
      sapo_text: payload.sapo_text,
      slug: payload.slug,
      category_ids: payload.category_ids || [],
      featured_media_id: payload.featured_media_id || null,
      seo_title: payload.seo_title,
      seo_description: payload.seo_description,
      seo_keywords: payload.seo_keywords,
      status: payload.status,
      visibility: payload.visibility,
      publish_at: payload.publish_at,
      content: payload.content,
    });

    return {
      success: response.data.success,
      message: response.data.message || "Post updated successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to update post. Please try again.",
    };
  }
}

// ===========================
// DELETE SINGLE POST
// ===========================
export async function deletePost(id) {
  try {
    const response = await axiosInstance.delete(`/admin/posts/${id}`);

    return {
      success: response.data.success,
      message: response.data.message || "Post deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to delete post. Please try again.",
    };
  }
}

// ===========================
// BULK DELETE POSTS
// ===========================
export async function bulkDeletePosts(ids) {
  try {
    const response = await axiosInstance.post("/admin/posts/bulk-destroy", { ids });

    return {
      success: response.data.success,
      message: response.data.message || "Posts deleted successfully",
    };
  } catch (error) {
    console.error("Error bulk deleting posts:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Failed to delete posts. Please try again.",
    };
  }
}
