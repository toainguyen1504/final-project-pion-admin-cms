import React from "react";
import clsx from "clsx";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function TablePagination({ page, totalPages, onPageChange }) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => page > 1 && onPageChange(page - 1)}
            className={clsx(
              "hover:text-indigo-600",
              page === 1 && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(p)}
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
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => page < totalPages && onPageChange(page + 1)}
            className={clsx(
              "hover:text-indigo-600",
              page === totalPages && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}