import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import SortableHeaderCell from "@/components/shared/table/SortableHeaderCell";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";

import { deleteRole, bulkDeleteRoles } from "@/lib/api/roles";

import TableToolbar from "@/components/shared/table/TableToolbar";
import RoleTableBody from "@/components/users/RoleTableBody";

function RoleTable({
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
  refreshRoles,
}) {
  const totalPages = meta?.last_page || 1;

  const [selectedIds, setSelectedIds] = useState([]);
  const [typingValue, setTypingValue] = useState(search);

  // default columns
  const defaultColumns = {
    name: true,
    label: true,
    description: true,
    createdAt: true,
    updatedAt: true,
  };

  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [tempColumns, setTempColumns] = useState(defaultColumns);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("bulk");
  const [selectedRole, setSelectedRole] = useState(null);
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
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      if (deleteMode === "bulk") {
        if (selectedIds.length === 0) return;
        await bulkDeleteRoles(selectedIds);
        toast.success(`${selectedIds.length} roles deleted successfully!`);
        setSelectedIds([]);
      } else if (deleteMode === "single") {
        if (!selectedRole) return;
        await deleteRole(selectedRole.id);
        toast.success(`Role "${selectedRole.name}" deleted successfully!`);
        setSelectedIds((prev) => prev.filter((id) => id !== selectedRole.id));
        setSelectedRole(null);
      }
      if (typeof refreshRoles === "function") {
        await refreshRoles();
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
          <TableHeader className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {/* Search Row */}
            <TableRow>
              <TableCell
                className="px-4 py-3 border-b border-slate-300 dark:border-slate-700"
                colSpan={toolbarColSpan}
              >
                <TableToolbar
                  searchValue={typingValue}
                  onSearchChange={setTypingValue}
                  searchPlaceholder="Tìm kiếm vai trò..."
                  searchLoading={searchLoading}
                  selectedCount={selectedIds.length}
                  visibleColumns={visibleColumns}
                  tempColumns={tempColumns}
                  onTempColumnToggle={handleTempColumnToggle}
                  defaultColumns={defaultColumns}
                  columnsConfig={[
                    { key: "name", label: "Tên Role (key)" },
                    { key: "label", label: "Tên hiển thị" },
                    { key: "description", label: "Mô tả (Role Permissions)" },
                    { key: "createdAt", label: "Ngày tạo" },
                    { key: "updatedAt", label: "Ngày cập nhật" },
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
            <TableRow className="border-b border-slate-300 dark:border-slate-700">
              <TableCell className="px-4 py-3 font-semibold">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => handleSelectAll(checked)}
                  />
                </div>
              </TableCell>

              {visibleColumns.name && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="Tên Role"
                    sortKey="name"
                    currentSort={sort}
                    order={order}
                    setSort={setSort}
                    setOrder={setOrder}
                  />
                </TableCell>
              )}

              {visibleColumns.label && (
                <TableCell className="px-4 py-3 font-semibold">
                  Tên hiển thị
                </TableCell>
              )}

              {visibleColumns.description && (
                <TableCell className="px-4 py-3 font-semibold">Mô tả (Role Permissions)</TableCell>
              )}

              {visibleColumns.createdAt && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="Ngày tạo"
                    sortKey="createdAt"
                    currentSort={sort}
                    order={order}
                    setSort={setSort}
                    setOrder={setOrder}
                  />
                </TableCell>
              )}

              {visibleColumns.updatedAt && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="Ngày cập nhật"
                    sortKey="updatedAt"
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
          <RoleTableBody
            data={data}
            visibleColumns={visibleColumns}
            selectedIds={selectedIds}
            handleSelectRow={handleSelectRow}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            search={search}
            setDeleteMode={setDeleteMode}
            setSelectedRole={setSelectedRole}
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
            ? `Bạn có chắc muốn xoá ${selectedIds.length} vai trò đã chọn?`
            : `Bạn có chắc muốn xoá "${selectedRole?.name}"?`
        }
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />
    </div>
  );
}

export default RoleTable;
