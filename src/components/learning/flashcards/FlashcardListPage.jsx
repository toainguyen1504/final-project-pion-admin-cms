import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { useFlashcards } from "@/hooks/learning/useFlashcards";
import { fetchPrograms } from "@/lib/api/learning/programs";
import { fetchCoursesByProgram } from "@/lib/api/learning/courses";
import { fetchLessons } from "@/lib/api/learning/lessons";
import FlashcardTable from "./FlashcardTable";

function FlashcardListPage() {
  const [programId, setProgramId] = useState(
    localStorage.getItem("flashcard_programId") || "",
  );
  const [programOptions, setProgramOptions] = useState([]);

  const [courseId, setCourseId] = useState(
    localStorage.getItem("flashcard_courseId") || "",
  );
  const [courseOptions, setCourseOptions] = useState([]);

  const [lessonId, setLessonId] = useState(
    localStorage.getItem("flashcard_lessonId") || "",
  );
  const [lessonOptions, setLessonOptions] = useState([]);

  // Load program options
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

  // Persist localStorage
  useEffect(() => {
    if (programId) localStorage.setItem("flashcard_programId", programId);
    else localStorage.removeItem("flashcard_programId");
  }, [programId]);

  useEffect(() => {
    if (courseId) localStorage.setItem("flashcard_courseId", courseId);
    else localStorage.removeItem("flashcard_courseId");
  }, [courseId]);

  useEffect(() => {
    if (lessonId) localStorage.setItem("flashcard_lessonId", lessonId);
    else localStorage.removeItem("flashcard_lessonId");
  }, [lessonId]);

  // Load courses khi chọn program
  useEffect(() => {
    const loadCourses = async () => {
      if (!programId) {
        setCourseOptions([]);
        setCourseId("");
        setLessonOptions([]);
        setLessonId("");
        return;
      }

      const res = await fetchCoursesByProgram({
        programId,
        page: 1,
        per_page: 9999,
      });
      if (res.success) {
        setCourseOptions(
          (res.data || []).map((c) => ({
            value: String(c.id),
            label: c.title,
          })),
        );
      } else {
        setCourseOptions([]);
      }

      // reset child filters khi program đổi
      setCourseId("");
      setLessonOptions([]);
      setLessonId("");
    };

    loadCourses();
  }, [programId]);

  // Load lessons khi chọn course
  useEffect(() => {
    const loadLessons = async () => {
      if (!courseId) {
        setLessonOptions([]);
        setLessonId("");
        return;
      }

      const res = await fetchLessons({
        courseId,
        page: 1,
        sort: "created_at",
        order: "desc",
        search: "",
      });

      if (res.success) {
        setLessonOptions(
          (res.data || []).map((l) => ({
            value: String(l.id),
            label: l.title,
          })),
        );
      } else {
        setLessonOptions([]);
      }

      // reset lesson khi course đổi
      setLessonId("");
    };

    loadLessons();
  }, [courseId]);

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
  } = useFlashcards({ programId, courseId, lessonId });

  // Reset page khi đổi filter/search/sort
  useEffect(() => {
    setPage(1);
  }, [programId, courseId, lessonId, search, sort, order, setPage]);

  const onResetFilters = () => {
    setProgramId("");
    setCourseId("");
    setLessonId("");
    setCourseOptions([]);
    setLessonOptions([]);

    localStorage.removeItem("flashcard_programId");
    localStorage.removeItem("flashcard_courseId");
    localStorage.removeItem("flashcard_lessonId");

    setPage(1);
  };

  const showInitialLoading =
    loading && (!flashcards || flashcards.length === 0);

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

      {showInitialLoading ? (
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
          programId={programId}
          setProgramId={setProgramId}
          programOptions={programOptions}
          courseId={courseId}
          setCourseId={setCourseId}
          courseOptions={courseOptions}
          lessonId={lessonId}
          setLessonId={setLessonId}
          lessonOptions={lessonOptions}
          onResetFilters={onResetFilters}
        />
      )}
    </div>
  );
}

export default FlashcardListPage;
