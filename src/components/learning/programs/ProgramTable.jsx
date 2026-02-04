import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import SortableHeaderCell from "@/components/shared/table/SortableHeaderCell";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import TableToolbar from "@/components/shared/table/TableToolbar";

import { deleteProgram, bulkDeletePrograms } from "@/lib/api/programs";
import ProgramTableBody from "./ProgramTableBody";

function ProgramTable({
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
  refreshPrograms,
  onEditProgram,
}) {
  const totalPages = meta?.last_page || 1;

  const [selectedIds, setSelectedIds] = useState([]);
  const [typingValue, setTypingValue] = useState(search);

  const defaultColumns = {
    title: true,
    slug: false,
    description: false,
    status: true,
    user_id: true,
    created_at: true,
  };

  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [tempColumns, setTempColumns] = useState(defaultColumns);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("bulk");
  const [selectedProgram, setSelectedProgram] = useState(null);
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
        await bulkDeletePrograms(selectedIds);
        toast.success(`${selectedIds.length} chương trình đã xoá.`);
        setSelectedIds([]);
      } else if (deleteMode === "single") {
        await deleteProgram(selectedProgram.id);
        toast.success(`Đã xoá chương trình "${selectedProgram.title}".`);
        setSelectedIds((prev) =>
          prev.filter((id) => id !== selectedProgram.id),
        );
        setSelectedProgram(null);
      }
      await refreshPrograms();
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
          <TableHeader className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {/* Search Row */}
            <TableRow>
              <TableCell
                colSpan={toolbarColSpan}
                className="px-4 py-3 border-b"
              >
                <TableToolbar
                  searchValue={typingValue}
                  onSearchChange={setTypingValue}
                  searchPlaceholder="Tìm kiếm chương trình..."
                  searchLoading={searchLoading}
                  selectedCount={selectedIds.length}
                  visibleColumns={visibleColumns}
                  tempColumns={tempColumns}
                  onTempColumnToggle={handleTempColumnToggle}
                  defaultColumns={defaultColumns}
                  columnsConfig={[
                    { key: "title", label: "Tiêu đề" },
                    { key: "slug", label: "Slug" },
                    { key: "description", label: "Mô tả" },
                    { key: "status", label: "Trạng thái" },
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
                <TableCell className="px-4 py-3 font-semibold">Mô tả</TableCell>
              )}

              {visibleColumns.status && (
                <TableCell className="px-4 py-3 font-semibold">
                  Trạng thái
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

              <TableCell className="px-4 py-3 font-semibold"></TableCell>
            </TableRow>
          </TableHeader>

          <ProgramTableBody
            data={data}
            visibleColumns={visibleColumns}
            selectedIds={selectedIds}
            handleSelectRow={handleSelectRow}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            search={search}
            setDeleteMode={setDeleteMode}
            setSelectedProgram={setSelectedProgram}
            setDeleteDialogOpen={setDeleteDialogOpen}
            onEditProgram={onEditProgram}
          />
        </Table>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xoá"
        description={
          deleteMode === "bulk"
            ? `Bạn có chắc muốn xoá ${selectedIds.length} chương trình đã chọn?`
            : `Bạn có chắc muốn xoá "${selectedProgram?.title}"?`
        }
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />
    </div>
  );
}

export default ProgramTable;
