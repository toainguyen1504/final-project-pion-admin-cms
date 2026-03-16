import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";

import SortableHeaderCell from "@/components/shared/table/SortableHeaderCell";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";

import { deleteUser, bulkDeleteUsers } from "@/lib/api/users";

import TableToolbar from "@/components/shared/table/TableToolbar";
import UserTableBody from "@/components/users/UserTableBody";

function UserTable({
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
  refreshUsers,
}) {
  const totalPages = meta?.last_page || 1;

  const [selectedIds, setSelectedIds] = useState([]);
  const [typingValue, setTypingValue] = useState(search);

  // default columns
  const defaultColumns = {
    profile_image: true,
    display_name: true,
    username: false,
    email: true,
    gender: false,
    phone: true,
    role: true,
    createdAt: true,
  };

  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [tempColumns, setTempColumns] = useState(defaultColumns);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("bulk");
  const [selectedUser, setSelectedUser] = useState(null);
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
        await bulkDeleteUsers(selectedIds);
        toast.success(`${selectedIds.length} users deleted successfully!`);
        setSelectedIds([]);
      } else if (deleteMode === "single") {
        if (!selectedUser) return;
        await deleteUser(selectedUser.id);
        toast.success(
          `User "${selectedUser.display_name}" deleted successfully!`
        );
        setSelectedIds((prev) => prev.filter((id) => id !== selectedUser.id));
        setSelectedUser(null);
      }
      if (typeof refreshUsers === "function") {
        await refreshUsers();
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
                className="px-4 py-3 border-b border-slate-300 dark:border-slate-700"
                colSpan={toolbarColSpan}
              >
                <TableToolbar
                  searchValue={typingValue}
                  onSearchChange={setTypingValue}
                  searchPlaceholder="Tìm kiếm người dùng..."
                  searchLoading={searchLoading}
                  selectedCount={selectedIds.length}
                  visibleColumns={visibleColumns}
                  tempColumns={tempColumns}
                  onTempColumnToggle={handleTempColumnToggle}
                  defaultColumns={defaultColumns}
                  columnsConfig={[
                    { key: "profile_image", label: "Ảnh" },
                    { key: "display_name", label: "Tên hiển thị" },
                    { key: "username", label: "Tên đăng nhập" },
                    { key: "email", label: "Email" },
                    { key: "gender", label: "Giới tính" },
                    { key: "phone", label: "Số điện thoại" },
                    { key: "role", label: "Vai trò" },
                    { key: "createdAt", label: "Ngày tạo" },
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

              {visibleColumns.profile_image && (
                <TableCell className="px-4 py-3 font-semibold">Ảnh</TableCell>
              )}

              {visibleColumns.display_name && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="Tên hiển thị"
                    sortKey="display_name"
                    currentSort={sort}
                    order={order}
                    setSort={setSort}
                    setOrder={setOrder}
                  />
                </TableCell>
              )}

              {visibleColumns.username && (
                <TableCell className="px-4 py-3 font-semibold">
                  Tên đăng nhập
                </TableCell>
              )}

              {visibleColumns.email && (
                <TableCell className="px-4 py-3 font-semibold">Email</TableCell>
              )}

              {visibleColumns.gender && (
                <TableCell className="px-4 py-3 font-semibold">Giới tính</TableCell>
              )}

              {visibleColumns.phone && (
                <TableCell className="px-4 py-3 font-semibold">Số điện thoại</TableCell>
              )}

              {visibleColumns.role && (
                <TableCell className="px-4 py-3 font-semibold">
                  Vai trò
                </TableCell>
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

              <TableCell className="px-4 py-3 font-semibold"></TableCell>
            </TableRow>
          </TableHeader>
          <UserTableBody
            data={data}
            visibleColumns={visibleColumns}
            selectedIds={selectedIds}
            handleSelectRow={handleSelectRow}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            search={search}
            setDeleteMode={setDeleteMode}
            setSelectedUser={setSelectedUser}
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
            ? `Bạn có chắc muốn xoá ${selectedIds.length} người dùng đã chọn?`
            : `Bạn có chắc muốn xoá "${selectedUser?.display_name}"?`
        }
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />
    </div>
  );
}

export default UserTable;
