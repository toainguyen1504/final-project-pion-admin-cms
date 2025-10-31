import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { normalizeText, getImageOGSrc } from "@/lib/utils";
import { useMedia } from "@/hooks/useMedia";
import { ScheduledPanel } from "./components/ScheduledPanel";

const getFeaturedMedia = (media) => {
  if (!media) return null;
  return media.data ? media.data : media;
};

export function PostSidebar({
  visibility,
  setVisibility,
  publishDate,
  setPublishDate,
  allCategories,
  selectedCategories,
  setSelectedCategories,

  isCategoryPopupOpen,
  setIsCategoryPopupOpen,

  categoryError,
  featuredMedia,
}) {
  // Temporary selection for popup
  const [tempSelected, setTempSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // featured category list
  const featuredCategories = allCategories.filter(
    (cat) => cat.is_featured === 1
  );

  // filtered non-featured categories
  const filteredCategories = allCategories
    .filter((cat) => cat.is_featured !== 1)
    .filter((cat) =>
      normalizeText(cat.name).includes(normalizeText(searchTerm))
    );

  // toggle category
  const handleToggleCategory = (id, useTemp = false) => {
    const setter = useTemp ? setTempSelected : setSelectedCategories;
    const state = useTemp ? tempSelected : selectedCategories;

    if (state.includes(id)) {
      setter(state.filter((c) => c !== id));
    } else {
      setter([...state, id]);
    }
  };

  // When popup opens, initialize tempSelected
  const handleOpenPopup = () => {
    if (!isCategoryPopupOpen) {
      setTempSelected(selectedCategories);
    }
    setIsCategoryPopupOpen(true);
  };

  // Dùng hook gọi BASE URL
  const { BASE_MEDIA_URL } = useMedia();

  const displayMedia = getFeaturedMedia(featuredMedia);

  // console.log("featuredMedia:", featuredMedia);

  return (
    <div className="w-[320px] border-l border-border rounded-xl p-6 bg-card text-card-foreground space-y-6">
      {/* Section: Publish */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold dark:text-slate-200">Publish</h3>

          {/* Help Icon */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label="Help about publish settings"
              >
                <HelpCircle className="w-5 h-5 cursor-pointer" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 text-sm">
              <p>
                Choose <strong>Public</strong> to make your post visible to
                everyone. Use <strong>Scheduled</strong> to publish at a future
                date, or
                <strong>Private</strong> to keep it hidden.
              </p>
            </PopoverContent>
          </Popover>
        </div>

        <Tabs
          value={visibility}
          onValueChange={setVisibility}
          className="w-full"
        >
          <TabsList className="bg-slate-200 dark:bg-slate-700 rounded-full p-1">
            <TabsTrigger
              value="public"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer
                data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600
                dark:data-[state=active]:bg-indigo-500 dark:data-[state=active]:text-indigo-100
                text-slate-700 dark:text-slate-300"
            >
              Public
            </TabsTrigger>
            <TabsTrigger
              value="scheduled_public"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer
                data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600
                dark:data-[state=active]:bg-indigo-500 dark:data-[state=active]:text-indigo-100
                text-slate-700 dark:text-slate-300"
            >
              Scheduled
            </TabsTrigger>
            <TabsTrigger
              value="private"
              className="px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer
                data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600
                dark:data-[state=active]:bg-indigo-500 dark:data-[state=active]:text-indigo-100
                text-slate-700 dark:text-slate-300"
            >
              Private
            </TabsTrigger>
          </TabsList>

          <ScheduledPanel
            isVisible={visibility === "scheduled_public"}
            publishDate={publishDate}
            setPublishDate={setPublishDate}
          />
        </Tabs>
      </div>

      {/* Section: Categories */}
      <div className="space-y-2">
        <h3
          className={`text-lg font-semibold text-slate-500 dark:text-slate-200 ${
            categoryError ? "!text-red-500" : ""
          }`}
        >
          Categories *
        </h3>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />

          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleOpenPopup}
            placeholder="Search categories..."
            className="pl-10 pr-4 pt-2 pb-2.5 border border-slate-300 dark:border-slate-600 focus-visible:ring-blue-600 
             focus-visible:ring-1 focus-visible:ring-offset-0 caret-blue-600 rounded-xl"
          />

          {/* Selected tags */}
          {tempSelected.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tempSelected.map((id) => {
                const cat = filteredCategories.find((c) => c.id === id);
                if (!cat) return null;
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => handleToggleCategory(id, true)}
                  >
                    {cat.name} &times;
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Popup */}
          {isCategoryPopupOpen && (
            <div
              className="absolute z-50 w-full max-h-64 bg-card border border-border rounded-md mt-1 shadow-lg
              flex flex-col transition-all duration-200 ease-out transform scale-95 opacity-100"
            >
              <div className="overflow-y-auto max-h-[calc(16rem-3rem)] p-2 space-y-1">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      onClick={() => handleToggleCategory(cat.id, true)}
                    >
                      <input
                        type="checkbox"
                        checked={tempSelected.includes(cat.id)}
                        readOnly
                        className="accent-indigo-500 w-4 h-4"
                      />
                      <span className="text-slate-700 dark:text-slate-200">
                        {cat.name}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 dark:text-slate-500 p-2 text-sm">
                    No categories found
                  </div>
                )}
              </div>

              <div className="border-t border-border p-2 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCategoryPopupOpen(false)}
                  className="cursor-pointer select-none"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedCategories(tempSelected); // Apply temp to real state
                    setIsCategoryPopupOpen(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer select-none"
                >
                  OK
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Featured categories */}
        <div className="space-y-2 pt-2 text-sm max-h-64 overflow-y-auto">
          {featuredCategories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <Switch
                id={`cat-${cat.id}`}
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => handleToggleCategory(cat.id)}
              />
              <Label
                htmlFor={`cat-${cat.id}`}
                className="text-slate-700 dark:text-slate-200"
              >
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Thumbnail */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            Thumbnail Image
          </h3>

          {/* Help Icon */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label="Help about thumbnail"
              >
                <HelpCircle className="w-5 h-5 cursor-pointer" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 text-sm">
              <p>
                This thumbnail will be used as the featured image of the post on
                the frontend interface. It also serves as the preview image when
                the post is shared on social media (OG image).
              </p>
            </PopoverContent>
          </Popover>
        </div>

        {/* Thumbnail */}
        {displayMedia ? (
          <div className="relative w-full h-32 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <img
              src={getImageOGSrc(displayMedia)}
              alt={displayMedia.title || "Thumbnail"}
              className="w-full h-full object-cover transition-opacity duration-300"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className="w-full h-32 px-4 text-center bg-muted rounded-md flex items-center justify-center 
    text-slate-500 dark:text-slate-200 text-sm"
          >
            No image selected - Render auto from media library
          </div>
        )}
      </div>
    </div>
  );
}
