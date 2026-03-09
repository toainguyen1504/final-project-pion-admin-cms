import React from "react";
import { Search, Columns3Cog, Funnel } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import FilterSelect from "@/components/shared/FilterSelect";
import { isAdminUser } from "@/utils/auth";

export default function TableToolbar({
  selectedCount = 0,
  searchLoading = false,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  visibleColumns,
  tempColumns,
  onTempColumnToggle,
  defaultColumns,
  popoverOpen,
  setPopoverOpen,
  onApplyColumns,
  onResetColumns,
  onDeleteSelected,
  isTempInitializedRef,
  columnsConfig = [], // Dynamic column list

  // props cho filter
  filterType = null, // "course" | "lesson" | "flashcard"
  programOptions = [],
  programId,
  setProgramId,
  courseOptions = [],
  courseId,
  setCourseId,
  lessonOptions = [],
  lessonId,
  setLessonId,
  onResetFilters, // callback
}) {
  const isAdmin = isAdminUser();

  const hasChangeColumns =
    JSON.stringify(tempColumns) !== JSON.stringify(visibleColumns);
  const hasChangeFromDefaultColumns =
    JSON.stringify(tempColumns) !== JSON.stringify(defaultColumns);

  const handlePopoverOpenChange = (open) => {
    setPopoverOpen(open);
    if (open && !isTempInitializedRef.current) {
      isTempInitializedRef.current = true;
    }
  };

  return (
    <div className="flex justify-between items-center mr-2 rounded-xl">
      {/* Delete selected button */}
      <div
        className={clsx(
          "transition-all duration-300 ease-in-out",
          selectedCount > 0
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-1 invisible",
        )}
      >
        {/* tạm thời disable -> sau này phân quyền sau */}
        <Button
          disabled={!isAdmin || selectedCount === 0}
          onClick={onDeleteSelected}
          variant="destructive"
          size="sm"
          className="bg-red-600 hover:bg-red-500 dark:bg-red-600 text-white rounded-xl px-3 py-1.5 text-xs cursor-pointer"
        >
          Xóa {selectedCount} mục đã chọn
        </Button>
      </div>

      {/* Search + Columns */}
      <div className="flex flex-1 justify-end mr-2 rounded-xl">
        <div className="relative w-full max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {searchLoading ? (
              <Spinner className="w-4 h-4 animate-spin text-blue-500 absolute left-1 top-2.5" />
            ) : (
              <Search className="w-4 h-4  text-slate-400 dark:text-slate-500 absolute left-1 top-2.5" />
            )}
          </span>
          <Input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-10 pr-4 pt-2 pb-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800
                       focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 
                       caret-blue-600 rounded-xl"
          />
        </div>

        {/* Filter Settings */}
        {(filterType === "course" && programOptions.length > 0) ||
        (filterType === "lesson" &&
          (programOptions.length > 0 || courseOptions.length > 0)) ||
        (filterType === "flashcard" &&
          (programOptions.length > 0 ||
            courseOptions.length > 0 ||
            lessonOptions.length > 0)) ? (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="p-1 rounded text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 
                         dark:text-slate-300 cursor-pointer ml-3"
              >
                <Funnel />
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={8}
              className="z-50 w-72 p-4 flex flex-col gap-4 bg-white dark:bg-slate-900 border 
                       border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-[70vh]"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                  Bộ lọc
                </span>
                <button
                  onClick={onResetFilters}
                  className="text-red-500 dark:text-red-400 font-medium text-xs hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Program filter */}
              {programOptions.length > 0 && (
                <FilterSelect
                  options={programOptions}
                  value={programId}
                  onChange={setProgramId}
                  placeholder="Chọn chương trình học"
                />
              )}

              {/* Course filter */}
              {filterType !== "course" && courseOptions.length > 0 && (
                <FilterSelect
                  options={courseOptions}
                  value={courseId}
                  onChange={setCourseId}
                  placeholder="Chọn khóa học"
                />
              )}

              {/* Lesson filter */}
              {filterType === "flashcard" && lessonOptions.length > 0 && (
                <FilterSelect
                  options={lessonOptions}
                  value={lessonId}
                  onChange={setLessonId}
                  placeholder="Chọn bài học"
                />
              )}
            </PopoverContent>
          </Popover>
        ) : null}

        {/* Column Settings */}
        <Popover open={popoverOpen} onOpenChange={handlePopoverOpenChange}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="p-1 rounded text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 
                         dark:text-slate-300 cursor-pointer ml-3"
            >
              <Columns3Cog className="w-6 h-6" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={8}
            className="absolute z-50 w-64 p-4 space-y-3 bg-white dark:bg-slate-900 border 
                       border-slate-200 dark:border-slate-700 rounded-xl shadow-xl translate-x-[-100%]
                       flex flex-col max-h-[60vh]"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                Columns
              </span>
              <button
                disabled={!hasChangeFromDefaultColumns}
                onClick={onResetColumns}
                className={`text-red-500 dark:text-red-400 font-medium text-xs hover:underline outline-0 
                            duration-300 transition-opacity ${
                              !hasChangeFromDefaultColumns
                                ? "opacity-50 cursor-not-allowed"
                                : "opacity-100 cursor-pointer"
                            }`}
              >
                Reset
              </button>
            </div>

            {/* Dynamic column list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {columnsConfig.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={`col-${key}`}
                    checked={tempColumns[key]}
                    onCheckedChange={() => onTempColumnToggle(key)}
                    disabled={defaultColumns[key]}
                    className={clsx(
                      defaultColumns[key]
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer",
                    )}
                  />
                  <label
                    htmlFor={`col-${key}`}
                    className="text-sm text-slate-700 dark:text-slate-300"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>

            <Button
              onClick={onApplyColumns}
              disabled={!hasChangeColumns}
              className="w-full mt-2 bg-indigo-600 text-white hover:bg-indigo-500 
                         dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all duration-300 
                         min-w-36 cursor-pointer rounded-xl"
            >
              Áp dụng
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
