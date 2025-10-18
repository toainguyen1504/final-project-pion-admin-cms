import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PRODUCTION;

const TOKEN = import.meta.env.VITE_API_TOKEN;

// Get Posts
export async function fetchPosts(
  page = 1,
  sort = "publish_at",
  order = "desc",
  search = ""
) {
  try {
    const response = await axios.get(`${BASE_URL}/posts`, {
      params: { page, sort, order, search },
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
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

// Create Post
export async function createPost(payload) {
  try {
    console.log(payload);
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
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
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
      error: error.response?.data?.error || null,
    };
  }
}

// Update Post (mock)
export async function updatePost(id, payload) {
  try {
    console.log(`Mock update post ${id}:`, payload);
    return {
      message: "Post updated successfully (mock)",
      data: { id, ...payload },
    };
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

// Get single Post (mock)
export async function fetchPost(id) {
  try {
    console.log("Mock fetch post id:", id);
    return {
      id,
      title: "Mock Post Title",
      thumbnail: "/mock-thumbnail.jpg",
      status: "published",
      visibility: "public",
      publish_at: "2025-10-17T00:00:00Z",
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Delete single Post
export async function deletePost(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
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

// Delete multiple Posts
export async function bulkDeletePosts(ids) {
  try {
    const response = await axios.post(
      `${BASE_URL}/posts/bulk-destroy`,
      { ids }, // arr id
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
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
