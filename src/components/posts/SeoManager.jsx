import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SeoChecklist } from "./SeoChecklist";

export function SeoManager() {
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
          <p className="text-slate-500 dark:text-slate-300">
            https://pion.edu.vn/tin-tuc/duong-dan-mac-dinh
          </p>
          <p className="font-medium text-slate-500 dark:text-slate-300">Tiêu đề bài viết sẽ hiển thị ở đây...</p>
          <p className="text-slate-500 dark:text-slate-300">
            Đoạn giới thiệu ngắn sẽ hiển thị ở đây...
          </p>
        </div>
        <Button
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
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-center space-x-2">
            <Label htmlFor="focus-keyword" className="text-base ml-2">
              Focus Keyword
            </Label>
            <Badge variant="destructive" className="px-1.5 py-1 rounded-full">
              80
            </Badge>
          </div>

          <Input
            id="focus-keyword"
            placeholder="Nhập từ khóa và nhấn Enter..."
            className="pl-4 pr-4 border border-slate-300 dark:border-slate-600 focus-visible:ring-blue-600 
              focus-visible:ring-1 focus-visible:ring-offset-0 caret-blue-600 rounded-xl"
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="my-8 rounded-md border border-border">
        <SeoChecklist />
      </div>
    </div>
  );
}
