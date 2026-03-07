import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { useCourses } from "@/hooks/learning/useCourses";
import CourseTable from "./CourseTable";

function CourseListPage() {
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
  } = useCourses({}); // có thể truyền programId để lọc

  return (
    <div className="px-4 pt-4 pb-10 space-y-3">
      <Helmet>
        <title>Tất Cả Khóa Học | Pion CMS</title>
        <meta
          name="description"
          content="Danh sách khóa học trong hệ thống quản lý"
        />
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Tất Cả Khóa Học
          </h2>
          <p className="text-slate-500 mt-0.5">
            Xem, quản lý và cập nhật toàn bộ khóa học trong hệ thống.
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl flex items-center gap-2"
        >
          <Link to="/khoa-hoc/tao-moi">
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

export default CourseListPage;
