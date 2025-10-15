import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  FolderKanban,
} from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";

import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import { Spinner } from "@/components/ui/spinner";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";

import SortableHeaderCell from "@/components/shared/SortableHeaderCell";

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
  loading,
}) {
  const totalPages = meta?.last_page || 1;

  // search state
  const [typingValue, setTypingValue] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(typingValue);
    }, 600); // debounce 0.6s
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
                colSpan={6}
              >
                <div className="flex justify-end mr-2 rounded-xl">
                  <div className="relative w-full max-w-sm">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      {loading ? (
                        <Spinner className="w-4 h-4 animate-spin text-blue-500 absolute left-1 top-2.5" />
                      ) : (
                        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-1 top-2.5 pointer-events-none" />
                      )}
                    </span>
                    <Input
                      value={typingValue}
                      onChange={(e) => setTypingValue(e.target.value)}
                      placeholder="Search categories..."
                      className="pl-10 pr-4 pt-2 pb-2.5 border border-slate-300 dark:border-slate-600 focus-visible:ring-blue-600 
                      focus-visible:ring-1 focus-visible:ring-offset-0 caret-blue-600 rounded-xl"
                    />
                  </div>
                </div>
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
                    id={""}
                    aria-checked={false}
                    className="!border-slate-400 !text-blue-700 cursor-pointer
                      data-[state=checked]:!border-blue-600 data-[state=checked]:!bg-slate-100 
                      dark:data-[state=checked]:!border-blue-700 dark:data-[state=checked]:!bg-blue-700 dark:!text-slate-300"
                  />
                </div>
              </TableCell>

              <TableCell className="px-4 py-3 font-semibold">
                <SortableHeaderCell
                  label="Name"
                  sortKey="name"
                  currentSort={sort}
                  order={order}
                  setSort={setSort}
                  setOrder={setOrder}
                />
              </TableCell>

              <TableCell className="px-4 py-3 font-semibold">Slug</TableCell>

              <TableCell className="px-4 py-3 font-semibold">
                Visibility
              </TableCell>

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

              <TableCell className="px-4 py-3 font-semibold"></TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!Array.isArray(data) || data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FolderKanban className="w-6 h-6" />
                      </EmptyMedia>
                      <EmptyTitle>No categories found</EmptyTitle>
                      <EmptyDescription>
                        You haven’t added any categories yet. Start by creating
                        one.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>{/* Button */}</EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              data.map((category) => (
                <TableRow
                  key={category.id}
                  className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700
                  transition-colors duration-300"
                >
                  {/* checkbox */}
                  <TableCell className="px-4 py-3 w-4">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        id={`select-${category.id}`}
                        aria-checked={false}
                        className="!border-slate-400 !text-blue-700 cursor-pointer
                      data-[state=checked]:!border-blue-600 data-[state=checked]:!bg-slate-100 
                      dark:data-[state=checked]:!border-blue-700 dark:data-[state=checked]:!bg-blue-700 dark:!text-slate-300"
                      />
                    </div>
                  </TableCell>

                  <TableCell className="min-w-3xs px-4 py-3 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                    {category.name}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {category.slug}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    {category.visible ? (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Visible</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Hidden</span>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {format(new Date(category.updated_at), "dd/MM/yyyy HH:mm")}
                  </TableCell>

                  {/* Action */}
                  <TableCell className="w-auto px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 !text-indigo-600 dark:!text-indigo-500 hover:!bg-indigo-100 dark:!hover:bg-indigo-100 
                      transition-colors cursor-pointer"
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
              ))
            )}

            {/* Pagination */}
            <TableRow>
              <TableCell
                colSpan={6}
                className="px-4 py-3 text-slate-700 dark:text-slate-300 select-none
                border-t border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <div className="flex justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={() => page > 1 && setPage(page - 1)}
                          className={clsx(
                            "hover:text-indigo-600",
                            page === 1 && "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                          <PaginationItem key={p}>
                            <PaginationLink
                              href="#"
                              onClick={() => setPage(p)}
                              className={clsx(
                                "hover:text-indigo-600",
                                page === p
                                  ? "text-indigo-600 font-semibold"
                                  : "text-slate-500 dark:text-slate-300"
                              )}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={() => page < totalPages && setPage(page + 1)}
                          className={clsx(
                            "hover:text-indigo-600",
                            page === totalPages &&
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

export default CategoryTable;
