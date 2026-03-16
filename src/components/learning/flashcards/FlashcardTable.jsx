import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import SortableHeaderCell from "@/components/shared/table/SortableHeaderCell";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import TableToolbar from "@/components/shared/table/TableToolbar";
import FlashcardTableBody from "@/components/learning/flashcards/FlashcardTableBody";
import {
  deleteFlashcard,
  bulkDeleteFlashcards,
} from "@/lib/api/learning/flashcards";

function FlashcardTable({
  data,
  meta,
  page,
  setPage,
  sort,
  order,
  setSort,
  setOrder,
  search,
  setSearch,
  refreshFlashcards,

  // filter props
  programId,
  setProgramId,
  programOptions,
  courseId,
  setCourseId,
  courseOptions,
  lessonId,
  setLessonId,
  lessonOptions,
  onResetFilters,
}) {
  const totalPages = meta?.last_page || 1;

  const [selectedIds, setSelectedIds] = useState([]);
  const [typingValue, setTypingValue] = useState(search);

  // default columns
  const defaultColumns = {
    vocabulary: true,
    phonetic: false,
    translation: true,
    example_sentence: false,
    example_translation: false,
    level: false,
    order: false,
    lesson: true,
    course: true,
    program: false,
    created_at: true,
  };

  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [tempColumns, setTempColumns] = useState(defaultColumns);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("bulk");
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const isTempInitializedRef = useRef(false);

  const allSelected = data.length > 0 && selectedIds.length === data.length;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(data.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      if (deleteMode === "bulk") {
        if (selectedIds.length === 0) return;
        await bulkDeleteFlashcards(selectedIds);
        toast.success(`${selectedIds.length} flashcards deleted successfully!`);
        setSelectedIds([]);
      } else if (deleteMode === "single") {
        if (!selectedFlashcard) return;
        await deleteFlashcard(selectedFlashcard.id);
        toast.success(
          `Flashcard "${selectedFlashcard.vocabulary}" deleted successfully!`,
        );
        setSelectedIds((prev) =>
          prev.filter((id) => id !== selectedFlashcard.id),
        );
        setSelectedFlashcard(null);
      }
      if (typeof refreshFlashcards === "function") {
        await refreshFlashcards();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Delete failed!");
    } finally {
      setLoadingDelete(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleApplyColumns = () => {
    setVisibleColumns({ ...tempColumns });
    setPopoverOpen(false);
    isTempInitializedRef.current = false;
  };

  const handleResetColumns = () => {
    setTempColumns({ ...defaultColumns });
  };

  const handleTempColumnToggle = (key) => {
    setTempColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toolbarColSpan =
    Object.values(visibleColumns).filter(Boolean).length + 2;

  useEffect(() => {
    if (typingValue === search) return;
    setSearchLoading(true);
    const timeout = setTimeout(() => {
      setSearch(typingValue);
      setSearchLoading(false);
    }, 600);
    return () => clearTimeout(timeout);
  }, [typingValue]);

  return (
    <div className="space-y-4">
      <div className="border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader>
            {/* Search Row */}
            <TableRow>
              <TableCell
                colSpan={toolbarColSpan}
                className="px-4 py-3 border-b"
              >
                <TableToolbar
                  searchValue={typingValue}
                  onSearchChange={setTypingValue}
                  searchPlaceholder="Tìm kiếm flashcard..."
                  searchLoading={searchLoading}
                  selectedCount={selectedIds.length}
                  visibleColumns={visibleColumns}
                  tempColumns={tempColumns}
                  onTempColumnToggle={handleTempColumnToggle}
                  defaultColumns={defaultColumns}
                  columnsConfig={[
                    { key: "vocabulary", label: "Từ vựng" },
                    { key: "phonetic", label: "Phiên âm" },
                    { key: "translation", label: "Nghĩa Tiếng Việt" },
                    { key: "example_sentence", label: "Câu ví dụ" },
                    {
                      key: "example_translation",
                      label: "Dịch câu ví dụ",
                    },
                    { key: "level", label: "Level" },
                    { key: "order", label: "Order" },
                    { key: "lesson", label: "Bài học" },
                    { key: "course", label: "Khóa học" },
                    { key: "program", label: "Chương trình" },
                    { key: "created_at", label: "Thời gian tạo" },
                  ]}
                  popoverOpen={popoverOpen}
                  setPopoverOpen={setPopoverOpen}
                  onApplyColumns={handleApplyColumns}
                  onResetColumns={handleResetColumns}
                  isTempInitializedRef={isTempInitializedRef}
                  onDeleteSelected={() => {
                    setDeleteMode("bulk");
                    setDeleteDialogOpen(true);
                  }}
                  // filter props
                  filterType="flashcard"
                  programOptions={programOptions}
                  programId={programId}
                  setProgramId={setProgramId}
                  courseOptions={courseOptions}
                  courseId={courseId}
                  setCourseId={setCourseId}
                  lessonOptions={lessonOptions}
                  lessonId={lessonId}
                  setLessonId={setLessonId}
                  onResetFilters={onResetFilters}
                />
              </TableCell>
            </TableRow>

            {/* Label Row */}
            <TableRow>
              <TableCell className="px-4 py-3 font-semibold">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => handleSelectAll(checked)}
                  />
                </div>
              </TableCell>

              {visibleColumns.vocabulary && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="Từ vựng"
                    sortKey="vocabulary"
                    currentSort={sort}
                    order={order}
                    setSort={setSort}
                    setOrder={setOrder}
                  />
                </TableCell>
              )}
              {visibleColumns.phonetic && (
                <TableCell className="px-4 py-3 font-semibold">
                  Phiên âm
                </TableCell>
              )}
              {visibleColumns.translation && (
                <TableCell className="px-4 py-3 font-semibold">
                  Nghĩa Tiếng Việt
                </TableCell>
              )}

              {visibleColumns.example_sentence && (
                <TableCell className="px-4 py-3 font-semibold">
                  Câu ví dụ
                </TableCell>
              )}
              {visibleColumns.example_translation && (
                <TableCell className="px-4 py-3 font-semibold">
                  Dịch câu ví dụ
                </TableCell>
              )}
              {visibleColumns.level && (
                <TableCell className="px-4 py-3 font-semibold">Level</TableCell>
              )}
              {visibleColumns.order && (
                <TableCell className="px-4 py-3 font-semibold">Order</TableCell>
              )}

              {visibleColumns.lesson && (
                <TableCell className="px-4 py-3 font-semibold">
                  Bài học
                </TableCell>
              )}
              {visibleColumns.course && (
                <TableCell className="px-4 py-3 font-semibold">
                  Khóa học
                </TableCell>
              )}
              {visibleColumns.program && (
                <TableCell className="px-4 py-3 font-semibold">
                  Chương trình
                </TableCell>
              )}

              {visibleColumns.created_at && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="Thời gian tạo"
                    sortKey="created_at"
                    currentSort={sort}
                    order={order}
                    setSort={setSort}
                    setOrder={setOrder}
                  />
                </TableCell>
              )}

              <TableCell className="px-4 py-3 font-semibold"></TableCell>
            </TableRow>
          </TableHeader>

          <FlashcardTableBody
            data={data}
            visibleColumns={visibleColumns}
            selectedIds={selectedIds}
            handleSelectRow={handleSelectRow}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            search={search}
            setDeleteMode={setDeleteMode}
            setSelectedFlashcard={setSelectedFlashcard}
            setDeleteDialogOpen={setDeleteDialogOpen}
          />
        </Table>
      </div>

      {/* Delete confirm dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete confirmation"
        description={
          deleteMode === "bulk"
            ? `Are you sure you want to delete ${selectedIds.length} selected flashcards?`
            : `Are you sure you want to delete "${selectedFlashcard?.vocabulary}"?`
        }
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />
    </div>
  );
}

export default FlashcardTable;
