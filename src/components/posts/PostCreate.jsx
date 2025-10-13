import { Helmet } from "react-helmet-async";
import { useCallback, useState } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Icon
import { Search, Eye } from "lucide-react";
import "@/components/tiptap-templates/simple/simple-editor.scss";

import { SeoManager } from "./SeoManager";
import { ScheduledPanel } from "./ScheduledPanel";

function PostCreate() {
  const [editor, setEditor] = useState(null);

  const handleEditorReady = useCallback((editor) => {
    setEditor(editor);
  }, []);

  const [status, setStatus] = useState("draft");
  const [publishDate, setPublishDate] = useState(new Date());

  // eslint-disable-next-line no-unused-vars
  const handleLogHTML = () => {
    if (editor) {
      const html = editor.getHTML();
      console.log("HTML content:", html);
    } else {
      console.warn("Editor chưa sẵn sàng");
    }
  };
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
              type="submit"
              form="post-form"
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
          {/* Tile - H1 */}
          <div className="space-y-2">
            <Input
              id="post-title"
              required
              placeholder="Start with a strong post title (*)"
              className="py-6 px-6 !text-base border border-slate-200 dark:border-slate-700 rounded-xl caret-blue-600
              focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none
               text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
            />
          </div>

          {/* Editor */}
          <div
            className="bg-background text-foreground shadow-lg 
          dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)] rounded-xl"
          >
            <SimpleEditor onReady={handleEditorReady} />
          </div>

          {/* Rank math SEO */}
          <SeoManager />
        </div>

        {/* Column right */}
        <div className="w-[320px] border-l border-border rounded-xl p-6 bg-card text-card-foreground space-y-6">
          {/* Section: Publish */}
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold dark:text-slate-200">
                Publish
              </h3>
              <Badge
                variant="destructive"
                className="px-3 py-1 rounded-full select-none"
              >
                SEO: 30 / 100
              </Badge>
            </div>

            {/* Tabs for status */}
            <Tabs value={status} onValueChange={setStatus} className="w-full">
              <TabsList className="bg-slate-200 dark:bg-slate-700 rounded-full p-1">
                <TabsTrigger
                  value="published"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer
                    data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600
                    dark:data-[state=active]:bg-indigo-500 dark:data-[state=active]:text-indigo-100
                    text-slate-700 dark:text-slate-300"
                >
                  Published
                </TabsTrigger>
                <TabsTrigger
                  value="scheduled"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer
                    data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600
                    dark:data-[state=active]:bg-indigo-500 dark:data-[state=active]:text-indigo-100
                    text-slate-700 dark:text-slate-300"
                >
                  Scheduled
                </TabsTrigger>
                <TabsTrigger
                  value="draft"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer
                    data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600
                    dark:data-[state=active]:bg-indigo-500 dark:data-[state=active]:text-indigo-100
                    text-slate-700 dark:text-slate-300"
                >
                  Private
                </TabsTrigger>
              </TabsList>

              {/* Scheduled content */}
              <ScheduledPanel
                isVisible={status === "scheduled"}
                publishDate={publishDate}
                setPublishDate={setPublishDate}
              />
            </Tabs>

            {/* Section: Categories */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-200">
                Categories
              </h3>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Search categories..."
                  className="pl-10 pr-4 pt-2 pb-2.5 border border-slate-300 dark:border-slate-600 focus-visible:ring-blue-600 
                  focus-visible:ring-1 focus-visible:ring-offset-0 caret-blue-600 rounded-xl"
                />
              </div>

              <div className="space-y-2 pt-2 text-sm">
                <div className="flex items-center gap-2">
                  <Switch id="news" />
                  <Label
                    htmlFor="news"
                    className="text-slate-700 dark:text-slate-200"
                  >
                    News
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="study-abroad" />
                  <Label
                    htmlFor="study-abroad"
                    className="text-slate-700 dark:text-slate-200"
                  >
                    Study Abroad
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="tuition-fees" />
                  <Label
                    htmlFor="tuition-fees"
                    className="text-slate-700 dark:text-slate-200"
                  >
                    Tuition Fees
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="recruitment" />
                  <Label
                    htmlFor="recruitment"
                    className="text-slate-700 dark:text-slate-200"
                  >
                    Recruitment
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section: Thumbnail */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              Thumbnail Image
            </h3>
            <div
              className="w-full h-32 px-4 text-center bg-muted rounded-md flex items-center justify-center 
            text-slate-500 dark:text-slate-200 text-sm"
            >
              No image selected - Render auto from media library
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCreate;
