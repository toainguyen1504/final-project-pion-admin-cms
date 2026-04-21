function Value({ children }) {
  return (
    <div className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-100">
      {children || "—"}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <Value>{children}</Value>
    </div>
  );
}

export default function CourseOverviewTab({
  course,
  programs,
  categories,
  totalLessons,
  totalFlashcards,
}) {
  const selectedProgram =
    course?.program ||
    programs.find((item) => String(item.id) === String(course?.program_id));

  const selectedCategory =
    course?.category ||
    categories.find((item) => String(item.id) === String(course?.category_id));

  const benefitsText = Array.isArray(course?.benefits)
    ? course.benefits.join(", ")
    : course?.benefits || "";

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Thông tin cơ bản
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Metadata chính của khóa học.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Tiêu đề">{course?.title}</Field>
          <Field label="Slug">{course?.slug}</Field>
          <Field label="Program">{selectedProgram?.title}</Field>
          <Field label="Danh mục">{selectedCategory?.name}</Field>
          <Field label="Level">Level {course?.level ?? 0}</Field>
          <Field label="Ngôn ngữ">{course?.language}</Field>
          <Field label="Trạng thái">{course?.status}</Field>
          <Field label="Hình thức">
            {course?.is_free ? "Miễn phí" : "Có phí"}
          </Field>
          <Field label="Giá">
            {course?.is_free ? "Miễn phí" : `${course?.price || 0} đ`}
          </Field>
          <Field label="Giá giảm">
            {course?.discount_price ? `${course.discount_price} đ` : "—"}
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Nội dung học thuật
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Phần mô tả và lợi ích của khóa học.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Field label="Mô tả">
            <div className="whitespace-pre-wrap leading-7 text-slate-700 dark:text-slate-200">
              {course?.description || "Chưa có mô tả"}
            </div>
          </Field>

          <Field label="Lợi ích">
            <div className="whitespace-pre-wrap leading-7 text-slate-700 dark:text-slate-200">
              {benefitsText || "Chưa có lợi ích"}
            </div>
          </Field>
        </div>
      </section>

      {/* <section className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Thống kê nhanh
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Tổng bài học">{totalLessons}</Field>
          <Field label="Tổng flashcards">{totalFlashcards}</Field>
          <Field label="Học viên">{course?.participants || 0}</Field>
          <Field label="Thời lượng">{course?.duration || 0} phút</Field>
        </div>
      </section> */}
    </div>
  );
}
