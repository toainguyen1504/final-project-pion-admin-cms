import React from "react";
import { format } from "date-fns";
import { KeyRound, Trash2, FolderKanban } from "lucide-react";

import UserAvatar from "@/components/shared/UserAvatar";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";
import TablePagination from "@/components/shared/table/TablePagination";
import { ROLES } from "@/constants/roles";

export default function UserTableBody({
  data,
  visibleColumns,
  selectedIds,
  handleSelectRow,
  page,
  totalPages,
  setPage,
  search,
  setDeleteMode,
  setSelectedUser,
  setDeleteDialogOpen,
  currentUser,
  onResetPassword,
  resettingUserId,
}) {
  const getVisibleColSpan = () => {
    const visibleCount = Object.values(visibleColumns).filter(Boolean).length;
    return visibleCount + 2;
  };

  return (
    <TableBody>
      {!Array.isArray(data) || data.length === 0 ? (
        <TableRow>
          <TableCell colSpan={getVisibleColSpan()} className="py-10">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderKanban className="h-6 w-6" />
                </EmptyMedia>
                <EmptyTitle>Không tìm thấy người dùng</EmptyTitle>
                <EmptyDescription>
                  {search && search.trim() !== ""
                    ? "Không có người dùng nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác."
                    : "Bạn chưa thêm người dùng nào. Hãy bắt đầu bằng cách tạo một người dùng mới."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent />
            </Empty>
          </TableCell>
        </TableRow>
      ) : (
        data.map((user) => {
          const isCurrentUser = currentUser?.id === user.id;
          const isTargetSuperAdmin = user?.role?.name === ROLES.SUPER_ADMIN;
          const isCurrentUserSuperAdmin =
            currentUser?.role?.name === ROLES.SUPER_ADMIN;

          const isProtected =
            isCurrentUser || (isTargetSuperAdmin && !isCurrentUserSuperAdmin);

          const protectReason = isCurrentUser
            ? "Tài khoản hiện tại"
            : isTargetSuperAdmin && !isCurrentUserSuperAdmin
              ? "Tài khoản hệ thống"
              : "";

          const isResetting = resettingUserId === user.id;

          const rowClassName = isProtected
            ? "border-b border-slate-300 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30"
            : "border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300";

          return (
            <TableRow key={user.id} className={rowClassName}>
              <TableCell className="w-4 px-4 py-3">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={selectedIds.includes(user.id)}
                    disabled={isProtected}
                    onCheckedChange={() => {
                      if (isProtected) return;
                      handleSelectRow(user.id);
                    }}
                  />
                </div>
              </TableCell>

              {visibleColumns.profile_image && (
                <TableCell className="px-4 py-3">
                  <UserAvatar
                    src={user.profile_image}
                    alt={user.display_name}
                  />
                </TableCell>
              )}

              {visibleColumns.display_name && (
                <TableCell className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <span>{user.display_name || "—"}</span>

                    {isProtected && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {protectReason}
                      </span>
                    )}
                  </div>
                </TableCell>
              )}

              {visibleColumns.username && (
                <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {user.username || "—"}
                </TableCell>
              )}

              {visibleColumns.email && (
                <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {user.email || "—"}
                </TableCell>
              )}

              {visibleColumns.gender && (
                <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {user.gender || "—"}
                </TableCell>
              )}

              {visibleColumns.phone && (
                <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {user.phone || "—"}
                </TableCell>
              )}

              {visibleColumns.role && (
                <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {user.role?.name || "—"}
                </TableCell>
              )}

              {visibleColumns.createdAt && (
                <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {user.createdAt
                    ? format(new Date(user.createdAt), "dd/MM/yyyy HH:mm")
                    : "—"}
                </TableCell>
              )}

              <TableCell className="w-auto whitespace-nowrap px-4 py-3">
                <div className="flex items-center gap-2">
                  {!isProtected && (
                    <>
                      <Button
                        onClick={() => onResetPassword?.(user)}
                        variant="ghost"
                        size="sm"
                        disabled={isResetting}
                        className="flex cursor-pointer items-center gap-1 !text-amber-600 transition-colors hover:!bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60 dark:!text-amber-500 dark:hover:!bg-amber-100"
                      >
                        <KeyRound className="h-4 w-4" />
                        {isResetting ? "Đang reset..." : "Reset"}
                      </Button>

                      <Button
                        onClick={() => {
                          setDeleteMode("single");
                          setSelectedUser(user);
                          setDeleteDialogOpen(true);
                        }}
                        variant="ghost"
                        size="sm"
                        className="flex cursor-pointer items-center gap-1 !text-red-600 transition-colors duration-300 hover:!bg-red-50 dark:!text-red-500 dark:hover:!bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })
      )}

      <TableRow>
        <TableCell
          colSpan={getVisibleColSpan()}
          className="select-none border-t border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <div className="flex justify-end">
            <TablePagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
