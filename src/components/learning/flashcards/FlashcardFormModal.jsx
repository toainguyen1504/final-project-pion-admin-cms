import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { updateFlashcard } from "@/lib/api/learning/flashcards";
import { normalizeCleanText, normalizeTextareaText } from "@/utils/plainText";

export default function FlashcardFormModal({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    vocabulary: "",
    phonetic: "",
    translation: "",
    example_sentence: "",
    example_translation: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        vocabulary: initialData.vocabulary || "",
        phonetic: initialData.phonetic || "",
        translation: initialData.translation || "",
        example_sentence: initialData.example_sentence || "",
        example_translation: initialData.example_translation || "",
      });
    }
  }, [open, initialData]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!initialData?.id) {
      toast.error("Không tìm thấy flashcard để cập nhật.");
      return;
    }

    const cleanVocabulary = normalizeCleanText(formData.vocabulary);
    const cleanTranslation = normalizeTextareaText(formData.translation);
    const cleanExampleSentence = normalizeTextareaText(
      formData.example_sentence,
    );
    const cleanExampleTranslation = normalizeTextareaText(
      formData.example_translation,
    );

    if (!cleanVocabulary) {
      toast.error("Vui lòng nhập từ vựng.");
      return;
    }

    if (!cleanTranslation) {
      toast.error("Vui lòng nhập nghĩa tiếng Việt.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        lesson_id: initialData.lesson_id,
        vocabulary: cleanVocabulary,
        phonetic: formData.phonetic?.trim() || "",
        translation: cleanTranslation,
        example_sentence: cleanExampleSentence,
        example_translation: cleanExampleTranslation,
      };

      const result = await updateFlashcard(initialData.id, payload);

      if (result?.success) {
        toast.success("Cập nhật flashcard thành công!");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result?.message || "Cập nhật flashcard thất bại.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Cập nhật flashcard thất bại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-700">
          <DialogTitle>Chỉnh sửa flashcard</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex max-h-[70vh] flex-col">
          {/* Body scroll */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="vocabulary"
                className="ml-2 inline-flex items-center gap-1 text-slate-700 dark:text-slate-300"
              >
                Từ vựng <span className="text-sm text-red-500">*</span>
              </Label>
              <Input
                id="vocabulary"
                value={formData.vocabulary}
                onChange={(e) => handleChange("vocabulary", e.target.value)}
                placeholder="Ví dụ: parents"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phonetic"
                className="ml-2 text-slate-700 dark:text-slate-300"
              >
                Phiên âm
              </Label>
              <Input
                id="phonetic"
                value={formData.phonetic}
                onChange={(e) => handleChange("phonetic", e.target.value)}
                placeholder="Ví dụ: /ˈperənts/"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="translation"
                className="ml-2 inline-flex items-center gap-1 text-slate-700 dark:text-slate-300"
              >
                Nghĩa tiếng Việt <span className="text-sm text-red-500">*</span>
              </Label>
              <Input
                id="translation"
                value={formData.translation}
                onChange={(e) => handleChange("translation", e.target.value)}
                placeholder="Ví dụ: bố mẹ"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="example_sentence"
                className="ml-2 text-slate-700 dark:text-slate-300"
              >
                Câu ví dụ
              </Label>
              <Textarea
                id="example_sentence"
                value={formData.example_sentence}
                onChange={(e) =>
                  handleChange("example_sentence", e.target.value)
                }
                placeholder="Ví dụ: My parents are cooking dinner."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="example_translation"
                className="ml-2 text-slate-700 dark:text-slate-300"
              >
                Dịch câu ví dụ
              </Label>
              <Textarea
                id="example_translation"
                value={formData.example_translation}
                onChange={(e) =>
                  handleChange("example_translation", e.target.value)
                }
                placeholder="Ví dụ: Bố mẹ tôi đang nấu bữa tối."
                rows={4}
              />
            </div>
          </div>

          {/* Footer sticky */}
          <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full min-w-36 cursor-pointer rounded-xl bg-indigo-600 text-white transition-colors duration-300 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              {loading ? "Đang xử lý..." : "Cập nhật flashcard"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
