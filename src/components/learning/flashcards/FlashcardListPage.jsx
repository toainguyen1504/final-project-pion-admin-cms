// import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useFlashcards } from "@/hooks/learning/useFlashcards";
import FlashcardTable from "./FlashcardTable";
import { Link } from "react-router-dom";

function FlashcardListPage() {
  const {
    flashcards,
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
    reloadFlashcards,
  } = useFlashcards({}); // có thể truyền lessonId, courseId, programId nếu muốn lọc

  return (
    <div className="px-4 pt-4 pb-10 space-y-3">
      <Helmet>
        <title>Tất Cả Flashcard | Pion CMS</title>
        <meta
          name="description"
          content="Danh sách flashcard trong hệ thống quản lý"
        />
      </Helmet>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Tất Cả Flashcard
          </h2>
          <p className="text-slate-500 mt-0.5">
            Xem, quản lý và cập nhật toàn bộ flashcard trong hệ thống.
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl flex items-center gap-2"
        >
          <Link to="/flashcards/tao-moi">
            <Plus className="w-4 h-4" />
            Thêm Flashcard Mới
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-300">
          <Spinner className="size-8 text-indigo-600 dark:text-indigo-500" />
          <span>Đang tải flashcard...</span>
        </div>
      ) : (
        <FlashcardTable
          data={flashcards}
          meta={meta}
          page={page}
          setPage={setPage}
          sort={sort}
          order={order}
          setSort={setSort}
          setOrder={setOrder}
          search={search}
          setSearch={setSearch}
          refreshFlashcards={reloadFlashcards}
        />
      )}
    </div>
  );
}

export default FlashcardListPage;
