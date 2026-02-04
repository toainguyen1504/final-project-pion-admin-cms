import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { fetchProgram } from "@/lib/api/programs";
import { fetchCourses } from "@/lib/api/courses";
import MultiBreadcrumb from "@/components/shared/MultiBreadcrumb";
import CourseTable from "@/components/learning/courses/CourseTable";

export default function ProgramDetailPage() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const prog = await fetchProgram(id);
      setProgram(prog);
      const courseResult = await fetchCourses(1, "created_at", "desc", "", id);
      setCourses(courseResult.data || []);
    };
    loadData();
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
      <div className="bg-slate-100 dark:bg-slate-800 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bên trái: Title + Status + Description (chiếm 2/3) */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                {program.title}
              </h1>
              {program.status === "active" ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Đang hoạt động
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  Không hoạt động
                </span>
              )}
            </div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {program.description || "Chưa có mô tả"}
            </p>
          </div>

          {/* Bên phải: Slug, Người tạo, Ngày tạo (chiếm 1/3) */}
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Người tạo:
              </span>{" "}
              {program.user?.display_name || `ID ${program.user_id}`}
            </div>

            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Ngày tạo:
              </span>{" "}
              {new Date(program.created_at).toLocaleString("vi-VN")}
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách khóa học */}
      <div className="mt-8 mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            Danh sách khóa học
          </h2>
        </div>
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

      {/* Course Table */}
      <div className="mb-40">
        <CourseTable data={courses} />
      </div>
    </div>
  );
}
