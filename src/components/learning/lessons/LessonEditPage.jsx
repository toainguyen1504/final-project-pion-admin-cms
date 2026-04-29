import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

import { updateLesson, fetchLesson } from "@/lib/api/learning/lessons";
import { fetchPrograms } from "@/lib/api/learning/programs";
import { fetchCoursesByProgram, fetchCourse } from "@/lib/api/learning/courses";
import MultiBreadcrumb from "@/components/shared/MultiBreadcrumb";
import {
  normalizeCleanText,
  normalizeTextareaText,
} from "@/utils/plainText";

export default function LessonEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [programId, setProgramId] = useState("");
  const [programs, setPrograms] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState([]);

  // form states
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isQuiz, setIsQuiz] = useState(false);
  const [order, setOrder] = useState("");

  const [loading, setLoading] = useState(false);

  // Load programs list
  useEffect(() => {
    const loadData = async () => {
      const progRes = await fetchPrograms();
      if (progRes.success) setPrograms(progRes.data);
    };
    loadData();
  }, []);

  // Load courses khi chọn program
  useEffect(() => {
    const loadCourses = async () => {
      if (!programId) {
        setCourses([]);
        setCourseId("");
        return;
      }
      const res = await fetchCoursesByProgram({ programId });
      if (res.success) setCourses(res.data);
    };
    loadCourses();
  }, [programId]);

  // Load lesson data
  useEffect(() => {
    const loadLesson = async () => {
      const res = await fetchLesson(id);
      if (res) {
        setCourseId(res.course_id || "");
        setTitle(res.title || "");
        setIntro(res.intro || "");
        setContent(res.content || "");
        setVideoUrl(res.video_url || "");
        setIsPreview(res.is_preview || false);
        setIsQuiz(res.is_quiz || false);
        setOrder(res.order || "");

        // fetch course để lấy program_id
        if (res.course_id) {
          const courseRes = await fetchCourse(res.course_id);
          if (courseRes && courseRes.data) {
            setProgramId(courseRes.data.program_id || "");
          }
          //   console.log("Fetched course for lesson:", courseRes);
        }
      }
    };
    loadLesson();
  }, [id]);

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanTitle = normalizeCleanText(title);
    const cleanIntro = normalizeTextareaText(intro);
    const cleanContent = normalizeTextareaText(content);

    // validate order trước
    if (order && !Number.isInteger(Number(order))) {
      toast.error("Thứ tự bài học phải là số nguyên.");
      return;
    }

    setLoading(true);

    try {
      await updateLesson(id, {
        course_id: courseId,
        title: cleanTitle,
        intro: cleanIntro,
        content: cleanContent,
        video_url: videoUrl,
        is_preview: isPreview,
        is_quiz: isQuiz,
        order: order ? Number(order) : undefined,
      });

      toast.success("Bài học đã được cập nhật thành công!");
      navigate("/bai-hoc");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Cập nhật bài học thất bại!";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <MultiBreadcrumb
        items={[{ label: "Bài học", path: "/bai-hoc" }, { label: "Chỉnh sửa" }]}
      />

      <div className="flex items-center justify-between gap-20">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Chỉnh sửa bài học
          </h2>
          <p className="text-slate-500 mt-1">
            Cập nhật thông tin bài học. Vui lòng điền đầy đủ thông tin để bài
            học hiển thị tốt trên trang học tập của người dùng.
          </p>
        </div>

        <Button
          type="submit"
          form="lesson-form"
          className="bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 
          transition-colors duration-300 min-w-36 cursor-pointer rounded-xl"
          disabled={loading}
        >
          {loading && <Spinner className="w-4 h-4 mr-2 text-white" />}
          Cập nhật bài học
        </Button>
      </div>

      <form
        id="lesson-form"
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl space-y-6 mt-4"
      >
        {/* Title */}
        <div className="space-y-2">
          <Label
            htmlFor="title"
            className="form-label after:content-['*'] after:text-red-500 after:ml-1"
          >
            Tiêu đề
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="VD: Bài học số 1"
          />
        </div>

        {/* Program + Course */}
        <div className="flex gap-6">
          {/* Program */}
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="program_id"
              className="form-label after:content-['*'] after:text-red-500 after:ml-1"
            >
              Chương trình học
            </Label>
            <select
              id="program_id"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              className="form-select w-full"
              required
            >
              <option value="">-- Chọn chương trình học --</option>
              {programs.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.title}
                </option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="course_id"
              className="form-label after:content-['*'] after:text-red-500 after:ml-1"
            >
              Khóa học
            </Label>
            <select
              id="course_id"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="form-select w-full"
              required
            >
              <option value="">-- Chọn khóa học --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Video URL */}
        <div className="space-y-2">
          <Label
            htmlFor="video_url"
            className="form-label after:content-['*'] after:text-red-500 after:ml-1"
          >
            Video URL
          </Label>
          <Input
            id="video_url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            required
            placeholder="URL video bài học"
          />
        </div>

        {/* Intro */}
        <div className="space-y-2">
          <Label htmlFor="intro" className="form-label">
            Giới thiệu ngắn
          </Label>
          <Textarea
            id="intro"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="Giới thiệu ngắn về bài học"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content" className="form-label">
            Nội dung chính
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nội dung chi tiết của bài học"
          />
        </div>

        {/* Order */}
        <div className="w-60 space-y-2">
          <Label htmlFor="order" className="form-label">
            Thứ tự
          </Label>
          <Input
            id="order"
            type="number"
            step="1"
            min="1"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="VD: 1 - Tự động nếu để trống"
          />
        </div>

        {/* Preview + Quiz */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPreview}
              onChange={(e) => setIsPreview(e.target.checked)}
            />
            Cho xem trước
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isQuiz}
              onChange={(e) => setIsQuiz(e.target.checked)}
            />
            Là bài kiểm tra
          </label>
        </div>
      </form>
    </div>
  );
}
