import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export function SeoManager() {
  return (
    <div className="space-y-6 bg-card p-6 rounded-xl border border-border text-card-foreground">
      {/* SEO Preview */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">SEO Preview</h3>
        <div className="text-sm space-y-1">
          <p className="text-muted-foreground">
            https://pion.edu.vn/tin-tuc/duong-dan-mac-dinh
          </p>
          <p className="font-medium">Tiêu đề bài viết sẽ hiển thị ở đây...</p>
          <p className="text-muted-foreground">
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
            <Label htmlFor="focus-keyword">Focus Keyword</Label>
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

      <Separator />

      {/* Checklist */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">SEO Checklist</h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-red-500">Basic SEO</span>
            <span className="text-muted-foreground">5 issues</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-red-500">Additional</span>
            <span className="text-muted-foreground">5 issues</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-red-500">
              Content Readability
            </span>
            <span className="text-muted-foreground">5 issues</span>
          </div>
        </div>
      </div>
    </div>
  );
}
