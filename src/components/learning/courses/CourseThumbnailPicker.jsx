import { useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import MediaLibrary from "@/components/shared/MediaLibrary";
import IMAGE_DEFAULT from "@/assets/images/placeholder_img.png";

export default function CourseThumbnailPicker({
  value,
  thumbnailMediaId,
  onChange,
}) {
  const [openLibrary, setOpenLibrary] = useState(false);

  const previewSrc = value || IMAGE_DEFAULT;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        <div className="w-48 h-28 rounded-lg overflow-hidden border bg-slate-50 shrink-0">
          <img
            src={previewSrc}
            alt="Course thumbnail preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = IMAGE_DEFAULT;
            }}
          />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpenLibrary(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
            >
              <ImagePlus className="w-4 h-4" />
              Chọn từ Media Library
            </button>

            {(value || thumbnailMediaId) && (
              <button
                type="button"
                onClick={() =>
                  onChange({
                    thumbnail: "",
                    thumbnail_media_id: "",
                    thumbnail_url: "",
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
              >
                <Trash2 className="w-4 h-4" />
                Xóa ảnh chọn
              </button>
            )}
          </div>

          <div className="text-sm text-slate-500 space-y-1">
            <p>
              <strong>Media ID:</strong> {thumbnailMediaId || "Chưa chọn"}
            </p>
            <p className="break-all">
              <strong>Preview URL:</strong> {value || "Chưa có ảnh"}
            </p>
          </div>
        </div>
      </div>

      {openLibrary && (
        <MediaLibrary
          onClose={() => setOpenLibrary(false)}
          onSelectThumbnail={(media) => {
            onChange({
              thumbnail_media_id: media.id,
              thumbnail_url: media.meta?.variants?.medium?.path
                ? `${
                    import.meta.env.MODE === "development"
                      ? import.meta.env.VITE_BASE_MEDIA_URL_LOCAL
                      : import.meta.env.VITE_BASE_MEDIA_URL_PRODUCTION
                  }/storage/${media.meta.variants.medium.path}`
                : media.url,
              thumbnail: media.meta?.variants?.medium?.path
                ? `${
                    import.meta.env.MODE === "development"
                      ? import.meta.env.VITE_BASE_MEDIA_URL_LOCAL
                      : import.meta.env.VITE_BASE_MEDIA_URL_PRODUCTION
                  }/storage/${media.meta.variants.medium.path}`
                : media.url,
            });

            setOpenLibrary(false);
          }}
        />
      )}
    </div>
  );
}
