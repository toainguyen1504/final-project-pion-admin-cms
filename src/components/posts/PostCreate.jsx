import { Helmet } from "react-helmet-async";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

// Icon
import { Eye, Image, Info } from "lucide-react";
import "@/components/tiptap-templates/simple/simple-editor.scss";

import { SeoManager } from "./components/SeoManager";
import { PostSidebar } from "./PostSidebar";
import { slugify } from "@/lib/utils";
import { createPost } from "@/lib/api/posts";
import { fetchCategories } from "@/lib/api/categories";
import MediaLibrary from "./MediaLibrary";
// import { mockImages } from "@/data";
import classNames from "classnames/bind";
import styles from "./Posts.module.scss";
const cx = classNames.bind(styles);

function PostCreate() {
  const navigate = useNavigate();
  const [editor, setEditor] = useState(null);
  const [visibility, setVisibility] = useState("private");
  const [publishDate, setPublishDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [seoData, setSeoData] = useState({
    seoTitle: "",
    seoSlug: "",
    seoDescription: "",
  });
  // const [focusKeyword, setFocusKeyword] = useState("");
  const [allKeywords, setAllKeywords] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // IDs selected
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [errors, setErrors] = useState([]); // error messages

  // media library modal
  const [featuredMedia, setFeaturedMedia] = useState(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  // review modal
  const [showReview, setShowReview] = useState(false);

  const handleEditorReady = useCallback((editorInstance) => {
    setEditor(editorInstance);
  }, []);

  const BASE_SEO_PAYLOAD = {
    title: title,
    content: editor?.getText() || "",
    rawHtml: editor?.getHTML() || "",
    seoTitle: seoData.seoTitle || title,
    seoSlug: seoData.seoSlug || slugify(title),
    seoDescription: seoData.seoDescription || "",
  };

  // get all categories
  useEffect(() => {
    const getCategories = async () => {
      const { data } = await fetchCategories(1, "updated_at", "desc", "");
      setAllCategories(data);
    };
    getCategories();
  }, []);

  // Mapping visibility to status
  const mapVisibilityToStatus = (visibility) => {
    switch (visibility) {
      case "public":
        return "published";
      case "scheduled_public":
        return "pending";
      case "private":
      default:
        return "draft";
    }
  };

  const getPublishDate = () => {
    const formatLocalDate = (date) => format(date, "yyyy-MM-dd HH:mm:ss");

    if (visibility === "scheduled_public" && publishDate) {
      return formatLocalDate(publishDate);
    }

    return formatLocalDate(new Date());
  };

  // Handle submit
  const handleSubmit = async () => {
    const newErrors = [];

    if (!title.trim()) newErrors.push("Vui lòng nhập tiêu đề bài viết.");
    if (!editor) newErrors.push("Trình soạn thảo chưa sẵn sàng.");
    else {
      const textContent = editor.getText().trim();
      if (!textContent) newErrors.push("Vui lòng nhập nội dung bài viết.");
      if (textContent.length < 50)
        newErrors.push(
          `Nội dung bài viết phải có ít nhất 50 ký tự (hiện tại là ${textContent.length}).`
        );
    }
    if (!selectedCategories.length)
      newErrors.push("Vui lòng chọn ít nhất một danh mục.");

    setErrors(newErrors);
    if (newErrors.length) return; // Stop submit if errors exist

    // Payload
    const payload = {
      title,
      sapo_text: "",
      slug: slugify(seoData.seoTitle || title),
      seo_title: seoData.seoTitle,
      seo_description: seoData.seoDescription,
      seo_keywords: allKeywords.length ? allKeywords.join(",") : "", // tất cả keywords
      content: editor.getHTML(),
      status: mapVisibilityToStatus(visibility),
      visibility,
      publish_at: getPublishDate(),
      category_ids: selectedCategories,
      featured_media_id: featuredMedia?.id || null,
    };

    try {
      await createPost(payload);
      toast.success("Tạo bài viết thành công!");
      setTitle("");
      setSelectedCategories([]);
      editor.commands.clearContent();
      setFeaturedMedia(null);
      setErrors([]);

      // Chuyển về danh sách post
      navigate("/bai-viet");
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      toast.error("Tạo bài viết thất bại! Vui lòng thử lại.");
    }
  };

  const hasTitleError = errors.some((e) => e.toLowerCase().includes("title"));
  const hasContentError = errors.some((e) =>
    e.toLowerCase().includes("content")
  );
  const hasCategoryError = errors.some((e) =>
    e.toLowerCase().includes("category")
  );

  return (
    <div className="p-4">
      <Helmet>
        <title>Thêm Bài Viết | Pion CMS</title>
        <meta name="description" content="Tạo bài viết cho hệ thống quản lý" />
      </Helmet>

      <div className="mb-6">
        {/* Header + Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
              Thêm Bài Viết
            </h2>
            <p className="text-slate-500 mt-2">
              Tạo bài viết chuẩn SEO với định dạng đơn giản, hỗ trợ hình ảnh và
              các công cụ xuất bản chuyên nghiệp.
            </p>
          </div>

          {/* Button */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowReview(true)}
              variant="outline"
              className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-xl flex items-center gap-2
              cursor-pointer transition-all duration-300"
            >
              <Eye className="w-4 h-4" />
              Xem Trước
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl 
            text-white min-w-40 cursor-pointer transition-all duration-300"
            >
              Lưu Bài Viết
            </Button>
          </div>
        </div>
      </div>

      <div className="flex space-x-5">
        {/* Column left */}
        <div className="flex-1 space-y-5">
          {/* Error list */}
          {errors.length > 0 && (
            <Alert variant="destructive" className="mb-5">
              <AlertTitle>Lỗi Khi Lưu Bài Viết</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            {/* Tile - H1 */}
            <Input
              id="post-title"
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Viết một tiêu đề bài viết rõ ràng và thu hút (tối đa 100 ký tự)"
              className={`py-6 px-6 !text-base border rounded-xl caret-blue-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 ${
                hasTitleError
                  ? "border-2 border-red-500 focus-visible:ring-red-500"
                  : "border-slate-200 dark:border-slate-700 focus-visible:ring-blue-600"
              } text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]`}
            />
          </div>

          {/* Editor and media library */}
          <div className="space-y-3">
            {/* button */}
            {/* Button media library and Tip viết bài */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => setShowMediaLibrary(true)}
                variant="outline"
                className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Image className="w-4 h-4" />
                Thư Viện Ảnh
              </Button>
              {/* Popover TIP Viết bài */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Info className="w-4 h-4 text-blue-500" />
                    TIP Viết Bài
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="max-w-sm p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  <p>
                    ✍️ Viết bài viết đơn giản,{" "}
                    <strong>không style nhiều</strong>. Style sẽ được định dạng
                    tự động tương tự như khi <strong> Xem Trước</strong>, vì vậy
                    hãy luôn kiểm tra trước để tránh lỗi giao diện!
                    <br />
                    📱 Nhắn <strong>Zalo: 0963001504 (ToaiCdev)</strong> để được
                    hướng dẫn.
                  </p>
                </PopoverContent>
              </Popover>
            </div>

            {/* Editor */}
            <div
              className={`bg-background text-foreground shadow-lg dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)] rounded-xl ${
                hasContentError ? "border-2 border-red-500" : ""
              }`}
            >
              <SimpleEditor onReady={handleEditorReady} />
            </div>
          </div>

          {/* Rank math SEO - Truyền callback để nhận seoData*/}
          <SeoManager
            {...BASE_SEO_PAYLOAD}
            onSeoChange={setSeoData}
            onAllKeywordsChange={setAllKeywords}
          />
        </div>

        {/* Column right */}
        <PostSidebar
          featuredMedia={featuredMedia} //thumbnail (OG) của media library (sidebar)
          visibility={visibility}
          setVisibility={setVisibility}
          publishDate={publishDate}
          setPublishDate={setPublishDate}
          allCategories={allCategories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          isCategoryPopupOpen={isCategoryPopupOpen}
          setIsCategoryPopupOpen={setIsCategoryPopupOpen}
          categoryError={hasCategoryError} // highlight category field
        />
      </div>

      {/* Review Modal */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="min-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              Xem Trước Bài Viết
            </DialogTitle>
          </DialogHeader>

          <div
            className={cx("post-wrapper", "max-h-[85vh]", "overflow-y-auto")}
          >
            <div className={cx("post-content")}>
              {/* Tiêu đề */}
              <h1>{title || "Chưa có tiêu đề bài viết"}</h1>

              {/* Nội dung từ editor */}
              <div
                className={cx("post-body")}
                dangerouslySetInnerHTML={{
                  __html:
                    editor?.getHTML() || "<p>Hiện tại chưa có nội dung</p>",
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Media library Modal */}
      {showMediaLibrary && (
        <MediaLibrary
          onClose={() => setShowMediaLibrary(false)}
          onSelectThumbnail={(media) => {
            setFeaturedMedia(media);
          }}
          onInsertImage={(media) => {
            if (!editor) return;

            const BASE_MEDIA_URL =
              import.meta.env.MODE === "development"
                ? import.meta.env.VITE_BASE_MEDIA_URL_LOCAL
                : import.meta.env.VITE_BASE_MEDIA_URL_PRODUCTION;

            const imageUrl = `${BASE_MEDIA_URL}${
              media.meta?.variants?.medium?.url || media.url
            }`;

            // Chèn vào tiptap
            editor
              .chain()
              .focus()
              .setImage({
                src: imageUrl,
                alt: media.title || "Image",
                title: media.title || "",
                caption: media.caption || "",
              })
              .run();

            setShowMediaLibrary(false);
          }}
        />
      )}
    </div>
  );
}

export default PostCreate;
