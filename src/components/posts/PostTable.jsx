import { useState } from "react";
import clsx from "clsx";
import {
  Pencil,
  Trash2,
  Search,
  Columns3Cog,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  FileWarning,
} from "lucide-react";

import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

function PostTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  return (
    <div className="space-y-4">
      <div className="border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {/* Search */}
            <TableRow>
              <TableCell colSpan={11} className="px-4 py-3 border-b">
                <div className="flex justify-end mr-2 rounded-xl">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      placeholder="Search posts..."
                      className="pl-10 pr-4 pt-2 pb-2.5 border border-slate-300 dark:border-slate-600 focus-visible:ring-blue-600 
                      focus-visible:ring-1 focus-visible:ring-offset-0 caret-blue-600 rounded-xl"
                    />
                  </div>

                  {/* Column Settings Icon */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="p-1 rounded text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 
                         dark:text-slate-300 cursor-pointer ml-3"
                      >
                        <Columns3Cog className="w-6 h-6" />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent
                      side="bottom"
                      align="end"
                      sideOffset={8}
                      className="absolute z-50 w-64 p-4 space-y-3 bg-white dark:bg-slate-900 border 
                      border-slate-200 dark:border-slate-700 rounded-xl shadow-xl translate-x-[-100%]"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                          Columns
                        </span>
                        <button className="text-red-500 dark:text-red-400 font-medium text-xs hover:underline cursor-pointer outline-0">
                          Reset
                        </button>
                      </div>

                      {/* Checkbox list */}
                      {[
                        "Image",
                        "Title",
                        "Slug",
                        "Author",
                        "Status",
                        "Category",
                        "Publishing date",
                      ].map((label, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Checkbox
                            id={`col-${label}`}
                            defaultChecked={[
                              "Image",
                              "Title",
                              "Author",
                            ].includes(label)}
                          />
                          <label
                            htmlFor={`col-${label}`}
                            className="text-sm text-slate-700 dark:text-slate-300"
                          >
                            {label}
                          </label>
                        </div>
                      ))}

                      <Button
                        className="w-full mt-2 bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 
                              transition-colors duration-300 min-w-36 cursor-pointer rounded-xl"
                      >
                        Apply columns
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </TableCell>
            </TableRow>

            {/* Labels */}
            <TableRow
              className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50
             dark:hover:bg-slate-700 transition-colors duration-300"
            >
              {/* Checkbox */}
              <TableCell className="px-4 py-3 font-semibold">
                <div className="flex items-center justify-center">
                  <Checkbox
                    id={""}
                    aria-checked={false}
                    className="!border-slate-400 !text-blue-700 cursor-pointer
                      data-[state=checked]:!border-blue-600 data-[state=checked]:!bg-slate-100 
                      dark:data-[state=checked]:!border-blue-700 dark:data-[state=checked]:!bg-blue-700 dark:!text-slate-300"
                  />
                </div>
              </TableCell>

              <TableCell className="px-4 py-3 font-semibold">Title</TableCell>
              <TableCell className="px-4 py-3 font-semibold">Sapo</TableCell>
              <TableCell className="px-4 py-3 font-semibold">
                Category
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold">Status</TableCell>
              <TableCell className="px-4 py-3 font-semibold">
                Visibility
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold">
                SEO Title
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold">
                SEO Description
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold">
                SEO Keywords
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold">
                Last Modified
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold"></TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((post) => (
              <TableRow
                key={post.id}
                className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-300"
              >
                {/* checkbox */}
                <TableCell className="px-4 py-3 w-4">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      id={`select-${post.id}`}
                      aria-checked={false}
                      className="!border-slate-400 !text-blue-700 cursor-pointer
                      data-[state=checked]:!border-blue-600 data-[state=checked]:!bg-slate-100 
                      dark:data-[state=checked]:!border-blue-700 dark:data-[state=checked]:!bg-blue-700 dark:!text-slate-300"
                    />
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                  {post.title}
                </TableCell>
                <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {post.sapo}
                </TableCell>
                <TableCell className="px-4 py-3">{post.category}</TableCell>

                {/* Status */}
                <TableCell className="px-4 py-3">
                  {post.status === "published" && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-medium">Published</span>
                    </div>
                  )}
                  {post.status === "pending" && (
                    <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">Pending</span>
                    </div>
                  )}
                  {post.status === "draft" && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <FileWarning className="w-4 h-4" />
                      <span className="text-xs font-medium">Draft</span>
                    </div>
                  )}
                </TableCell>

                {/* Visibility */}
                <TableCell className="px-4 py-3">
                  {post.visibility === "public" ? (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs font-medium">Public</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <EyeOff className="w-4 h-4" />
                      <span className="text-xs font-medium">Private</span>
                    </div>
                  )}
                </TableCell>

                <TableCell className="px-4 py-3">{post.seoTitle}</TableCell>
                <TableCell className="px-4 py-3">
                  {post.seoDescription}
                </TableCell>
                <TableCell className="px-4 py-3">{post.seoKeywords}</TableCell>
                <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {post.updatedAt}
                </TableCell>

                {/* Actions */}
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 !text-slate-800 dark:!text-slate-100 hover:!bg-slate-200 dark:hover:!bg-slate-700 
                      transition-colors duration-300 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 !text-indigo-600 dark:!text-indigo-500 hover:!bg-indigo-100 dark:hover:!bg-indigo-100 
                      transition-colors duration-300 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!text-red-600 dark:!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-100 transition-colors duration-300 
                      flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {/* Pagination */}
            <TableRow>
              <TableCell
                colSpan={11}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border-t"
              >
                <div className="flex justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() =>
                            currentPage > 1 && setCurrentPage(currentPage - 1)
                          }
                          className={clsx(
                            "hover:text-indigo-600",
                            currentPage === 1 &&
                              "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={() => setCurrentPage(page)}
                              className={clsx(
                                "hover:text-indigo-600",
                                currentPage === page
                                  ? "text-indigo-600 font-semibold"
                                  : "text-slate-500 dark:text-slate-300"
                              )}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={() =>
                            currentPage < totalPages &&
                            setCurrentPage(currentPage + 1)
                          }
                          className={clsx(
                            "hover:text-indigo-600",
                            currentPage === totalPages &&
                              "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default PostTable;
