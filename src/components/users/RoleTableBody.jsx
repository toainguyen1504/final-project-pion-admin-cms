import React from "react";
import { format } from "date-fns";
import { Pencil, Trash2, FolderKanban } from "lucide-react";

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
import { useNavigate } from "react-router-dom";

import TablePagination from "@/components/shared/table/TablePagination";

export default function RoleTableBody({
  data,
  visibleColumns,
  selectedIds,
  handleSelectRow,
  page,
  totalPages,
  setPage,
  search,
  setDeleteMode,
  setSelectedRole,
  setDeleteDialogOpen,
}) {
  const getVisibleColSpan = () => {
    const visibleCount = Object.values(visibleColumns).filter(Boolean).length;
    return visibleCount + 2; // +1 checkbox, +1 actions column
  };

  const navigate = useNavigate();

  return (
    <TableBody>
      {!Array.isArray(data) || data.length === 0 ? (
        <TableRow>
          <TableCell colSpan={getVisibleColSpan()} className="py-10">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderKanban className="w-6 h-6" />
                </EmptyMedia>
                <EmptyTitle>Không tìm thấy vai trò</EmptyTitle>
                <EmptyDescription>
                  {search && search.trim() !== ""
                    ? "Không có vai trò nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác."
                    : "Bạn chưa thêm vai trò nào. Hãy bắt đầu bằng cách tạo một vai trò mới."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>{/* optional buttons */}</EmptyContent>
            </Empty>
          </TableCell>
        </TableRow>
      ) : (
        data.map((role) => (
          <TableRow
            key={role.id}
            className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300"
          >
            {/* checkbox */}
            <TableCell className="px-4 py-3 w-4">
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={selectedIds.includes(role.id)}
                  onCheckedChange={() => handleSelectRow(role.id)}
                />
              </div>
            </TableCell>

            {visibleColumns.name && (
              <TableCell className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                {role.name}
              </TableCell>
            )}

            {visibleColumns.label && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {role.label || "—"}
              </TableCell>
            )}

            {visibleColumns.description && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {role.description || "—"}
              </TableCell>
            )}

            {visibleColumns.createdAt && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {role.createdAt
                  ? format(new Date(role.createdAt), "dd/MM/yyyy HH:mm")
                  : "—"}
              </TableCell>
            )}

            {visibleColumns.updatedAt && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {role.updatedAt
                  ? format(new Date(role.updatedAt), "dd/MM/yyyy HH:mm")
                  : "—"}
              </TableCell>
            )}

            {/* Actions */}
            <TableCell className="w-auto px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate(`/roles/${role.id}/edit`)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 !text-indigo-600 dark:!text-indigo-500 hover:!bg-indigo-100 dark:!hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  Chỉnh sửa
                </Button>

                <Button
                  onClick={() => {
                    setDeleteMode("single");
                    setSelectedRole(role);
                    setDeleteDialogOpen(true);
                  }}
                  variant="ghost"
                  size="sm"
                  className="!text-red-600 dark:!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-100 transition-colors duration-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))
      )}

      {/* Pagination */}
      <TableRow>
        <TableCell
          colSpan={getVisibleColSpan()}
          className="px-4 py-3 text-slate-700 dark:text-slate-300 select-none border-t border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
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
