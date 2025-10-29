import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Upload, Image, CloudUpload, FileUp, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useMedia } from "@/hooks/useMedia";
import { uploadMedia } from "@/lib/api/media";
import IMAGE_DEFAULT from "@/assets/images/placeholder_img.png";

export default function MediaLibrary({ onClose, onSelectThumbnail }) {
  const [activeTab, setActiveTab] = useState("library");
  const [selectedImage, setSelectedImage] = useState(null);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false); // loading riêng cho upload

  // metadata for image
  const [imageTitle, setImageTitle] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [imageDescription, setImageDescription] = useState("");

  // Dùng hook gọi API thật
  const { mediaList, loading, reloadMedia, BASE_MEDIA_URL } = useMedia();

  // Chọn / bỏ chọn ảnh
  const handleImageClick = (img) => {
    if (selectedImage && selectedImage.id === img.id) {
      setSelectedImage(null);
    } else {
      setSelectedImage(img);
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
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition ${
              activeTab === "upload"
                ? "text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Upload className="w-4 h-4" /> Tải lên
          </button>

          <button
            onClick={() => setActiveTab("library")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition ${
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
                alt={selectedImage?.caption || "Preview"}
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
                <span>{selectedImage ? selectedImage.created_at : "-"}</span>
              </div>
              <div>
                <strong>Kích thước:</strong>{" "}
                <span>
                  {selectedImage
                    ? `${(
                        selectedImage.meta?.variants?.thumbnail?.size / 1024
                      ).toFixed(1)}KB`
                    : "-"}
                </span>
              </div>
              <div>
                <strong>Kích thước ảnh:</strong>{" "}
                <span>
                  {selectedImage
                    ? `${selectedImage.meta?.variants?.thumbnail?.width}x${selectedImage.meta?.variants?.thumbnail?.height}`
                    : "-"}
                </span>
              </div>

              <button
                disabled={!selectedImage}
                className={`mt-2 text-red-600 text-sm hover:underline ${
                  !selectedImage && "opacity-50 pointer-events-none"
                }`}
              >
                Xóa vĩnh viễn
              </button>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4 text-sm text-gray-700">
              {/* Tiêu đề */}
              <div className="space-y-1">
                <Label htmlFor="image-title">Tiêu đề ảnh *</Label>
                <Input
                  id="image-title"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  placeholder="Nhập tiêu đề ảnh"
                  required
                  className="border border-slate-300 dark:border-slate-600 focus-visible:ring-blue-600 
                  focus-visible:ring-1 focus-visible:ring-offset-0 caret-blue-600 rounded-lg"
                />
              </div>

              {/* Chú thích */}
              <div className="space-y-1">
                <Label htmlFor="image-caption">Chú thích ảnh *</Label>
                <Textarea
                  id="image-caption"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Chú thích sẽ hiển thị dưới ảnh và dùng làm alt text"
                  rows={3}
                  required
                  className="border border-slate-300 dark:border-slate-600 focus-visible:ring-blue-600 
                  focus-visible:ring-1 focus-visible:ring-offset-0 caret-blue-600 rounded-lg"
                />
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

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition px-4 py-2 rounded flex items-center gap-2"
            onClick={() => {
              if (!selectedImage) return;
              onSelectThumbnail?.(selectedImage); // <-- gọi callback và truyền ảnh đã chọn
            }}
            disabled={!selectedImage}
          >
            <Image className="w-4 h-4" /> Chọn làm ảnh thumbnail
          </button>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-indigo-700 transition">
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
