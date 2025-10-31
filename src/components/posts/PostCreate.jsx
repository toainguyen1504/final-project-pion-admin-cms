import { Helmet } from "react-helmet-async";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { format } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Icon
import { Eye, Image } from "lucide-react";
import "@/components/tiptap-templates/simple/simple-editor.scss";

import { SeoManager } from "./components/SeoManager";
import { PostSidebar } from "./PostSidebar";
import { slugify } from "@/lib/utils";
import { createPost } from "@/lib/api/posts";
import { fetchCategories } from "@/lib/api/categories";
import MediaLibrary from "./MediaLibrary";
// import { mockImages } from "@/data";

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

  // media library
  const [featuredMedia, setFeaturedMedia] = useState(null);

  // MEDIA library
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

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
      toast.success("Post created successfully!");
      setTitle("");
      setSelectedCategories([]);
      editor.commands.clearContent();
      setFeaturedMedia(null);
      setErrors([]);

      // Chuyển về danh sách post
      navigate("/posts");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post! Please try again.");
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
        <title>Create Post| Pion CMS</title>
        <meta name="description" content="Create Post for system management" />
      </Helmet>

      <div className="mb-6">
        {/* Header + Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
              Add Post
            </h2>
            <p className="text-slate-500 mt-2">
              Create SEO-friendly posts with rich formatting, image support, and
              structured publishing tools.
            </p>
          </div>

          {/* Button */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-xl flex items-center gap-2
              cursor-pointer transition-all duration-300"
            >
              <Eye className="w-4 h-4" />
              Review
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl 
            text-white min-w-40 cursor-pointer transition-all duration-300"
            >
              Save
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

          <div className="space-y-2">
            {/* Tile - H1 */}
            <Input
              id="post-title"
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Write a clear and catchy post title (max 100 characters)"
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
            <Button
              type="button"
              onClick={() => setShowMediaLibrary(true)}
              variant="outline"
              className="text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 rounded-xl flex items-center gap-2
                cursor-pointer transition-all duration-300"
            >
              <Image className="w-4 h-4" />
              Media Library
            </Button>

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
