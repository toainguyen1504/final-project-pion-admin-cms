import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_LOCAL
    : import.meta.env.VITE_API_URL_PRODUCTION;

const TOKEN = import.meta.env.VITE_API_TOKEN;

// Get Posts (list)
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

// ✅ Create Post (mock)
export async function createPost(payload) {
  try {
    console.log("Mock create post:", payload);
    return {
      message: "Post created successfully (mock)",
      data: { id: Date.now(), ...payload },
    };
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
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

// Delete single Post (mock)
export async function deletePost(id) {
  try {
    console.log("Mock delete post id:", id);
    return { message: "Post deleted successfully (mock)" };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

// Delete multiple Posts (mock)
export async function bulkDeletePosts(ids) {
  try {
    console.log("Mock bulk delete posts:", ids);
    return { message: "Posts deleted successfully (mock)" };
  } catch (error) {
    console.error("Error bulk deleting posts:", error);
    throw error;
  }
}