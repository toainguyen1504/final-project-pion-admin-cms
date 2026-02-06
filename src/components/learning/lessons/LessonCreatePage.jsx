import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { createLesson } from "@/lib/api/learning/lessons";
import { fetchCourse } from "@/lib/api//learning/courses";
import { fetchProgram } from "@/lib/api/learning/programs";
import { getCurrentUser } from "@/utils/auth";
import MultiBreadcrumb from "@/components/shared/MultiBreadcrumb";

export default function LessonCreatePage() {
  const { programId, courseId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [course, setCourse] = useState(null);

  // form states
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [content, setContent] = useState("");
  //   const [duration, setDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
//   const [order, setOrder] = useState(1);
  const [isPreview, setIsPreview] = useState(false);
  const [isQuiz, setIsQuiz] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const prog = await fetchProgram(programId);
      setProgram(prog);
      const c = await fetchCourse(courseId);
      setCourse(c);
    };
    loadData();
  }, [programId, courseId]);

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
      navigate(`/chuong-trinh-hoc/${program.id}/khoa-hoc/${course.id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Tạo bài học thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (!program || !course) return <div>Đang tải...</div>;

  return (
    <div className="px-4 py-6 max-w-2xl space-y-6">
      {/* Breadcrumb */}
      <MultiBreadcrumb
        items={[
          { label: "Chương trình học", path: "/chuong-trinh-hoc" },
          { label: program.title, path: `/chuong-trinh-hoc/${program.id}` },
          {
            label: `Khóa học: ${course.title}`,
            path: `/chuong-trinh-hoc/${program.id}/khoa-hoc/${course.id}`,
          },
          { label: "Thêm bài học mới" },
        ]}
      />

      {/* Title + Desc */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Thêm bài học mới
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Thêm bài học mới cho khóa học{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {course.title}
          </span>
        </p>
      </div>

      <form
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

          {/* Duration + Video URL + Order */}
          <div className="flex items-center gap-6">
            {/* <div className="w-40 space-y-2">
              <Label htmlFor="duration" className="form-label">
                Thời lượng (phút)
              </Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="VD: auto"
              />
            </div> */}
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

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl 
        text-white w-full cursor-pointer select-none transition-all duration-300 mt-2"
        >
          {loading ? "Đang xử lý..." : "Tạo Bài Học"}
        </Button>
      </form>
    </div>
  );
}
