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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, CheckCircle2, XCircle, Search } from "lucide-react";

function CategoryTable({ data }) {
  return (
    <div className="space-y-4">
      <div className="border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {/* Search Row */}
            <TableRow>
              <TableCell
                className="px-4 py-3 border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
            <TableRow className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <TableCell className="px-4 py-3 font-semibold">
                <div className="flex items-center justify-center">
                  <Checkbox
                    id={""}
                    aria-checked={false}
                    className=" border-slate-400 text-blue-700
                      data-[state=checked]:border-blue-600 data-[state=checked]:bg-slate-100 
                      dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700 dark:text-slate-300"
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
            {data.map((category) => (
              <TableRow
                key={category.id}
                className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {/* checkbox */}
                <TableCell className="px-4 py-3 w-4">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      id={`select-${category.id}`}
                      aria-checked={false}
                      className=" border-slate-400 text-blue-700
                      data-[state=checked]:border-blue-600 data-[state=checked]:bg-slate-100 
                      dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700 dark:text-slate-300"
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
                      className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 
                      transition-colors cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors 
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
                className="px-4 py-3 border-t border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <div className="flex justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
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
