import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PRODUCTION;

const TOKEN = import.meta.env.VITE_API_TOKEN;

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

// ===========================
// GET ALL POSTS (with pagination)
// ===========================
export async function fetchPosts(
  page = 1,
  sort = "publish_at",
  order = "desc",
  search = ""
) {
  try {
    const response = await axios.get(`${BASE_URL}/posts`, {
      params: { page, sort, order, search },
      headers,
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
// GET SINGLE POST (for Edit Page)
// ===========================
export async function getPostById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/posts/${id}`, { headers });
    console.log("GET SINGLE POST (for Edit Page)", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return null;
  }
}

// ===========================
// CREATE POST
// ===========================
export async function createPost(payload) {
  try {
    const response = await axios.post(
      `${BASE_URL}/posts`,
      {
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
      },
      { headers }
    );

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
    const response = await axios.put(
      `${BASE_URL}/posts/${id}`,
      {
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
      },
      { headers }
    );

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
    const response = await axios.delete(`${BASE_URL}/posts/${id}`, {
      headers,
    });

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
    const response = await axios.post(
      `${BASE_URL}/posts/bulk-destroy`,
      { ids },
      { headers }
    );

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
