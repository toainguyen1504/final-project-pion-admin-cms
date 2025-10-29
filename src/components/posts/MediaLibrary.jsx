import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Upload, Image, CloudUpload, FileUp, X } from "lucide-react";
import IMAGE_DEFAULT from "@/assets/images/placeholder_img.png";

export default function MediaLibrary({ mockImages = [], onClose }) {
  const [activeTab, setActiveTab] = useState("library");
  const [selectedImage, setSelectedImage] = useState(null);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Chọn / hủy chọn ảnh
  const handleImageClick = (img) => {
    if (selectedImage && selectedImage.id === img.id) {
      // Nếu click lại cùng ảnh -> hủy chọn
      setSelectedImage(null);
    } else {
      setSelectedImage(img);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  console.log("Render MediaLibrary");

  // Modal JSX
  const modal = (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
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
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === "library" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mockImages.map((img) => (
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
                      src={img.url}
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
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <CloudUpload className="w-10 h-10 text-indigo-600 mb-3" />
                <h5 className="text-lg font-medium mb-2">
                  Nhấn để tải lên ngay!
                </h5>

                <button
                  onClick={handleUploadClick}
                  className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition px-6 py-3 rounded-lg mt-3"
                >
                  Chọn tập tin
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
                    <ul className="list-disc text-left pl-5">
                      {files.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                    <button className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2">
                      <FileUp className="w-4 h-4" /> Tải lên
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-72 border-l p-4 bg-gray-50 flex flex-col">
            <h6 className="uppercase text-xs text-gray-500 mb-3 font-semibold">
              Chi tiết đính kèm
            </h6>

            <div className="mb-3">
              <img
                src={selectedImage?.url || IMAGE_DEFAULT}
                alt={selectedImage?.title || "Preview"}
                className="rounded border w-full h-32 object-cover"
                onError={(e) => (e.target.src = IMAGE_DEFAULT)}
              />
            </div>

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
                        selectedImage.meta.variants.thumbnail.size / 1024
                      ).toFixed(1)}KB`
                    : "-"}
                </span>
              </div>
              <div>
                <strong>Kích thước ảnh:</strong>{" "}
                <span>
                  {selectedImage
                    ? `${selectedImage.meta.variants.thumbnail.width}x${selectedImage.meta.variants.thumbnail.height}`
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
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition px-4 py-2 rounded flex items-center gap-2">
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
