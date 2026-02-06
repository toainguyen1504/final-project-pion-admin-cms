import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createProgram, updateProgram } from "@/lib/api/programs";
import { getCurrentUser } from "@/utils/auth";
import { Textarea } from "@/components/ui/textarea";

export default function ProgramFormModal({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "inactive", // mặc định inactive
  });
  const [loading, setLoading] = useState(false);

  // Điền dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "inactive",
      });
    }
  }, [initialData]);

  // Reset khi mở modal tạo mới
  useEffect(() => {
    if (open && !initialData) {
      setFormData({ title: "", description: "", status: "inactive" });
    }
  }, [open, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề chương trình.");
      return;
    }

    // Lấy user hiện tại và gán user_id vào payload
    const currentUser = getCurrentUser();
    const payload = {
      ...formData,
      user_id: currentUser?.id,
    };

    setLoading(true);
    try {
      let result;
      if (initialData) {
        result = await updateProgram(initialData.id, payload);
      } else {
        result = await createProgram(payload);
      }
      if (result.success) {
        toast.success(
          initialData ? "Cập nhật thành công!" : "Tạo mới thành công!",
        );
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.message || "Thao tác thất bại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? "Chỉnh sửa chương trình học"
              : "Thêm chương trình học"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
              >
                Tiêu đề <span className="text-red-500 text-sm">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="VD: Tiếng Anh Mầm Non"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="ml-2 text-slate-700 dark:text-slate-300"
              >
                Mô tả
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mô tả ngắn về chương trình"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-4 ml-2">
            <Label className="text-slate-700 dark:text-slate-300">
              Trạng thái
            </Label>
            <Switch
              id="status"
              checked={formData.status === "active"}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  status: checked ? "active" : "inactive",
                })
              }
            />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {formData.status === "active"
                ? "Đang hoạt động"
                : "Không hoạt động"}
            </span>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl my-3"
          >
            {loading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Tạo mới"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
