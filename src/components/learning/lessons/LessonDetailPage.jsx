import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { fetchLesson, deleteLesson } from "@/lib/api/learning/lessons";
import { fetchCourse } from "@/lib/api/learning/courses";
import { fetchProgram } from "@/lib/api/learning/programs";
import MultiBreadcrumb from "@/components/shared/MultiBreadcrumb";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";

export default function LessonDetailPage() {
  const { programId, courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const prog = await fetchProgram(programId);
      setProgram(prog);

      const c = await fetchCourse(courseId);
      setCourse(c);

      const l = await fetchLesson(lessonId);
      setLesson(l);
    };
    loadData();
  }, [programId, courseId, lessonId]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLesson(lesson.id);
      toast.success("Đã xoá bài học thành công!");
      navigate(`/chuong-trinh-hoc/${program.id}/khoa-hoc/${course.id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Xoá bài học thất bại!");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (!program || !course || !lesson) {
    return (
      <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-300">
        <Spinner className="size-8 text-indigo-600 dark:text-indigo-500" />
        <span>Đang tải bài học...</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 space-y-6">
      {/* Breadcrumb */}
      <MultiBreadcrumb
        items={[
          { label: "Chương trình học", path: "/chuong-trinh-hoc" },
          { label: program.title, path: `/chuong-trinh-hoc/${program.id}` },
          {
            label: course.title,
            path: `/chuong-trinh-hoc/${program.id}/khoa-hoc/${course.id}`,
          },
          { label: lesson.title },
        ]}
      />

      {/* Card thông tin Lesson */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            {lesson.title}
          </h1>

          {lesson.is_preview && (
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              Có xem trước
            </Badge>
          )}

          {lesson.is_quiz && (
            <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Bài kiểm tra
            </Badge>
          )}

          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            Người tạo: {lesson.user?.display_name || `ID ${lesson.user_id}`}
          </Badge>

          <Badge variant="outline">
            Ngày tạo: {new Date(lesson.created_at).toLocaleString("vi-VN")}
          </Badge>
        </div>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {lesson.intro || "Chưa có giới thiệu"}
        </p>

        <div className="mt-4 text-slate-700 dark:text-slate-300 whitespace-pre-line">
          {lesson.content || "Chưa có nội dung"}
        </div>

        {lesson.video_url && (
          <div className="mt-4">
            <a
              href={lesson.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500"
            >
              Xem video bài học
            </a>
          </div>
        )}

        {lesson.duration > 0 && (
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Thời lượng: {lesson.duration} phút
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        <Button
          asChild
          className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl flex items-center gap-2"
        >
          <Link
            to={`/chuong-trinh-hoc/${program.id}/khoa-hoc/${course.id}/bai-hoc/${lesson.id}/chinh-sua`}
          >
            <Pencil className="w-4 h-4" />
            Chỉnh sửa bài học
          </Link>
        </Button>

        <Button
          onClick={() => setDeleteDialogOpen(true)}
          className="bg-red-600 text-white hover:bg-red-500 rounded-xl flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Xoá bài học
        </Button>
      </div>

      {/* Delete confirm dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xoá bài học"
        description="Bạn có chắc chắn muốn xoá bài học này? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
