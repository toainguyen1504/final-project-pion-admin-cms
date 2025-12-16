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
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";

export function SeoSnippetModal({ open, onOpenChange, seo }) {
  const {
    title,
    slug,
    desc,
    setTitle,
    setSlug,
    setDesc,
    BASE_URL,
    MAX_TITLE,
    MAX_SLUG,
    MAX_DESC,
    getProgressColor,
    DEFAULT_SEO,
  } = seo;

  // --- Local state (draft)
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSlug, setDraftSlug] = useState("");
  const [draftDesc, setDraftDesc] = useState("");

  // --- handle data edit snippet popup
  useEffect(() => {
    if (open) {
      // If data already exists (not a default placeholder) -> keep it for editing
      if (!open) return;

      // Nếu đang edit và slug/title/desc có giá trị thật
      if (title || slug || desc) {
        setDraftTitle(title || "");
        setDraftSlug(slug || "");
        setDraftDesc(desc || "");
      }
    }
  }, [open, title, slug, desc]);

  // --- Save changes
  const handleSave = () => {
    // Chỉ cập nhật khi có thay đổi thực sự (không dùng placeholder)
    const newTitle = draftTitle.trim() || "";
    const newSlug = slugify(
      draftSlug.trim() || slug.trim() || draftTitle.trim()
    );

    const newDesc = draftDesc.trim() || "";

    if (newTitle) setTitle(newTitle);
    if (newSlug) setSlug(newSlug);
    if (newDesc) setDesc(newDesc);
    onOpenChange(false);
  };

  // --- Reset Snippet popup
  const handleReset = () => {
    setDraftTitle("");
    setDraftSlug("");
    setDraftDesc("");
  };

  // --- Progress Bar
  const ProgressBar = ({ type, value, max }) => {
    const length =
      type === "slug" ? slugify(value || "").length : (value || "").length;
    const percent = Math.min((length / max) * 100, 100);
    const colorClass = getProgressColor(type, value);

    return (
      <div className="flex items-center gap-2 w-full">
        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-300 ${colorClass}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium w-12 text-right">
          {length}/{max}
        </span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()} //chặn click outside
        onEscapeKeyDown={(e) => e.preventDefault()} // chặn nhấn ESC
        className="max-w-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      >
        <DialogHeader>
          <DialogTitle>Xem trước & Chỉnh sửa Snippet</DialogTitle>
        </DialogHeader>

        {/* --- Preview --- */}
        <div className="mt-3 text-sm space-y-1 overflow-hidden">
          <p className="text-blue-600 dark:text-blue-400 break-all">
            {BASE_URL +
              slugify(
                draftSlug.trim() ||
                  slug.trim() ||
                  draftTitle.trim() ||
                  DEFAULT_SEO.slug
              )}
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 break-words">
            {draftTitle || DEFAULT_SEO.title}
          </p>
          <p className="text-gray-600 dark:text-gray-400 break-words">
            {draftDesc || DEFAULT_SEO.desc}
          </p>
        </div>

        {/* --- Inputs --- */}
        <div className="space-y-5 mt-5">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Tiêu đề</Label>
              <div className="w-2/3">
                <ProgressBar type="title" value={draftTitle} max={MAX_TITLE} />
              </div>
            </div>
            <Input
              value={draftTitle}
              placeholder="Nhập tiêu đề bài viết (SEO)"
              maxLength={MAX_TITLE + 20}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="focus-visible:ring-1 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 
              border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 truncate break-all"
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Đường dẫn (Slug)</Label>
              <div className="w-2/3">
                <ProgressBar type="slug" value={draftSlug} max={MAX_SLUG} />
              </div>
            </div>
            <div className="flex">
              <span className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 px-3 text-sm text-gray-500 dark:text-gray-400 rounded-l min-w-[150px] whitespace-nowrap">
                {BASE_URL}
              </span>
              <Input
                value={draftSlug}
                placeholder="Tự động tạo từ tiêu đề nếu để trống"
                maxLength={MAX_SLUG + 20}
                onChange={(e) => setDraftSlug(e.target.value)}
                className="rounded-l-none flex-1 border-slate-200 dark:border-gray-700 
                focus-visible:ring-1 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 
                bg-white dark:bg-gray-800 overflow-hidden truncate break-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Mô tả</Label>
              <div className="w-2/3">
                <ProgressBar
                  type="description"
                  value={draftDesc}
                  max={MAX_DESC}
                />
              </div>
            </div>
            <Textarea
              value={draftDesc}
              placeholder="Viết mô tả ngắn gọn về nội dung bài viết"
              maxLength={MAX_DESC + 40}
              onChange={(e) => setDraftDesc(e.target.value)}
              rows={3}
              className="focus-visible:ring-1 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400
              border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none overflow-y-auto
              break-words break-all"
            />
          </div>
        </div>

        {/* --- Actions --- */}
        <div className="flex justify-end gap-3 mt-5">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 cursor-pointer"
          >
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
