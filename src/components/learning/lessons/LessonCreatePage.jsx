import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

import { createLesson } from "@/lib/api/learning/lessons";
import { fetchPrograms } from "@/lib/api/learning/programs";
import { fetchCoursesByProgram } from "@/lib/api/learning/courses";
import { getCurrentUser } from "@/utils/auth";
import MultiBreadcrumb from "@/components/shared/MultiBreadcrumb";

export default function LessonCreatePage() {
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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const progRes = await fetchPrograms();
      if (progRes.success) setPrograms(progRes.data);
    };
    loadData();
  }, []);

  // load courses khi chọn program
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

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      await createLesson({
        course_id: courseId,
        title,
        intro,
        content,
        // duration,
        video_url: videoUrl,
        // order,
        is_preview: isPreview,
        is_quiz: isQuiz,
        user_id: currentUser?.id,
      });
      toast.success("Bài học đã được tạo thành công!");
      navigate("/bai-hoc");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Tạo bài học thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // if (!program || !course) return <div>Đang tải...</div>;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <MultiBreadcrumb
        items={[{ label: "Bài học", path: "/bai-hoc" }, { label: "Tạo mới" }]}
      />

      {/* Header + Button */}
      <div className="flex items-center justify-between gap-20">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Thêm bài học
          </h2>
          <p className="text-slate-500 mt-1">
            Tạo bài học mới để thêm vào hệ thống. Vui lòng điền đầy đủ thông tin
            để bài học hiển thị tốt trên trang học tập của người dùng.
          </p>
        </div>

        <Button
          type="submit"
          form="lesson-form"
          className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl 
            text-white min-w-40 cursor-pointer select-none transition-all duration-300"
          disabled={loading}
        >
          {loading && <Spinner className="w-4 h-4 mr-2 text-white" />}
          Lưu Bài Học
        </Button>
      </div>

      <form
        id="lesson-form"
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded-xl space-y-6 mt-4"
      >
        <div className="grid grid-cols-1 gap-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="form-label">
              Tiêu đề <span className="text-red-500 text-sm">*</span>
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

          {/* Duration + Video URL + Order */}
          <div className="flex items-center gap-6">
            <div className="flex-1 space-y-2">
              <Label htmlFor="video_url" className="form-label">
                Video URL <span className="text-red-500 text-sm">*</span>
              </Label>
              <Input
                id="video_url"
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                placeholder="URL video bài học"
              />
            </div>
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

          {/* <div className="w-60 space-y-2">
            <Label htmlFor="order" className="form-label">
              Thứ tự
            </Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="VD: 1"
            />
          </div> */}

          {/* Preview + Quiz */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 ml-2 mt-2">
              <input
                type="checkbox"
                checked={isPreview}
                onChange={(e) => setIsPreview(e.target.checked)}
              />
              <span className="text-slate-700 dark:text-slate-300">
                Cho xem trước
              </span>
            </div>

            <div className="flex items-center gap-2 ml-2 mt-2">
              <input
                type="checkbox"
                checked={isQuiz}
                onChange={(e) => setIsQuiz(e.target.checked)}
              />
              <span className="text-slate-700 dark:text-slate-300">
                Là bài kiểm tra
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
