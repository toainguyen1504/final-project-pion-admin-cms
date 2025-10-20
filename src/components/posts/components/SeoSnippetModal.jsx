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
  } = seo;

  // --- Local state (draft)
  const [draftTitle, setDraftTitle] = useState("");
  const [draftSlug, setDraftSlug] = useState("");
  const [draftDesc, setDraftDesc] = useState("");

  // --- Reset hoặc giữ lại dữ liệu khi mở modal
  useEffect(() => {
    if (open) {
      // Nếu dữ liệu đã có (không phải placeholder default) → giữ lại để edit
      const hasRealData =
        title !== "Post title will be displayed here..." ||
        desc !== "Short description will appear here..." ||
        slug !== "default-url-slug";

      if (hasRealData) {
        setDraftTitle(title);
        setDraftSlug(slug);
        setDraftDesc(desc);
      } else {
        // Nếu là dữ liệu default → hiển thị rỗng để dùng placeholder
        setDraftTitle("");
        setDraftSlug("");
        setDraftDesc("");
      }
    }
  }, [open, title, slug, desc]);

  // --- Save changes
  const handleSave = () => {
    setTitle(draftTitle || title);
    setSlug(slugify(draftSlug || draftTitle || title));
    setDesc(draftDesc || desc);
    onOpenChange(false);
  };

  // --- Cancel
  const handleCancel = () => {
    onOpenChange(false);
  };

  // --- Progress Bar
  const ProgressBar = ({ type, value, max }) => {
    if (!value) {
      return (
        <div className="flex items-center gap-2 w-full">
          <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" />
          <span className="text-xs text-gray-400 w-12 text-right">0/{max}</span>
        </div>
      );
    }

    const length = type === "slug" ? slugify(value).length : value.length;
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
      <DialogContent className="max-w-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Preview Snippet Editor</DialogTitle>
        </DialogHeader>

        {/* --- Preview --- */}
        <div className="mt-3 text-sm space-y-1">
          <p className="text-blue-600 dark:text-blue-400 break-all">
            {BASE_URL + slugify(draftSlug || draftTitle || slug)}
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {draftTitle || title}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {draftDesc || desc}
          </p>
        </div>

        {/* --- Inputs --- */}
        <div className="space-y-5 mt-5">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Title</Label>
              <div className="w-2/3">
                <ProgressBar type="title" value={draftTitle} max={MAX_TITLE} />
              </div>
            </div>
            <Input
              value={draftTitle}
              placeholder="Enter your post title"
              maxLength={MAX_TITLE + 20}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="focus-visible:ring-1 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Permalink</Label>
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
                placeholder="Auto-generated from title if left blank"
                onChange={(e) => setDraftSlug(slugify(e.target.value || ""))}
                className="rounded-l-none flex-1 border-slate-200 dark:border-gray-700 focus-visible:ring-1 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Description</Label>
              <div className="w-2/3">
                <ProgressBar
                  type="description"
                  value={draftDesc}
                  max={MAX_DESC}
                />
              </div>
            </div>
            <Input
              value={draftDesc}
              placeholder="Write a short SEO-friendly description"
              maxLength={MAX_DESC + 40}
              onChange={(e) => setDraftDesc(e.target.value)}
              className="focus-visible:ring-1 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
        </div>

        {/* --- Actions --- */}
        <div className="flex justify-end gap-3 mt-5">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
