import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

import { fetchCourse } from "@/lib/api/learning/courses";
import MultiBreadcrumb from "@/components/shared/MultiBreadcrumb";
import LessonTable from "@/components/learning/lessons/LessonTable";
import { useLessons } from "@/hooks/learning/useLessons";

export default function CourseDetailPage() {
  const { programId, courseId } = useParams();
  const [course, setCourse] = useState(null);

  const {
    lessons,
    meta,
    loading,
    page,
    setPage,
    sort,
    order,
    setSort,
    setOrder,
    search,
    setSearch,
    reloadLessons,
  } = useLessons(courseId); // truyền id để lọc theo course

  useEffect(() => {
    const loadCourse = async () => {
      const c = await fetchCourse(courseId);
      setCourse(c);
    };
    loadCourse();
  }, [courseId]);

  if (!course) return <div>Đang tải...</div>;

  return (
    <div className="px-4 py-3 space-y-6">
      <MultiBreadcrumb
        items={[
          { label: "Chương trình học", path: "/chuong-trinh-hoc" },
          {
            label: course.program?.title || `Program ${programId}`,
            path: `/chuong-trinh-hoc/${programId}`,
          },
          { label: course.title },
        ]}
      />

      {/* Card thông tin Course */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            {course.title}
          </h1>

          {/* Status */}
          {course.status === "published" ? (
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Đã xuất bản
            </Badge>
          ) : (
            <Badge variant="secondary">{course.status}</Badge>
          )}

          {/* Người tạo */}
          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Người tạo: {course.user?.display_name || `ID ${course.user_id}`}
          </Badge>

          {/* Ngày tạo */}
          <Badge variant="outline">
            Ngày tạo: {new Date(course.created_at).toLocaleString("vi-VN")}
          </Badge>
        </div>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {course.description || "Chưa có mô tả"}
        </p>
      </div>

      {/* Danh sách bài học */}
      <div className="mt-8 mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Danh sách bài học
        </h2>
        <Button
          asChild
          className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl flex items-center gap-2"
        >
          <Link
            to={`/chuong-trinh-hoc/${programId}/khoa-hoc/${course.id}/bai-hoc/tao-moi`}
          >
            <Plus className="w-4 h-4" />
            Thêm Bài Học Mới
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-300">
          <Spinner className="size-8 text-indigo-600 dark:text-indigo-500" />
          <span>Đang tải bài học...</span>
        </div>
      ) : (
        <LessonTable
          data={lessons}
          meta={meta}
          page={page}
          setPage={setPage}
          sort={sort}
          order={order}
          setSort={setSort}
          setOrder={setOrder}
          search={search}
          setSearch={setSearch}
          refreshLessons={reloadLessons}
        />
      )}
    </div>
  );
}
