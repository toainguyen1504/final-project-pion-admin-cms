import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SeoChecklist } from "./SeoChecklist";
import { FocusKeywordInput } from "./FocusKeywordInput";
import { SeoSnippetModal } from "./SeoSnippetModal";
import { useSeoSnippet } from "@/hooks";
import useSeoScore from "@/hooks/seo/useSeoScore";

export function SeoManager({
  title,
  content,
  rawHtml,
  seoTitle,
  seoSlug,
  seoDescription,
  onSeoChange,
  onAllKeywordsChange,
  initialKeywords = [],
}) {
  const [open, setOpen] = useState(false);

  // Sync giá trị ban đầu
  const seo = useSeoSnippet({
    title: seoTitle || "",
    slug: seoSlug || "",
    desc: seoDescription || "",
  });

  const { calculateSeoScore } = useSeoScore();
  const [focusKeyword, setFocusKeyword] = useState(""); //main keyword
  const [allKeywords, setAllKeywords] = useState([]); // tất cả keywords

  const [checklist, setChecklist] = useState([]);

  // Ref để chỉ sync SEO ban đầu 1 lần (tránh loop)
  const initialLoad = useRef(false);

  // Sync initial keywords từ parent (chỉ 1 lần khi mount)
  useEffect(() => {
    if (initialKeywords?.length) {
      setAllKeywords(initialKeywords);
    }
  }, [initialKeywords]);

  // Sync dữ liệu ban đầu từ props SEO (chỉ 1 lần khi mount hoặc khi postData thay đổi)
  useEffect(() => {
    if (!initialLoad.current) {
      seo.setTitle(seoTitle || "");
      seo.setSlug(seoSlug || "");
      seo.setDesc(seoDescription || "");
      initialLoad.current = true;
    }
  }, [seoTitle, seoSlug, seoDescription]);

  // Sync ngược lại parent khi user chỉnh sửa SEO snippet
  useEffect(() => {
    onSeoChange?.({
      seoTitle: seo.title,
      seoSlug: seo.slug,
      seoDescription: seo.desc,
    });
  }, [seo.title, seo.slug, seo.desc]);

  // gửi allKeywords lên parent PostCreate:
  useEffect(() => {
    if (onAllKeywordsChange) {
      onAllKeywordsChange(allKeywords);
    }
  }, [allKeywords]);

  // Tính điểm SEO tổng hợp
  useEffect(() => {
    if (!title && !content && !seo.title && !seo.desc) return;

    // eslint-disable-next-line no-unused-vars
    const { totalScore, checklist } = calculateSeoScore({
      title: seo.title,
      description: seo.desc,
      slug: seo.slug,
      content,
      keywords: focusKeyword
        ? focusKeyword
            .split(",")
            .map((kw) => kw.trim())
            .filter(Boolean)
        : [],
      rawHtml,
    });

    // console.log("🎯 Total SEO Score:", totalScore);
    // console.log("🎯 slug:", seo.slug);
    setChecklist(checklist);
  }, [seo.title, seo.desc, seo.slug, content, focusKeyword]);

  return (
    <div className="space-y-6 bg-card p-6 pt-6 pb-10 rounded-xl border border-border text-card-foreground">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
        Rank Math SEO
      </h3>
      <Separator />

      {/* SEO Preview */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-700 dark:text-slate-200">
          Xem trước
        </h4>
        <div className="text-sm space-y-1">
          <p className="text-blue-600 break-all">
            {seo.BASE_URL + (seo.slug || seo.DEFAULT_SEO.slug)}
          </p>
          <p className="font-medium text-slate-700 dark:text-slate-200">
            {seo.title || seo.DEFAULT_SEO.title}
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            {seo.desc || seo.DEFAULT_SEO.desc}
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl 
              !text-white min-w-36 cursor-pointer pb-0.5 mt-2"
        >
           Chỉnh sửa Snippet
        </Button>
      </div>

      <Separator />

      {/* Focus Keyword */}
      <FocusKeywordInput
        title={title}
        content={content}
        rawHtml={rawHtml}
        seoTitle={seo.title}
        seoSlug={seo.slug}
        seoDescription={seo.desc}
        onKeywordChange={setFocusKeyword} // mainKeyword
        onAllKeywordsChange={setAllKeywords} // array tất cả keywords
        initialKeywords={allKeywords} // để edit hiển thị tag cũ
      />

      {/* Checklist tổng hợp */}
      <div className="my-8 rounded-md border border-border">
        <SeoChecklist data={checklist} />
      </div>

      {/* Modal chỉnh sửa snippet */}
      <SeoSnippetModal open={open} onOpenChange={setOpen} seo={seo} />
    </div>
  );
}
