export const getInitialForm = () => ({
  program_id: "",
  title: "",
  description: "",
  benefits: "",
  language: "",
  thumbnail: "",
  thumbnail_media_id: "",
  thumbnail_url: "",
  price: 0,
  discount_price: "",
  is_free: true,
  level: 0,
  status: "draft",
  category_id: "",
});

export const mapCourseToForm = (course) => ({
  program_id: course.program_id || "",
  title: course.title || "",
  description: course.description || "",

  // backend trả array, textarea cần string
  benefits: Array.isArray(course.benefits)
    ? course.benefits.join("\n")
    : course.benefits || "",

  language: course.language || "",

  // fallback an toàn cho FE cũ
  thumbnail: course.thumbnail || "",
  thumbnail_media_id: course.thumbnail_media_id || "",
  thumbnail_url: course.thumbnail_url || course.thumbnail || "",

  price: course.price || 0,
  discount_price: course.discount_price || "",
  is_free: typeof course.is_free === "boolean" ? course.is_free : true,
  level: course.level || 0,
  status: course.status || "draft",
  category_id: course.category_id || "",
});
