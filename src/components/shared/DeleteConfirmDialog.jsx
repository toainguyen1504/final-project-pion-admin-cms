import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { isAdminUser } from "@/utils/auth";
import { Spinner } from "@/components/ui/spinner";

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = "Delete confirmation",
  description = "Are you sure you want to delete this item? This action cannot be undone!",
  onConfirm,
  loading = false,
}) {
  const isAdmin = isAdminUser();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600 dark:text-red-400">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end gap-2">
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!isAdmin || loading}
            className="bg-red-600 hover:bg-red-700 dark:text-red-100 cursor-pointer"
          >
            {loading && <Spinner className="w-4 h-4 mr-2 text-white" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
