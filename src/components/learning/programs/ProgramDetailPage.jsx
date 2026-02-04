import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

import { fetchProgram } from "@/lib/api/programs";
import MultiBreadcrumb from "@/components/shared/MultiBreadcrumb";
import CourseTable from "@/components/learning/courses/CourseTable";
import { useCourses } from "@/hooks/useCourses";

export default function ProgramDetailPage() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);

  const {
    courses,
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
    reloadCourses,
  } = useCourses(id); // truyền id để lọc theo program

  useEffect(() => {
    const loadProgram = async () => {
      const prog = await fetchProgram(id);
      setProgram(prog);
    };
    loadProgram();
  }, [id]);

  if (!program) return <div>Đang tải...</div>;

  return (
    <div className="px-4 py-3 space-y-6">
      <MultiBreadcrumb
        items={[
          { label: "Chương trình học", path: "/chuong-trinh-hoc" },
          { label: program.title },
        ]}
      />

      {/* Card thông tin Program */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            {program.title}
          </h1>

          {/* Status */}
          {program.status === "active" ? (
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Đang hoạt động
            </Badge>
          ) : (
            <Badge variant="secondary">Không hoạt động</Badge>
          )}

          {/* Người tạo */}
          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Người tạo: {program.user?.display_name || `ID ${program.user_id}`}
          </Badge>

          {/* Ngày tạo */}
          <Badge variant="outline">
            Ngày tạo: {new Date(program.created_at).toLocaleString("vi-VN")}
          </Badge>
        </div>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {program.description || "Chưa có mô tả"}
        </p>
      </div>

      {/* Danh sách khóa học */}
      <div className="mt-8 mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Danh sách khóa học
        </h2>
        <Button
          asChild
          className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl flex items-center gap-2"
        >
          <Link to={`/chuong-trinh-hoc/${program.id}/tao-moi-khoa-hoc`}>
            <Plus className="w-4 h-4" />
            Thêm Khóa Học Mới
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-300">
          <Spinner className="size-8 text-indigo-600 dark:text-indigo-500" />
          <span>Đang tải khóa học...</span>
        </div>
      ) : (
        <CourseTable
          data={courses}
          meta={meta}
          page={page}
          setPage={setPage}
          sort={sort}
          order={order}
          setSort={setSort}
          setOrder={setOrder}
          search={search}
          setSearch={setSearch}
          refreshCourses={reloadCourses}
        />
      )}
    </div>
  );
}
