import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { useLessons } from "@/hooks/learning/useLessons"; // hook quản lý danh sách bài học
// import { useCourses } from "@/hooks/learning/useCourses"; // hook quản lý danh sách khóa học (để lấy options cho filter)
import { fetchPrograms } from "@/lib/api/learning/programs";
import { fetchCoursesByProgram } from "@/lib/api/learning/courses";
import LessonTable from "./LessonTable"; // component bảng hiển thị bài học

function LessonListPage() {
  const [programId, setProgramId] = useState(
    localStorage.getItem("programId") || "",
  );
  const [programOptions, setProgramOptions] = useState([]);

  const [courseId, setCourseId] = useState(
    localStorage.getItem("courseId") || "",
  );
  const [courseOptions, setCourseOptions] = useState([]);

  // Load program options for filter
  useEffect(() => {
    const loadPrograms = async () => {
      const res = await fetchPrograms();
      if (res.success) {
        setProgramOptions(
          res.data.map((p) => ({
            value: String(p.id),
            label: p.title,
          })),
        );
      }
    };
    loadPrograms();
  }, []);

  // Load course options when programId changes
  useEffect(() => {
    const loadCourses = async () => {
      if (!programId) {
        setCourseOptions([]);
        return;
      }
      const res = await fetchCoursesByProgram({ programId });
      if (res.success) {
        setCourseOptions(
          res.data.map((c) => ({
            value: String(c.id),
            label: c.title,
          })),
        );
      }
    };
    loadCourses();
  }, [programId]);

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
  } = useLessons(courseId); // có thể truyền courseId để lọc

  // Filter handlers
  const onResetFilters = () => {
    console.log("Resetting filters");
    setProgramId("");
    setCourseId("");
    localStorage.removeItem("programId");
    localStorage.removeItem("courseId");
    reloadLessons(); // gọi lại hook để load tất cả bài học
  };
  // End filter handlers

  return (
    <div className="px-4 pt-4 pb-10 space-y-3">
      <Helmet>
        <title>Tất Cả Bài Học | Pion CMS</title>
        <meta
          name="description"
          content="Danh sách bài học trong hệ thống quản lý"
        />
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Tất Cả Bài Học
          </h2>
          <p className="text-slate-500 mt-0.5">
            Xem, quản lý và cập nhật toàn bộ bài học trong hệ thống.
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl flex items-center gap-2"
        >
          <Link to="/bai-hoc/tao-moi">
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
          // filter props
          programId={programId}
          setProgramId={setProgramId}
          programOptions={programOptions}
          courseId={courseId}
          setCourseId={setCourseId}
          courseOptions={courseOptions}
          onResetFilters={onResetFilters}
        />
      )}
    </div>
  );
}

export default LessonListPage;
