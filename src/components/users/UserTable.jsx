import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import SortableHeaderCell from "@/components/shared/table/SortableHeaderCell";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import TableToolbar from "@/components/shared/table/TableToolbar";
import UserTableBody from "@/components/users/UserTableBody";
import ResetPasswordResultDialog from "@/components/users/ResetPasswordResultDialog";

import {
  deleteUser,
  bulkDeleteUsers,
  resetUserPassword,
} from "@/lib/api/users";
import { ROLES } from "@/constants/roles";

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
  currentUser,
}) {
  const totalPages = meta?.last_page || 1;

  const [selectedIds, setSelectedIds] = useState([]);
  const [typingValue, setTypingValue] = useState(search);

  const defaultColumns = {
    profile_image: true,
    display_name: true,
    username: true,
    email: true,
    gender: false,
    phone: false,
    role: true,
    createdAt: true,
  };

  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [tempColumns, setTempColumns] = useState(defaultColumns);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("bulk");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [resettingUserId, setResettingUserId] = useState(null);
  const [resetResultOpen, setResetResultOpen] = useState(false);
  const [resetResult, setResetResult] = useState(null);

  const isTempInitializedRef = useRef(false);

  const isProtectedUser = (user) => {
    const isCurrentUser = currentUser?.id === user.id;
    const isTargetSuperAdmin = user?.role?.name === ROLES.SUPER_ADMIN;
    const isCurrentUserSuperAdmin =
      currentUser?.role?.name === ROLES.SUPER_ADMIN;

    if (isCurrentUser) return true;
    if (isTargetSuperAdmin && !isCurrentUserSuperAdmin) return true;

    return false;
  };

  const selectableRows = useMemo(
    () => data.filter((item) => !isProtectedUser(item)),
    [data, currentUser],
  );

  const allSelected =
    selectableRows.length > 0 &&
    selectableRows.every((item) => selectedIds.includes(item.id));

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(selectableRows.map((item) => item.id));
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

        await bulkDeleteUsers(selectedIds);
        toast.success(`Đã xoá ${selectedIds.length} người dùng.`);
        setSelectedIds([]);
      } else if (deleteMode === "single") {
        if (!selectedUser) return;

        await deleteUser(selectedUser.id);
        toast.success(`Đã xoá người dùng "${selectedUser.display_name}".`);

        setSelectedIds((prev) => prev.filter((id) => id !== selectedUser.id));
        setSelectedUser(null);
      }

      if (typeof refreshUsers === "function") {
        await refreshUsers();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Xoá người dùng thất bại.");
    } finally {
      setLoadingDelete(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleResetPassword = async (user) => {
    try {
      setResettingUserId(user.id);

      const response = await resetUserPassword(user.id);
      console.log("reset password response:", response);

      const username =
        response?.username ||
        response?.data?.username ||
        user.username ||
        user.email ||
        "";

      const plainPassword =
        response?.plain_password ||
        response?.data?.plain_password ||
        response?.new_password ||
        response?.data?.new_password ||
        "";

      if (!plainPassword) {
        toast.error("API chưa trả về mật khẩu mới.");
        return;
      }

      setResetResult({
        username,
        plain_password: plainPassword,
      });

      setResetResultOpen(true);
      toast.success(`Đã reset mật khẩu cho "${user.display_name}".`);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Reset mật khẩu thất bại.");
    } finally {
      setResettingUserId(null);
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
      setSelectedIds([]);
    }, 600);

    return () => clearTimeout(timeout);
  }, [typingValue, search, setSearch]);

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => data.some((item) => item.id === id)),
    );
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-sm dark:border-slate-700">
        <Table className="w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableCell
                className="border-b border-slate-300 px-4 py-3 dark:border-slate-700"
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
                    { key: "username", label: "Username" },
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
                    if (selectedIds.length === 0) return;
                    setDeleteMode("bulk");
                    setDeleteDialogOpen(true);
                  }}
                />
              </TableCell>
            </TableRow>

            <TableRow className="border-b border-slate-300 dark:border-slate-700">
              <TableCell className="px-4 py-3 font-semibold">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => handleSelectAll(checked)}
                    disabled={selectableRows.length === 0}
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
                  Username
                </TableCell>
              )}
              {visibleColumns.email && (
                <TableCell className="px-4 py-3 font-semibold">Email</TableCell>
              )}
              {visibleColumns.gender && (
                <TableCell className="px-4 py-3 font-semibold">
                  Giới tính
                </TableCell>
              )}
              {visibleColumns.phone && (
                <TableCell className="px-4 py-3 font-semibold">
                  Số điện thoại
                </TableCell>
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

              <TableCell className="px-4 py-3 font-semibold" />
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
            currentUser={currentUser}
            onResetPassword={handleResetPassword}
            resettingUserId={resettingUserId}
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

      <ResetPasswordResultDialog
        open={resetResultOpen}
        onOpenChange={setResetResultOpen}
        account={resetResult}
      />
    </div>
  );
}

export default UserTable;
