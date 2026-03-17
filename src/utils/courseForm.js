export const getInitialForm = () => ({
  program_id: "",
  title: "",
  description: "",
  benefits: "",
  language: "",
  thumbnail: "",
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
  benefits: course.benefits || "",
  language: course.language || "",
  thumbnail: course.thumbnail || "",
  price: course.price || 0,
  discount_price: course.discount_price || "",
  is_free: course.is_free || true,
  level: course.level || 0,
  status: course.status || "draft",
  category_id: course.category_id || "",
});
