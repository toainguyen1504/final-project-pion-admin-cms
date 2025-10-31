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
import TableToolbar from "@/components/shared/table/TableToolbar";
import PostTableBody from "@/components/posts/components/PostTableBody";

// api
import { fetchMedia } from "@/lib/api/media";
import { deletePost, bulkDeletePosts } from "@/lib/api/posts";

function PostTable({
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
  refreshPosts,
}) {
  const totalPages = meta?.last_page || 1;

  const [selectedIds, setSelectedIds] = useState([]);
  const [typingValue, setTypingValue] = useState(search);

  // Default visible columns
  const defaultColumns = {
    thumbnail: true,
    title: true,
    slug: false,
    category: false,
    status: false,
    visibility: true,
    seo_title: false,
    seo_description: false,
    seo_keywords: false,
    publish_at: true,
    updated_at: false,
  };

  const [visibleColumns, setVisibleColumns] = useState(defaultColumns);
  const [tempColumns, setTempColumns] = useState(defaultColumns);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState("bulk");
  const [selectedPost, setSelectedPost] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const isTempInitializedRef = useRef(false);
  const allSelected = data.length > 0 && selectedIds.length === data.length;

  // media
  const [mediaList, setMediaList] = useState([]);
  useEffect(() => {
    const loadMedia = async () => {
      const media = await fetchMedia();
      setMediaList(media);
    };
    loadMedia();
  }, []);

  // Tạo map: id => url
  const mediaMap = {};
  mediaList.forEach((m) => {
    mediaMap[m.id] = m.url; // hoặc m.src tuỳ API trả về
  });

  // Toggle select all
  const handleSelectAll = (checked) => {
    if (checked) setSelectedIds(data.map((item) => item.id));
    else setSelectedIds([]);
  };

  // Toggle single row
  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Delete logic
  const handleConfirmDelete = async () => {
    setLoadingDelete(true);
    try {
      if (deleteMode === "bulk") {
        if (selectedIds.length === 0) return;
        await bulkDeletePosts(selectedIds);
        toast.success(`${selectedIds.length} posts deleted successfully!`);
        setSelectedIds([]);
      } else if (deleteMode === "single") {
        if (!selectedPost) return;
        await deletePost(selectedPost.id);
        toast.success(`Post "${selectedPost.title}" deleted successfully!`);
        setSelectedIds((prev) => prev.filter((id) => id !== selectedPost.id));
        setSelectedPost(null);
      }

      if (typeof refreshPosts === "function") {
        await refreshPosts();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Delete failed!");
    } finally {
      setLoadingDelete(false);
      setDeleteDialogOpen(false);
    }
  };

  // Columns apply/reset
  const handleApplyColumns = () => {
    setVisibleColumns({ ...tempColumns });
    setPopoverOpen(false);
    isTempInitializedRef.current = false;
  };
  const handleResetColumns = () => {
    setTempColumns({ ...defaultColumns });
  };
  const handleTempColumnToggle = (key) => {
    setTempColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toolbarColSpan =
    Object.values(visibleColumns).filter(Boolean).length + 2;

  // Debounce search
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
                className="px-4 py-3 border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300"
                colSpan={toolbarColSpan}
              >
                <TableToolbar
                  searchValue={typingValue}
                  onSearchChange={setTypingValue}
                  searchPlaceholder="Search posts by title or seo title..."
                  searchLoading={searchLoading}
                  selectedCount={selectedIds.length}
                  visibleColumns={visibleColumns}
                  tempColumns={tempColumns}
                  onTempColumnToggle={handleTempColumnToggle}
                  defaultColumns={defaultColumns}
                  columnsConfig={[
                    { key: "thumbnail", label: "Thumbnail" },
                    { key: "title", label: "Title" },
                    { key: "slug", label: "Slug" },
                    { key: "category", label: "Category" },
                    { key: "status", label: "Status" },
                    { key: "visibility", label: "Visibility" },
                    { key: "seo_title", label: "SEO Title" },
                    { key: "seo_description", label: "SEO Description" },
                    { key: "seo_keywords", label: "SEO Keywords" },
                    { key: "publish_at", label: "Publish At" },
                    { key: "updated_at", label: "Last Modified" },
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
            <TableRow className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300">
              <TableCell className="px-4 py-3 font-semibold">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => handleSelectAll(checked)}
                    className="cursor-pointer"
                  />
                </div>
              </TableCell>

              {visibleColumns.thumbnail && (
                <TableCell className="px-4 py-3 font-semibold">
                  Thumbnail
                </TableCell>
              )}

              {visibleColumns.title && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="Title"
                    sortKey="title"
                    currentSort={sort}
                    order={order}
                    setSort={setSort}
                    setOrder={setOrder}
                  />
                </TableCell>
              )}

              {visibleColumns.slug && (
                <TableCell className="px-4 py-3 font-semibold">
                  Slug
                </TableCell>
              )}

              {visibleColumns.category && (
                <TableCell className="px-4 py-3 font-semibold">
                  Category
                </TableCell>
              )}

              {visibleColumns.status && (
                <TableCell className="px-4 py-3 font-semibold">
                  Status
                </TableCell>
              )}

              {visibleColumns.visibility && (
                <TableCell className="px-4 py-3 font-semibold">
                  Visibility
                </TableCell>
              )}

              {visibleColumns.seo_title && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="SEO Title"
                    sortKey="seo_title"
                    currentSort={sort}
                    order={order}
                    setSort={setSort}
                    setOrder={setOrder}
                  />
                </TableCell>
              )}

              {visibleColumns.seo_description && (
                <TableCell className="px-4 py-3 font-semibold">
                  SEO Description
                </TableCell>
              )}

              {visibleColumns.seo_keywords && (
                <TableCell className="px-4 py-3 font-semibold">
                  SEO Keywords
                </TableCell>
              )}

              {visibleColumns.publish_at && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="Publish At"
                    sortKey="publish_at"
                    currentSort={sort}
                    order={order}
                    setSort={setSort}
                    setOrder={setOrder}
                  />
                </TableCell>
              )}

              {visibleColumns.updated_at && (
                <TableCell className="px-4 py-3 font-semibold">
                  <SortableHeaderCell
                    label="Last Modified"
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

          <PostTableBody
            data={data}
            mediaMap={mediaMap}
            visibleColumns={visibleColumns}
            selectedIds={selectedIds}
            handleSelectRow={handleSelectRow}
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            search={search}
            setDeleteMode={setDeleteMode}
            setSelectedPost={setSelectedPost}
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
            ? `Are you sure you want to delete ${selectedIds.length} selected posts?`
            : `Are you sure you want to delete "${selectedPost?.title}"?`
        }
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />
    </div>
  );
}

export default PostTable;
