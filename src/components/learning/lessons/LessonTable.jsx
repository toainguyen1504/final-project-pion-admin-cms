import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import SortableHeaderCell from "@/components/shared/table/SortableHeaderCell";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import TableToolbar from "@/components/shared/table/TableToolbar";

import { deleteLesson, bulkDeleteLessons } from "@/lib/api/learning/lessons";
import LessonTableBody from "./LessonTableBody";

function LessonTable({
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
  refreshLessons,
}) {
  const totalPages = meta?.last_page || 1;

  const [selectedIds, setSelectedIds] = useState([]);
  const [typingValue, setTypingValue] = useState(search);

  const defaultColumns = {
    title: true,
    slug: false,
    intro: false,
    duration: true,
    video_url: true,
    order: true,
    is_preview: true,
    is_quiz: true,
    created_at: true,
  };

  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [tempColumns, setTempColumns] = useState(defaultColumns);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("bulk");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const isTempInitializedRef = useRef(false);
  const allSelected = data.length > 0 && selectedIds.length === data.length;

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? data.map((item) => item.id) : []);
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
        await bulkDeleteLessons(selectedIds);
        toast.success(`${selectedIds.length} bài học đã xoá.`);
        setSelectedIds([]);
      } else if (deleteMode === "single") {
        await deleteLesson(selectedLesson.id);
        toast.success(`Đã xoá bài học "${selectedLesson.title}".`);
        setSelectedIds((prev) => prev.filter((id) => id !== selectedLesson.id));
        setSelectedLesson(null);
      }
      await refreshLessons();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Xoá thất bại!");
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
                  searchPlaceholder="Tìm kiếm bài học..."
                  searchLoading={searchLoading}
                  selectedCount={selectedIds.length}
                  visibleColumns={visibleColumns}
                  tempColumns={tempColumns}
                  onTempColumnToggle={handleTempColumnToggle}
                  defaultColumns={defaultColumns}
                  columnsConfig={[
                    { key: "title", label: "Tiêu đề" },
                    { key: "slug", label: "Slug" },
                    { key: "intro", label: "Giới thiệu" },
                    { key: "duration", label: "Thời lượng (phút)" },
                    { key: "video_url", label: "Video" },
                    { key: "order", label: "Thứ tự" },
                    { key: "is_preview", label: "Xem trước" },
                    { key: "is_quiz", label: "Bài kiểm tra" },
                    { key: "created_at", label: "Ngày tạo" },
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
                />
              </TableCell>
            </TableRow>

            {/* Label Row */}
            <TableRow>
              <TableCell className="px-4 py-3 font-semibold">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </div>
              </TableCell>

              {visibleColumns.title && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="Tiêu đề"
                    sortKey="title"
                    currentSort={sort}
                    order={order}
                    setSort={setSort}
                    setOrder={setOrder}
                  />
                </TableCell>
              )}

              {visibleColumns.slug && (
                <TableCell className="px-4 py-3 font-semibold">Slug</TableCell>
              )}

              {visibleColumns.intro && (
                <TableCell className="px-4 py-3 font-semibold">
                  Giới thiệu
                </TableCell>
              )}

              {visibleColumns.duration && (
                <TableCell className="px-4 py-3 font-semibold">
                  Thời lượng
                </TableCell>
              )}

              {visibleColumns.video_url && (
                <TableCell className="px-4 py-3 font-semibold">Video</TableCell>
              )}

              {visibleColumns.order && (
                <TableCell className="px-4 py-3 font-semibold">
                  Thứ tự
                </TableCell>
              )}

              {visibleColumns.is_preview && (
                <TableCell className="px-4 py-3 font-semibold">
                  Xem trước
                </TableCell>
              )}

              {visibleColumns.is_quiz && (
                <TableCell className="px-4 py-3 font-semibold">
                  Bài kiểm tra
                </TableCell>
              )}

              {visibleColumns.created_at && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="Ngày tạo"
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

          <LessonTableBody
            data={data}
            visibleColumns={visibleColumns}
            selectedIds={selectedIds}
            handleSelectRow={handleSelectRow}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            search={search}
            setDeleteMode={setDeleteMode}
            setSelectedLesson={setSelectedLesson}
            setDeleteDialogOpen={setDeleteDialogOpen}
          />
        </Table>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xoá"
        description={
          deleteMode === "bulk"
            ? `Bạn có chắc muốn xoá ${selectedIds.length} bài học đã chọn?`
            : `Bạn có chắc muốn xoá "${selectedLesson?.title}"?`
        }
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />
    </div>
  );
}

export default LessonTable;
