import React, { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  FileWarning,
  FolderKanban,
} from "lucide-react";

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

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { truncateText, getImageThumbnailSrc } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import TablePagination from "@/components/shared/table/TablePagination";
// import DEFAULT_THUMB from "@/assets/images/toaicdev.png";

import classNames from "classnames/bind";
import styles from "@/components/posts/Posts.module.scss"; // dùng lại style của PostEdit

const cx = classNames.bind(styles);

export default function PostTableBody({
  data = [],
  visibleColumns = {},
  selectedIds = [],
  handleSelectRow = () => {},
  page = 1,
  totalPages = 1,
  setPage = () => {},
  search = "",
  setDeleteMode = () => {},
  setSelectedPost = () => {},
  setDeleteDialogOpen = () => {},
  mediaMap = {},
}) {
  const navigate = useNavigate();

  // lấy số lượng cột
  const getVisibleColSpan = () => {
    const visibleCount = Object.values(visibleColumns).filter(Boolean).length;
    return visibleCount + 2; // +1 checkbox +1 actions
  };

  // modal review
  const [showReview, setShowReview] = useState(false);
  const [reviewPost, setReviewPost] = useState(null);

  return (
    <TableBody>
      {/* Empty State */}
      {!Array.isArray(data) || data.length === 0 ? (
        <TableRow>
          <TableCell colSpan={getVisibleColSpan()} className="py-10">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderKanban className="w-6 h-6" />
                </EmptyMedia>
                <EmptyTitle>Không tìm thấy bài viết</EmptyTitle>
                <EmptyDescription>
                  {search && search.trim() !== ""
                    ? "Không có bài viết nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác."
                    : "Bạn chưa thêm bài viết nào. Hãy bắt đầu bằng cách tạo một bài viết mới."}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>{/* optional actions */}</EmptyContent>
            </Empty>
          </TableCell>
        </TableRow>
      ) : (
        data.map((post) => (
          <TableRow
            key={post.id}
            className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 !transition-colors !duration-300"
          >
            {/* Checkbox */}
            <TableCell className="px-4 py-3 w-4">
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={selectedIds.includes(post.id)}
                  onCheckedChange={() => handleSelectRow(post.id)}
                  className="cursor-pointer"
                />
              </div>
            </TableCell>

            {/* Thumbnail */}
            {visibleColumns.thumbnail && (
              <TableCell className="px-4 py-3 text-center">
                <img
                  src={getImageThumbnailSrc(mediaMap[post.featured_media_id])}
                  alt={post.title || "Thumbnail"}
                  className="w-16 h-12 object-cover rounded-md border border-slate-300 dark:border-slate-600"
                />
              </TableCell>
            )}

            {visibleColumns.title && (
              <TableCell className="min-w-3xs px-4 py-3 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      onClick={() => {
                        setReviewPost(post);
                        setShowReview(true);
                      }}
                      className="block max-w-[220px] truncate cursor-pointer text-indigo-600 hover:underline"
                      title="Nhấn để xem trước bài viết"
                    >
                      {truncateText(post.title, 60)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-xs break-words"
                  >
                    {post.title}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            )}

            {visibleColumns.slug && (
              <TableCell className="min-w-3xs px-4 py-3 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block max-w-[220px] truncate cursor-default">
                      {truncateText(post.slug, 60)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-xs break-words"
                  >
                    {post.slug}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            )}

            {/* Category */}
            {visibleColumns.category && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block max-w-[200px] truncate cursor-default">
                      {post.categories && post.categories.length > 0
                        ? truncateText(
                            post.categories
                              .map((c) => c?.name)
                              .filter(Boolean)
                              .join(", "),
                            60
                          )
                        : "—"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-xs break-words"
                  >
                    {post.categories && post.categories.length > 0
                      ? post.categories.map((c) => c.name).join(", ")
                      : "—"}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            )}

            {/* Status */}
            {visibleColumns.status && (
              <TableCell className="px-4 py-3">
                {post.status === "published" ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Đã xuất bản</span>
                  </div>
                ) : post.status === "pending" ? (
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">Chờ xuất bản</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <FileWarning className="w-4 h-4" />
                    <span className="text-xs font-medium">Nháp</span>
                  </div>
                )}
              </TableCell>
            )}

            {/* Visibility */}
            {visibleColumns.visibility && (
              <TableCell className="px-4 py-3">
                {post.visibility === "public" ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-medium">Công khai</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <EyeOff className="w-4 h-4" />
                    <span className="text-xs font-medium">Riêng tư</span>
                  </div>
                )}
              </TableCell>
            )}

            {/* SEO Title  */}
            {visibleColumns.seo_title && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block max-w-[200px] truncate cursor-default">
                      {truncateText(post.seo_title, 60) || "—"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-xs break-words"
                  >
                    {post.seo_title}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            )}

            {/* SEO Description  */}
            {visibleColumns.seo_description && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {post.seo_description || "—"}
              </TableCell>
            )}
            {/* SEO Keywords  */}

            {visibleColumns.seo_keywords && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block max-w-[180px] truncate cursor-default italic">
                      {truncateText(post.seo_keywords, 50) || "—"}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-xs break-words"
                  >
                    {post.seo_keywords}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            )}

            {/* Updated at */}
            {visibleColumns.updated_at && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {format(new Date(post.updated_at), "dd/MM/yyyy HH:mm") || "—"}
              </TableCell>
            )}

            {/* Publish at */}
            {visibleColumns.publish_at && (
              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {format(new Date(post.publish_at), "dd/MM/yyyy HH:mm") || "—"}
              </TableCell>
            )}

            {/* Actions */}
            <TableCell className="w-auto px-4 py-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate(`/bai-viet/${post.id}/chinh-sua`)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 !text-indigo-600 dark:!text-indigo-500 hover:!bg-indigo-100 dark:!hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <Pencil className="w-4 h-4" />
                  Sửa
                </Button>
                <Button
                  onClick={() => {
                    setDeleteMode("single");
                    setSelectedPost(post);
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
          className="px-4 py-3 text-slate-700 dark:text-slate-300 select-none
          border-t border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
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

      {showReview && reviewPost && (
        <Dialog open={showReview} onOpenChange={setShowReview}>
          <DialogContent className="min-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-4">
                Xem Trước Bài Viết
              </DialogTitle>
            </DialogHeader>

            <div
              className={cx("post-wrapper", "max-h-[85vh]", "overflow-y-auto")}
            >
              <div className={cx("post-content")}>
                <h1>{reviewPost.title || "Chưa có tiêu đề bài viết"}</h1>
                <div
                  className={cx("post-body")}
                  dangerouslySetInnerHTML={{
                    __html:
                      reviewPost.content?.content_html ||
                      "<p>Chưa có nội dung bài viết</p>",
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </TableBody>
  );
}
