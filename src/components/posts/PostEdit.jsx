import { Helmet } from "react-helmet-async";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Image, Save, Info } from "lucide-react";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { SeoManager } from "./components/SeoManager";
import { PostSidebar } from "./PostSidebar";
import MediaLibrary from "./MediaLibrary";

import { slugify } from "@/lib/utils";
import { fetchCategories } from "@/lib/api/categories";
import { getPostById, updatePost } from "@/lib/api/posts";
import classNames from "classnames/bind";

import "@/components/tiptap-templates/simple/simple-editor.scss";
import styles from "./Posts.module.scss";
const cx = classNames.bind(styles);

function PostEdit() {
  const { id } = useParams();
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
  const [allKeywords, setAllKeywords] = useState([]); // all keywords
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [featuredMedia, setFeaturedMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false);
  const [postData, setPostData] = useState(null);

  // review modal
  const [showReview, setShowReview] = useState(false);

  const [contentLoaded, setContentLoaded] = useState(false);

  const handleEditorReady = useCallback((editorInstance) => {
    console.log("✅ Editor is ready:", editorInstance);
    setEditor(editorInstance);

    // Log nội dung ban đầu nếu có
    console.log("Initial HTML:", editorInstance.getHTML());
    console.log("Initial Text:", editorInstance.getText());
  }, []);

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      const { data } = await fetchCategories(1, "updated_at", "desc", "");
      setAllCategories(data);
    };
    getCategories();
  }, []);

  // Fetch post data
  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await getPostById(id);
        // console.log("data in edit:", data);
        setPostData(data);

        // set keywords
        const keywordsArray = data.seo_keywords
          ? data.seo_keywords.split(",").map((k) => k.trim())
          : [];
        setAllKeywords(keywordsArray);
        // console.log("keywordsArray", keywordsArray);

        setTitle(data.title);
        setVisibility(data.visibility || "private");
        setPublishDate(new Date(data.publish_at));
        setSelectedCategories(data.categories?.map((cat) => cat.id) || []);
        setSeoData({
          seoTitle: data.seo_title || data.title,
          seoSlug: data.slug || slugify(data.title), // dùng slug từ db
          seoDescription: data.seo_description || "",
        });

        if (data.featured_media_id) {
          const res = await fetch(
            `${
              import.meta.env.MODE === "development"
                ? import.meta.env.VITE_API_URL_LOCAL
                : import.meta.env.VITE_API_URL_PRODUCTION
            }/media/${data.featured_media_id}`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (res.ok) {
            const mediaData = await res.json();
            setFeaturedMedia(mediaData);
          } else {
            setFeaturedMedia(null);
          }
        } else {
          setFeaturedMedia(null);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading post:", err);
        toast.error("Không thể tải bài viết!");
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  // Load content vào editor 1 lần
  useEffect(() => {
    if (editor && postData?.content?.content_html && !contentLoaded) {
      editor.commands.setContent(postData.content.content_html);
      console.log(
        "✅ Loaded content into editor:",
        postData.content.content_html
      );
      console.log("✅ Editor current HTML:", editor.getHTML());
      console.log("✅ Editor current Text:", editor.getText());
      setContentLoaded(true);
    }
  }, [editor, postData?.content?.content_html, contentLoaded]);

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

  const BASE_SEO_PAYLOAD = {
    title: title,
    content: editor?.getText() || "",
    rawHtml: editor?.getHTML() || "",
    seoTitle: seoData.seoTitle || title,
    seoSlug: seoData.seoSlug,
    seoDescription: seoData.seoDescription || "",
  };

  const handleUpdate = async () => {
    const newErrors = [];

    if (!title.trim()) newErrors.push("Please enter a post title.");
    if (!editor) newErrors.push("Editor is not ready.");
    else {
      const textContent = editor.getText().trim();
      if (!textContent) newErrors.push("Please enter post content.");
      if (textContent.length < 50)
        newErrors.push(
          `Post content must be at least 50 characters (currently ${textContent.length}).`
        );
    }
    if (!selectedCategories.length)
      newErrors.push("Please select at least one category.");

    setErrors(newErrors);
    if (newErrors.length) return;

    const payload = {
      title,
      sapo_text: "Short summary for the post",
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
      await updatePost(id, payload);
      toast.success("Cập nhật bài viết thành công!");
      navigate("/posts");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Cập nhật thất bại! Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500">
        Đang tải bài viết...
      </div>
    );
  }

  const hasTitleError = errors.some((e) => e.toLowerCase().includes("title"));
  const hasContentError = errors.some((e) =>
    e.toLowerCase().includes("content")
  );

  return (
    <div className="p-4">
      <Helmet>
        <title>Edit Post | Pion CMS</title>
        <meta name="description" content="Edit existing post in system" />
      </Helmet>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
              Edit Post
            </h2>
            <p className="text-slate-500 mt-2">
              Update and optimize your post content, SEO, and publishing
              settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowReview(true)}
              variant="outline"
              className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Review
            </Button>

            <Button
              type="button"
              onClick={handleUpdate}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 min-w-40 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Update
            </Button>
          </div>
        </div>
      </div>

      <div className="flex space-x-5">
        <div className="flex-1 space-y-5">
          {errors.length > 0 && (
            <Alert variant="destructive" className="mb-5">
              <AlertTitle>Submission Error</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Input
            id="post-title"
            value={title}
            maxLength={100}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Edit post title"
            className={`py-6 px-6 !text-base border rounded-xl caret-blue-600 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 ${
              hasTitleError
                ? "border-2 border-red-500 focus-visible:ring-red-500"
                : "border-slate-200 dark:border-slate-700 focus-visible:ring-blue-600"
            } text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]`}
          />

          {/* Editor and media library */}
          <div className="space-y-3">
            {/* Button media library and Tip viết bài */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => setShowMediaLibrary(true)}
                variant="outline"
                className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Image className="w-4 h-4" />
                Media Library
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
                    TIP Viết bài
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="max-w-sm p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  <p>
                    ✍️ Viết bài viết đơn giản,{" "}
                    <strong>không style nhiều</strong>. Style sẽ được định dạng
                    tự động tương tự như khi xem <strong>REVIEW</strong>, vì vậy
                    hãy luôn kiểm tra REVIEW để tránh lỗi giao diện!
                    <br />
                    📱 Nhắn <strong>Zalo: 0963001504 (ToaiCdev)</strong> để được
                    hướng dẫn.
                  </p>
                </PopoverContent>
              </Popover>
            </div>

            {/* Editor */}
            <div
              className={`bg-background text-foreground shadow-lg rounded-xl ${
                hasContentError ? "border-2 border-red-500" : ""
              }`}
            >
              <SimpleEditor onReady={handleEditorReady} />
            </div>
          </div>

          {/* SeoManager mới - dùng ref initialLoad bên trong */}
          <SeoManager
            {...BASE_SEO_PAYLOAD}
            onSeoChange={setSeoData}
            onAllKeywordsChange={setAllKeywords}
            initialKeywords={allKeywords}
          />
        </div>

        <PostSidebar
          featuredMedia={featuredMedia}
          visibility={visibility}
          setVisibility={setVisibility}
          publishDate={publishDate}
          setPublishDate={setPublishDate}
          allCategories={allCategories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          isCategoryPopupOpen={isCategoryPopupOpen}
          setIsCategoryPopupOpen={setIsCategoryPopupOpen}
          categoryError={errors.some((e) =>
            e.toLowerCase().includes("category")
          )}
        />
      </div>

      {/* Review Modal */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="min-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              Review Post
            </DialogTitle>
          </DialogHeader>

          <div
            className={cx("post-wrapper", "max-h-[85vh]", "overflow-y-auto")}
          >
            <div className={cx("post-content")}>
              {/* Tiêu đề */}
              <h1>{title || "Untitled Post"}</h1>

              {/* Nội dung từ editor */}
              <div
                className={cx("post-body")}
                dangerouslySetInnerHTML={{
                  __html: editor?.getHTML() || "",
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
          onSelectThumbnail={(media) => setFeaturedMedia(media)}
          onInsertImage={(media) => {
            if (!editor) return;
            const BASE_MEDIA_URL =
              import.meta.env.MODE === "development"
                ? import.meta.env.VITE_BASE_MEDIA_URL_LOCAL
                : import.meta.env.VITE_BASE_MEDIA_URL_PRODUCTION;

            const imageUrl = `${BASE_MEDIA_URL}${
              media.meta?.variants?.medium?.url || media.url
            }`;

            editor
              .chain()
              .focus()
              .setImageLibrary({
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

export default PostEdit;
