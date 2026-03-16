import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Todo fix: Cần thêm fallback nếu videoUrl không hợp lệ hoặc không thể hiển thị
export default function LessonVideoDialog({ open, onOpenChange, videoUrl }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Video bài học</DialogTitle>
          {/* Nút X mặc định sẽ tự hiển thị ở góc trên bên phải */}
        </DialogHeader>
        {videoUrl && (
          <div className="aspect-video w-full mt-4">
            <iframe
              src={videoUrl}
              title="Lesson Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
