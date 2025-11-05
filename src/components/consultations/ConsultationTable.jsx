import { format } from "date-fns";
import { CheckCircle2, XCircle, Clock, User2, Mail, Phone } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ConsultationTable({ data }) {
  return (
    <div className="border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm overflow-x-auto">
      <Table className="w-full text-sm">
        <TableHeader className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <TableRow>
            <TableCell className="px-4 py-3 font-semibold">#</TableCell>
            <TableCell className="px-4 py-3 font-semibold">Request</TableCell>
            <TableCell className="px-4 py-3 font-semibold">
              Guest Info
            </TableCell>
            <TableCell className="px-4 py-3 font-semibold">Status</TableCell>
            <TableCell className="px-4 py-3 font-semibold">
              Requested At
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {(!Array.isArray(data) || data.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="py-10">
                <Empty>
                  <EmptyTitle>No consultations found</EmptyTitle>
                  <EmptyDescription>
                    There are no consultation requests yet.
                  </EmptyDescription>
                </Empty>
              </TableCell>
            </TableRow>
          )}

          {data.map((item, index) => (
            <TableRow
              key={item.id}
              className="border-b border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300"
            >
              <TableCell className="px-4 py-3">{index + 1}</TableCell>

              {/* Tooltip cho request_content */}
              <TableCell className="px-4 py-3 max-w-sm text-slate-700 dark:text-slate-200 align-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="line-clamp-3 break-words whitespace-normal cursor-help">
                        {item.request_content}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="max-w-sm text-slate-100 bg-slate-900 dark:bg-slate-800"
                    >
                      {item.request_content}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>

              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400">
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1">
                    <User2 className="w-4 h-4" /> {item.guest_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" /> {item.guest_email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" /> {item.guest_phone}
                  </span>
                </div>
              </TableCell>

              <TableCell className="px-4 py-3">
                {item.status === "approved" ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium">Approved</span>
                  </div>
                ) : item.status === "rejected" ? (
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <XCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Rejected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">Pending</span>
                  </div>
                )}
              </TableCell>

              <TableCell className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {format(new Date(item.created_at), "dd/MM/yyyy HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
