import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SeoChecklist } from "./SeoChecklist";
import { FocusKeywordInput } from "./FocusKeywordInput";
import { SeoSnippetModal } from "./SeoSnippetModal";
import { useSeoSnippet } from "@/hooks";

export function SeoManager() {
  const [open, setOpen] = useState(false);
  const seo = useSeoSnippet();

  return (
    <div className="space-y-6 bg-card p-6 pt-6 pb-10 rounded-xl border border-border text-card-foreground">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
        Rank Math SEO
      </h3>
      <Separator />

      {/* SEO Preview */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-700 dark:text-slate-200">
          SEO Preview
        </h4>
        <div className="text-sm space-y-1">
          <p className="text-slate-500">{seo.BASE_URL + seo.slug}</p>
          <p className="font-medium text-slate-600">{seo.title}</p>
          <p className="text-slate-500">{seo.desc}</p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl 
              !text-white min-w-36 cursor-pointer pb-0.5 mt-2"
        >
          Edit Snippet
        </Button>
      </div>

      <Separator />

      {/* Focus Keyword */}
      <FocusKeywordInput />

      {/* Checklist */}
      <div className="my-8 rounded-md border border-border">
        <SeoChecklist />
      </div>

      <SeoSnippetModal open={open} onOpenChange={setOpen} seo={seo} />
    </div>
  );
}
