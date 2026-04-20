import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function InfoRow({ label, value, valueClassName = "" }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 py-2">
      <div className="font-medium text-slate-700 dark:text-slate-300">
        {label}
      </div>
      <div className={valueClassName}>{value || "—"}</div>
    </div>
  );
}

export default function ResetPasswordResultDialog({
  open,
  onOpenChange,
  account,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Thông tin tài khoản
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1 pt-2">
          <InfoRow
            label="Username:"
            value={account?.username}
            valueClassName="font-semibold text-indigo-600 dark:text-indigo-400"
          />

          <InfoRow
            label="Password:"
            value={account?.plain_password}
            valueClassName="font-semibold text-indigo-600 dark:text-indigo-400"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
