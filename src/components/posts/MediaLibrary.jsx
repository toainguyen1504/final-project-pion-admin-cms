import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { format } from "date-fns";
import { Upload, Image, CloudUpload, FileUp, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Info } from "lucide-react";

import { useMedia } from "@/hooks/useMedia";
import { uploadMedia, deleteMedia } from "@/lib/api/media";
import IMAGE_DEFAULT from "@/assets/images/placeholder_img.png";

export default function MediaLibrary({
  onClose,
  onSelectThumbnail,
  onInsertImage,
}) {
  const [activeTab, setActiveTab] = useState("library");
  const [selectedImage, setSelectedImage] = useState(null);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false); // loading riêng cho upload

  // metadata for image
  const [imageTitle, setImageTitle] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  const [errors, setErrors] = useState({
    title: false,
    caption: false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Dùng hook gọi API thật
  const { mediaList, loading, reloadMedia, BASE_MEDIA_URL } = useMedia();

  // Chọn / bỏ chọn ảnh
  const handleImageClick = (img) => {
    if (selectedImage && selectedImage.id === img.id) {
      setSelectedImage(null);
      setImageTitle("");
      setImageCaption("");
      setImageDescription("");
    } else {
      setSelectedImage(img);
      setImageTitle(img.title || "");
      setImageCaption(img.caption || "");
      setImageDescription(img.description || "");
    }
  };

  // Chọn file
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  // Mở file picker
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Lấy src ảnh
  const getImageSrc = (img) => {
    if (!img) return IMAGE_DEFAULT;
    if (img.meta?.variants?.thumbnail?.path)
      return `${BASE_MEDIA_URL}/storage/${img.meta.variants.thumbnail.path}`;
    return `${BASE_MEDIA_URL}${
      img.url.startsWith("/") ? img.url : "/" + img.url
    }`;
  };

  // Upload thật qua API (có debounce + disable)
  let uploadTimeout;
  const handleUpload = () => {
    if (files.length === 0) return toast.error("Vui lòng chọn ít nhất 1 tệp!");
    if (uploading) return;

    clearTimeout(uploadTimeout);
    uploadTimeout = setTimeout(async () => {
      try {
        setUploading(true);
        await uploadMedia(files);
        await reloadMedia();
        setFiles([]);
        toast.success("Tải lên thành công!");

        // Chuyển về tab thư viện sau khi tải xong
        setActiveTab("library");
      } catch (err) {
        console.error(err);
        toast.error("Upload thất bại! Vui lòng thử lại sau!");
      } finally {
        setUploading(false);
      }
    }, 400);
  };

  // Hàm xử lý xóa ảnh
  const handleDeleteImage = async () => {
    if (!selectedImage) return;

    try {
      await deleteMedia(selectedImage.id);
      toast.success("Đã xóa hình ảnh thành công!");
      setSelectedImage(null);
      await reloadMedia();
    } catch (err) {
      console.error(err);
      toast.error("Không thể xóa hình ảnh. Có thể ảnh đang được sử dụng!");
    }
  };

  // 🧩 Modal JSX
  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-6xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Thư viện Media</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition cursor-pointer ${
              activeTab === "upload"
                ? "text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Upload className="w-4 h-4" /> Tải lên
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition cursor-pointer ${
              activeTab === "library"
                ? "text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Image className="w-4 h-4" /> Thư viện
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main */}
          <div className="flex-1 overflow-y-auto py-5 px-16">
            {activeTab === "library" ? (
              loading ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  Đang tải hình ảnh...
                </div>
              ) : mediaList.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  Chưa có ảnh nào trong thư viện.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaList.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => handleImageClick(img)}
                      className={`relative border rounded-lg overflow-hidden cursor-pointer group ${
                        selectedImage && selectedImage.id === img.id
                          ? "ring-2 ring-indigo-600"
                          : "hover:ring-1 hover:ring-gray-300"
                      }`}
                    >
                      <img
                        src={getImageSrc(img)}
                        alt={img.title}
                        className="object-cover w-full h-32"
                        onError={(e) => (e.target.src = IMAGE_DEFAULT)}
                      />
                      {selectedImage && selectedImage.id === img.id && (
                        <div className="absolute top-2 right-2 bg-indigo-600 text-white p-1 rounded-full text-xs">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <button
                  onClick={handleUploadClick}
                  className="border border-dashed border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition px-6 py-4 rounded-lg flex flex-col items-center justify-center space-y-2"
                >
                  <CloudUpload className="w-8 h-8" />
                  <span className="text-base font-medium">
                    Nhấn để tải lên ngay!
                  </span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {files.length > 0 && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="mb-2 font-medium">Tệp đã chọn:</p>
                    <ul className="list-disc text-left max-h-32 overflow-y-auto pl-5">
                      {files.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                    <div className="flex justify-center">
                      <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Đang
                            tải...
                          </>
                        ) : (
                          <>
                            <FileUp className="w-4 h-4" /> Tải lên
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-72 overflow-y-auto border-l p-4 bg-gray-50 flex flex-col">
            <h6 className="uppercase text-xs text-gray-500 mb-3 font-semibold">
              Chi tiết đính kèm
            </h6>

            {/* Preview */}
            <div className="mb-3">
              <img
                src={getImageSrc(selectedImage)}
                alt={selectedImage?.title || "Preview"}
                className="rounded border w-full h-32 object-cover"
                onError={(e) => (e.target.src = IMAGE_DEFAULT)}
              />
            </div>

            {/* Metadata */}
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <div>
                <strong>Tên tệp:</strong>{" "}
                <span>
                  {selectedImage ? selectedImage.title : "Chưa chọn ảnh"}
                </span>
              </div>
              <div>
                <strong>Ngày tải lên:</strong>{" "}
                <span>
                  {" "}
                  {selectedImage?.created_at
                    ? format(
                        new Date(selectedImage.created_at),
                        "dd/MM/yyyy HH:mm"
                      )
                    : "-"}
                </span>
              </div>
              <div>
                <strong>Dung lượng ảnh:</strong>{" "}
                <span>
                  {selectedImage
                    ? `${(
                        selectedImage.meta?.variants?.thumbnail?.size / 1024
                      ).toFixed(1)}KB`
                    : "-"}
                </span>
              </div>

              {/* kích thước ảnh */}
              <div className="flex items-center gap-1">
                <strong>Kích thước ảnh: </strong>{" "}
                <span>
                  {selectedImage
                    ? `${selectedImage.meta?.variants?.thumbnail?.width}x${selectedImage.meta?.variants?.thumbnail?.height}`
                    : "-"}
                </span>
                {/* Ghi chú bằng Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="ml-2 text-gray-400 hover:text-gray-600 transition"
                      aria-label="Ghi chú về kích thước ảnh"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 text-xs text-gray-600 z-[9999]">
                    <p className="italic">
                      * Kích thước hiển thị ở đây là kích thước tự động của
                      phiên bản
                      <strong> thumbnail (400×250)</strong>. Ảnh khi chèn vào
                      bài viết sẽ có <strong>max-width 850px</strong> và{" "}
                      <strong>max-height 500px</strong>.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Button xóa vĩnh viễn */}
              <button
                disabled={!selectedImage}
                onClick={() => setShowDeleteConfirm(true)}
                className={`mt-2 text-red-600 text-sm hover:underline ${
                  !selectedImage && "opacity-50 pointer-events-none"
                }`}
              >
                Xóa vĩnh viễn
              </button>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4 text-sm text-gray-700">
              {/* Tiêu đề ảnh */}
              <div className="space-y-1">
                <Label htmlFor="image-title">Tiêu đề ảnh *</Label>
                <Input
                  id="image-title"
                  value={imageTitle}
                  onChange={(e) => {
                    setImageTitle(e.target.value);
                    if (errors.title && e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, title: false }));
                    }
                  }}
                  placeholder="Dùng làm Alt text & Tên tệp (slug)"
                  required
                  className={`border ${
                    errors.title
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-slate-300 dark:border-slate-600 focus-visible:ring-blue-600"
                  } focus-visible:ring-1 focus-visible:ring-offset-0 caret-blue-600 rounded-lg`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    Trường này là bắt buộc
                  </p>
                )}
              </div>

              {/* Chú thích ảnh */}
              <div className="space-y-1">
                <Label htmlFor="image-caption">Chú thích ảnh *</Label>
                <Textarea
                  id="image-caption"
                  value={imageCaption}
                  onChange={(e) => {
                    setImageCaption(e.target.value);
                    if (errors.caption && e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, caption: false }));
                    }
                  }}
                  placeholder="Chú thích sẽ hiển thị dưới ảnh"
                  rows={3}
                  required
                  className={`border ${
                    errors.caption
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-slate-300 dark:border-slate-600 focus-visible:ring-blue-600"
                  } focus-visible:ring-1 focus-visible:ring-offset-0 caret-blue-600 rounded-lg`}
                />
                {errors.caption && (
                  <p className="text-red-500 text-xs mt-1">
                    Trường này là bắt buộc
                  </p>
                )}
              </div>

              {/* Mô tả */}
              <div className="space-y-1">
                <Label htmlFor="image-description">
                  Mô tả chi tiết (tuỳ chọn)
                </Label>
                <Textarea
                  id="image-description"
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder="Mô tả giúp người khiếm thị hiểu nội dung ảnh"
                  rows={3}
                  className="border border-slate-300 dark:border-slate-600 focus-visible:ring-blue-600 
                  focus-visible:ring-1 focus-visible:ring-offset-0 caret-blue-600 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal xác nhận xóa ảnh */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-2">Xác nhận xóa ảnh</h3>
              <p className="text-sm text-gray-600 mb-6">
                Bạn có chắc muốn xóa <strong>"{selectedImage?.title}"</strong>{" "}
                vĩnh viễn không? <br />
                Hành động này <strong>không thể hoàn tác</strong>.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  disabled={deleting}
                >
                  Hủy
                </button>
                <button
                  onClick={async () => {
                    setDeleting(true);
                    await handleDeleteImage();
                    setDeleting(false);
                    setShowDeleteConfirm(false);
                  }}
                  disabled={deleting}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    "Xóa"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          {/* button chèn ảnh vào thumbnail (OG) */}
          <button
            onClick={() => {
              if (!selectedImage) return;

              const newErrors = {
                title: !imageTitle.trim(),
                caption: !imageCaption.trim(),
              };
              setErrors(newErrors);

              if (newErrors.title || newErrors.caption) {
                toast.error("Vui lòng nhập đầy đủ Tiêu đề và Chú thích ảnh!");
                return;
              }

              // Gọi callback với metadata (đầy đủ như khi chèn bài viết)
              onSelectThumbnail?.({
                ...selectedImage,
                title: imageTitle.trim(),
                alt: imageTitle.trim(),
                caption: imageCaption.trim(),
                description: imageDescription.trim(),
              });
            }}
            disabled={!selectedImage}
            className={`border border-indigo-600 text-indigo-600 px-4 py-2 rounded flex items-center gap-2 transition-all duration-300 cursor-pointer
            ${
              selectedImage
                ? "hover:bg-indigo-600 hover:text-white"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            <Image className="w-4 h-4" /> Chọn làm ảnh thumbnail
          </button>

          {/* button chèn ảnh vào editor */}
          <button
            disabled={!selectedImage}
            onClick={() => {
              if (!selectedImage) return;

              const newErrors = {
                title: !imageTitle.trim(),
                caption: !imageCaption.trim(),
              };
              setErrors(newErrors);

              if (newErrors.title || newErrors.caption) {
                toast.error("Vui lòng nhập đầy đủ Tiêu đề và Chú thích ảnh!");
                return;
              }

              // Gọi callback với metadata
              onInsertImage?.({
                ...selectedImage,
                title: imageTitle.trim(),
                alt: imageTitle.trim(),
                caption: imageCaption.trim(),
                description: imageDescription.trim(),
              });
            }}
            className={`bg-indigo-600 text-white px-6 py-2 rounded flex items-center gap-2 transition-all duration-300 cursor-pointer
            ${
              selectedImage
                ? "hover:bg-indigo-700"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            <FileUp className="w-4 h-4" /> Chèn vào bài viết
          </button>
        </div>
      </div>
    </div>
  );

  const mediaRoot = document.getElementById("media-root");
  if (!mediaRoot) return null;

  return ReactDOM.createPortal(modal, mediaRoot);
}
