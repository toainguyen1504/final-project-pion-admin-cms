import { useState } from "react";
import { Pencil, Trash2, CheckCircle2, XCircle, Search } from "lucide-react";
import clsx from "clsx";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

function CategoryTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

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
                      <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-1 top-2.5 pointer-events-none" />
                    </span>
                    <Input
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
              <TableCell className="px-4 py-3 font-semibold">Name</TableCell>
              <TableCell className="px-4 py-3 font-semibold">Slug</TableCell>
              <TableCell className="px-4 py-3 font-semibold">
                Visibility
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold">
                Last Modified
              </TableCell>
              <TableCell className="px-4 py-3 font-semibold"></TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.isArray(data) &&
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
                    {category.updatedAt}
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
              ))}

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
                      {/* Previous */}
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

                      {/* Pagination Item */}
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

                      {/* Next */}
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

export default CategoryTable;
