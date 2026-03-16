import { useEffect, useState, useRef } from "react";

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

import { deleteCategory, bulkDeleteCategories } from "@/lib/api/categories";

import TableToolbar from "@/components/shared/table/TableToolbar";
import CategoryTableBody from "@/components/categories/CategoryTableBody";

function CategoryTable({
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
  refreshCategories,
}) {
  const totalPages = meta?.last_page || 1;

  const [selectedIds, setSelectedIds] = useState([]);

  // search state
  const [typingValue, setTypingValue] = useState(search);

  // default setting columns
  const defaultColumns = {
    name: true,
    slug: false,
    type: true,
    featured: true,
    updated_at: true,
  };

  // Columns state
  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [tempColumns, setTempColumns] = useState(defaultColumns);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Dialog delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("bulk"); // "bulk" or "single"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // control init tempColumns
  const isTempInitializedRef = useRef(false);

  // check all selected
  const allSelected = data.length > 0 && selectedIds.length === data.length;

  // toggle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(data.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Tick single delete
  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Handle delete categories
  const handleConfirmDelete = async () => {
    setLoadingDelete(true);

    try {
      if (deleteMode === "bulk") {
        if (selectedIds.length === 0) return;

        await bulkDeleteCategories(selectedIds);
        toast.success(`${selectedIds.length} categories deleted successfully!`);
        setSelectedIds([]);
      } else if (deleteMode === "single") {
        if (!selectedCategory) return;

        await deleteCategory(selectedCategory.id);
        toast.success(
          `Category "${selectedCategory.name}" deleted successfully!`,
        );

        // FIX: remove from selectedIds to hidden delete selected button
        setSelectedIds((prev) =>
          prev.filter((id) => id !== selectedCategory.id),
        );

        setSelectedCategory(null);
      }

      // --- REFRESH TABLE ---
      if (typeof refreshCategories === "function") {
        await refreshCategories();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Delete failed!");
    } finally {
      setLoadingDelete(false);
      setDeleteDialogOpen(false);
    }
  };

  // Handle Apply
  const handleApplyColumns = () => {
    setVisibleColumns({ ...tempColumns });
    setPopoverOpen(false);
    isTempInitializedRef.current = false;
  };

  // Handle Reset
  const handleResetColumns = () => {
    setTempColumns({ ...defaultColumns });
  };

  // Handle tick checkbox in columns setting
  const handleTempColumnToggle = (key) => {
    setTempColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Toolbar ColSpan
  const toolbarColSpan =
    Object.values(visibleColumns).filter(Boolean).length + 2;

  useEffect(() => {
    if (typingValue === search) return;
    setSearchLoading(true);

    const timeout = setTimeout(() => {
      setSearch(typingValue);
      setSearchLoading(false);
    }, 600); // debounce 0.6s
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
                className="px-4 py-3 border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300"
                colSpan={toolbarColSpan}
              >
                <TableToolbar
                  searchValue={typingValue}
                  onSearchChange={setTypingValue}
                  searchPlaceholder="Tìm kiếm danh mục..."
                  searchLoading={searchLoading}
                  selectedCount={selectedIds.length}
                  visibleColumns={visibleColumns}
                  tempColumns={tempColumns}
                  onTempColumnToggle={handleTempColumnToggle}
                  defaultColumns={defaultColumns}
                  columnsConfig={[
                    { key: "name", label: "Tên Danh Mục" },
                    { key: "slug", label: "Slug" },
                    { key: "type", label: "Loại Danh Mục" },
                    { key: "featured", label: "Nổi Bật" },
                    { key: "updated_at", label: "Chỉnh Sửa Lần Cuối" },
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
            <TableRow
              className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50
             dark:hover:bg-slate-700 transition-colors duration-300"
            >
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
                    label="Tên Danh Mục"
                    sortKey="name"
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

              {visibleColumns.type && (
                <TableCell className="px-4 py-3 font-semibold">
                  Loại Danh Mục
                </TableCell>
              )}

              {visibleColumns.featured && (
                <TableCell className="px-4 py-3 font-semibold">
                  Nổi Bật
                </TableCell>
              )}

              {visibleColumns.updated_at && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="Chỉnh Sửa Lần Cuối"
                    sortKey="updated_at"
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
          <CategoryTableBody
            data={data}
            visibleColumns={visibleColumns}
            selectedIds={selectedIds}
            handleSelectRow={handleSelectRow}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            search={search}
            setDeleteMode={setDeleteMode}
            setSelectedCategory={setSelectedCategory}
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
            ? `Are you sure you want to delete ${selectedIds.length} selected categories?`
            : `Are you sure you want to delete "${selectedCategory?.name}"?`
        }
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />
    </div>
  );
}

export default CategoryTable;
