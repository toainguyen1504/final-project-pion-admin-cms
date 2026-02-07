import React from "react";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell, 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/shared/table/TablePagination";

export default function FlashcardTable({
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
  refreshFlashcards,
  onEditFlashcard,
  onDeleteFlashcard,
}) {
  const [selectedIds, setSelectedIds] = React.useState([]);

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((f) => f.id));
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-4">
            <Checkbox
              checked={selectedIds.length === data.length && data.length > 0}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
          <TableHead>Front</TableHead>
          <TableHead>Back</TableHead>
          <TableHead>Phonetic</TableHead>
          <TableHead>Translation</TableHead>
          <TableHead>Example Sentence</TableHead>
          <TableHead>Example Translation</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!Array.isArray(data) || data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={10} className="text-center py-6 text-slate-500">
              Không có flashcard nào
            </TableCell>
          </TableRow>
        ) : (
          data.map((flashcard) => (
            <TableRow key={flashcard.id}>
              <TableCell className="w-4">
                <Checkbox
                  checked={selectedIds.includes(flashcard.id)}
                  onCheckedChange={() => handleSelectRow(flashcard.id)}
                />
              </TableCell>
              <TableCell className="font-medium text-slate-800 dark:text-slate-200">
                {flashcard.front_text}
              </TableCell>
              <TableCell className="text-slate-600 dark:text-slate-400">
                {flashcard.back_text}
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">
                {flashcard.phonetic || "—"}
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">
                {flashcard.translation || "—"}
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">
                {flashcard.example_sentence || "—"}
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">
                {flashcard.example_translation || "—"}
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">
                {flashcard.level}
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">
                {flashcard.order}
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">
                {flashcard.created_at
                  ? format(new Date(flashcard.created_at), "dd/MM/yyyy HH:mm")
                  : "—"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => onEditFlashcard?.(flashcard)}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-indigo-600 hover:bg-indigo-100"
                  >
                    <Pencil className="w-4 h-4" />
                    Sửa
                  </Button>
                  <Button
                    onClick={() => onDeleteFlashcard?.(flashcard)}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
        {/* Pagination row */}
        <TableRow>
          <TableCell colSpan={10} className="border-t px-4 py-3">
            <div className="flex justify-end">
              <TablePagination
                page={page}
                totalPages={meta?.last_page || 1}
                onPageChange={setPage}
              />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
