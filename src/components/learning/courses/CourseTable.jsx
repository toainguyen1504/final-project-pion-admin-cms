import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import SortableHeaderCell from "@/components/shared/table/SortableHeaderCell";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import TableToolbar from "@/components/shared/table/TableToolbar";

import { deleteCourse, bulkDeleteCourses } from "@/lib/api/learning/courses";
import CourseTableBody from "./CourseTableBody";

function CourseTable({
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
  refreshCourses,
  onEditCourse,
}) {
  const totalPages = meta?.last_page || 1;

  const [selectedIds, setSelectedIds] = useState([]);
  const [typingValue, setTypingValue] = useState(search);

  const defaultColumns = {
    title: true,
    slug: false,
    description: true,
    benefits: false,
    language: false,
    price: true,
    discount_price: false,
    level: true,
    status: true,
    duration: false,
    participants: false,
    total_lessons: false,
    // is_free: true,
    program_id: false,
    category_id: false,
    user_id: false,
    created_at: true,
  };

  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [tempColumns, setTempColumns] = useState(defaultColumns);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("bulk");
  const [selectedCourse, setSelectedCourse] = useState(null);
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
        await bulkDeleteCourses(selectedIds);
        toast.success(`${selectedIds.length} khóa học đã xoá.`);
        setSelectedIds([]);
      } else if (deleteMode === "single") {
        await deleteCourse(selectedCourse.id);
        toast.success(`Đã xoá khóa học "${selectedCourse.title}".`);
        setSelectedIds((prev) => prev.filter((id) => id !== selectedCourse.id));
        setSelectedCourse(null);
      }
      await refreshCourses();
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
                  searchPlaceholder="Tìm kiếm khóa học..."
                  searchLoading={searchLoading}
                  selectedCount={selectedIds.length}
                  visibleColumns={visibleColumns}
                  tempColumns={tempColumns}
                  onTempColumnToggle={handleTempColumnToggle}
                  defaultColumns={defaultColumns}
                  columnsConfig={[
                    { key: "title", label: "Tiêu đề" },
                    { key: "slug", label: "Slug" },
                    { key: "description", label: "Description" },
                    { key: "benefits", label: "Benefits" },
                    { key: "language", label: "Ngôn ngữ" },
                    { key: "price", label: "Giá" },
                    { key: "discount_price", label: "Giá giảm" },
                    { key: "level", label: "Cấp độ" },
                    { key: "status", label: "Trạng thái" },
                    { key: "duration", label: "Thời lượng" },
                    { key: "participants", label: "Học viên" },
                    { key: "total_lessons", label: "Bài học" },
                    // { key: "is_free", label: "Miễn phí" },
                    { key: "program_id", label: "Chương trình" },
                    { key: "category_id", label: "Danh mục" },
                    { key: "user_id", label: "Người tạo" },
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

              {visibleColumns.description && (
                <TableCell className="px-4 py-3 font-semibold">
                  Description
                </TableCell>
              )}

              {visibleColumns.benefits && (
                <TableCell className="px-4 py-3 font-semibold">
                  Benefits
                </TableCell>
              )}

              {visibleColumns.language && (
                <TableCell className="px-4 py-3 font-semibold">
                  Ngôn ngữ
                </TableCell>
              )}

              {visibleColumns.price && (
                <TableCell className="px-4 py-3 font-semibold">Giá</TableCell>
              )}

              {visibleColumns.discount_price && (
                <TableCell className="px-4 py-3 font-semibold">
                  Giá giảm
                </TableCell>
              )}

              {visibleColumns.level && (
                <TableCell className="px-4 py-3 font-semibold">
                  Cấp độ
                </TableCell>
              )}

              {visibleColumns.status && (
                <TableCell className="px-4 py-3 font-semibold">
                  Trạng thái
                </TableCell>
              )}

              {visibleColumns.duration && (
                <TableCell className="px-4 py-3 font-semibold">
                  Thời lượng
                </TableCell>
              )}

              {visibleColumns.participants && (
                <TableCell className="px-4 py-3 font-semibold">
                  Học viên
                </TableCell>
              )}

              {visibleColumns.total_lessons && (
                <TableCell className="px-4 py-3 font-semibold">
                  Bài học
                </TableCell>
              )}

              {/* {visibleColumns.is_free && (
                <TableCell className="px-4 py-3 font-semibold">
                  Miễn phí
                </TableCell>
              )} */}

              {visibleColumns.program_id && (
                <TableCell className="px-4 py-3 font-semibold">
                  Chương trình
                </TableCell>
              )}

              {visibleColumns.category_id && (
                <TableCell className="px-4 py-3 font-semibold">
                  Danh mục
                </TableCell>
              )}

              {visibleColumns.user_id && (
                <TableCell className="px-4 py-3 font-semibold">
                  Người tạo
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

              {/* Actions column */}
              <TableCell className="px-4 py-3 font-semibold"></TableCell>
            </TableRow>
          </TableHeader>

          <CourseTableBody
            data={data}
            visibleColumns={visibleColumns}
            selectedIds={selectedIds}
            handleSelectRow={handleSelectRow}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            search={search}
            setDeleteMode={setDeleteMode}
            setSelectedCourse={setSelectedCourse}
            setDeleteDialogOpen={setDeleteDialogOpen}
            onEditCourse={onEditCourse}
          />
        </Table>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xoá"
        description={
          deleteMode === "bulk"
            ? `Bạn có chắc muốn xoá ${selectedIds.length} khóa học đã chọn?`
            : `Bạn có chắc muốn xoá "${selectedCourse?.title}"?`
        }
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />
    </div>
  );
}

export default CourseTable;
