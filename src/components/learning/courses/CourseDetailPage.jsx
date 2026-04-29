import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import MultiBreadcrumb from "@/components/shared/MultiBreadcrumb";

import { fetchCourse } from "@/lib/api/learning/courses";
import { fetchPrograms } from "@/lib/api/learning/programs";
import { fetchCategories } from "@/lib/api/categories";
import {
  fetchLessonsByCourse,
  deleteLessonLite,
} from "@/lib/api/learning/lessons";
import {
  fetchFlashcardsByCourse,
  deleteFlashcardLite,
} from "@/lib/api/learning/flashcards";

import CourseDetailHeader from "./detail/CourseDetailHeader";
import CourseStatsCards from "./detail/CourseStatsCards";
import CourseQuickHealth from "./detail/CourseQuickHealth";
import CourseOverviewTab from "./detail/CourseOverviewTab";
import CourseLessonsTab from "./detail/CourseLessonsTab";
import CourseFlashcardsTab from "./detail/CourseFlashcardsTab";

const TABS = [
  { key: "overview", label: "Tổng quan" },
  { key: "lessons", label: "Bài học" },
  { key: "flashcards", label: "Flashcards" },
];

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");

  const [course, setCourse] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [flashcards, setFlashcards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);

  const [lessonSearch, setLessonSearch] = useState("");
  const [flashcardSearch, setFlashcardSearch] = useState("");
  const [flashcardLessonFilter, setFlashcardLessonFilter] = useState("all");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [courseRes, programRes, categoryRes] = await Promise.all([
        fetchCourse(id),
        fetchPrograms(),
        fetchCategories(),
      ]);

      if (!courseRes?.success) {
        toast.error("Không tìm thấy khóa học");
        navigate("/khoa-hoc");
        return;
      }

      setCourse(courseRes.data);

      if (programRes?.success) setPrograms(programRes.data || []);
      if (categoryRes?.data) {
        setCategories(
          (categoryRes.data || []).filter((cat) => cat.type === "course"),
        );
      }

      await Promise.all([loadLessons(id), loadFlashcards(id)]);
    } catch (error) {
      toast.error("Không tải được dữ liệu khóa học");
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async (courseId = id) => {
    setLoadingLessons(true);
    try {
      const res = await fetchLessonsByCourse(courseId);
      setLessons(res?.data || []);
    } catch (error) {
      setLessons([]);
    } finally {
      setLoadingLessons(false);
    }
  };

  const loadFlashcards = async (courseId = id) => {
    setLoadingFlashcards(true);
    try {
      const res = await fetchFlashcardsByCourse(courseId);
      setFlashcards(res?.data || []);
    } catch (error) {
      setFlashcards([]);
    } finally {
      setLoadingFlashcards(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  const lessonIdToName = useMemo(() => {
    const map = {};
    lessons.forEach((lesson) => {
      map[lesson.id] = lesson.title || `Lesson #${lesson.id}`;
    });
    return map;
  }, [lessons]);

  const flashcardCountByLesson = useMemo(() => {
    const map = {};
    flashcards.forEach((card) => {
      const key = card.lesson_id;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [flashcards]);

  const totalLessons = lessons.length;
  const totalFlashcards = flashcards.length;
  const participants = Number(course?.participants) || 0;
  const duration = Number(course?.duration) || 0;

  const lessonsWithoutFlashcards = useMemo(() => {
    return lessons.filter((lesson) => !flashcardCountByLesson[lesson.id]);
  }, [lessons, flashcardCountByLesson]);

  const filteredLessons = useMemo(() => {
    const keyword = lessonSearch.trim().toLowerCase();
    if (!keyword) return lessons;

    return lessons.filter((lesson) => {
      return (
        lesson.title?.toLowerCase().includes(keyword) ||
        String(lesson.order || "").includes(keyword)
      );
    });
  }, [lessons, lessonSearch]);

  const filteredFlashcards = useMemo(() => {
    const keyword = flashcardSearch.trim().toLowerCase();

    return flashcards.filter((card) => {
      const matchKeyword =
        !keyword ||
        card.vocabulary?.toLowerCase().includes(keyword) ||
        card.meaning?.toLowerCase().includes(keyword) ||
        card.phonetic?.toLowerCase().includes(keyword);

      const matchLesson =
        flashcardLessonFilter === "all" ||
        String(card.lesson_id) === String(flashcardLessonFilter);

      return matchKeyword && matchLesson;
    });
  }, [flashcards, flashcardSearch, flashcardLessonFilter]);

  const handleDeleteLesson = async (lesson) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa bài học "${lesson.title}"?`,
    );
    if (!confirmed) return;

    try {
      await deleteLessonLite(lesson.id);
      toast.success("Đã xóa bài học");
      await Promise.all([loadLessons(), loadFlashcards()]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Xóa bài học thất bại");
    }
  };

  const handleDeleteFlashcard = async (flashcard) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa flashcard "${flashcard.vocabulary || "này"}"?`,
    );
    if (!confirmed) return;

    try {
      await deleteFlashcardLite(flashcard.id);
      toast.success("Đã xóa flashcard");
      await Promise.all([loadLessons(), loadFlashcards()]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Xóa flashcard thất bại");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="px-4 py-6 space-y-6">
      <Helmet>
        <title>{course.title || "Chi tiết khóa học"} | Pion CMS</title>
        <meta
          name="description"
          content="Workspace quản trị nội dung khóa học trong Pion CMS"
        />
      </Helmet>

      <MultiBreadcrumb
        items={[
          { label: "Khóa học", path: "/khoa-hoc" },
          { label: course.title || `Khóa học #${id}` },
        ]}
      />

      <CourseDetailHeader course={course} />

      <CourseStatsCards
        totalLessons={totalLessons}
        totalFlashcards={totalFlashcards}
        participants={participants}
        duration={duration}
      />

      <CourseQuickHealth
        course={course}
        lessons={lessons}
        lessonsWithoutFlashcards={lessonsWithoutFlashcards}
      />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 px-4 pt-4 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    "rounded-t-xl px-4 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 md:p-6">
          {activeTab === "overview" && (
            <CourseOverviewTab
              course={course}
              programs={programs}
              categories={categories}
              totalLessons={totalLessons}
              totalFlashcards={totalFlashcards}
            />
          )}

          {activeTab === "lessons" && (
            <CourseLessonsTab
              courseId={course.id}
              lessons={filteredLessons}
              lessonSearch={lessonSearch}
              setLessonSearch={setLessonSearch}
              loading={loadingLessons}
              flashcardCountByLesson={flashcardCountByLesson}
              onDeleteLesson={handleDeleteLesson}
            />
          )}

          {activeTab === "flashcards" && (
            <CourseFlashcardsTab
              courseId={course.id}
              lessons={lessons}
              flashcards={filteredFlashcards}
              flashcardSearch={flashcardSearch}
              setFlashcardSearch={setFlashcardSearch}
              flashcardLessonFilter={flashcardLessonFilter}
              setFlashcardLessonFilter={setFlashcardLessonFilter}
              loading={loadingFlashcards}
              lessonIdToName={lessonIdToName}
              onDeleteFlashcard={handleDeleteFlashcard}
            />
          )}
        </div>
      </div>
    </div>
  );
}
