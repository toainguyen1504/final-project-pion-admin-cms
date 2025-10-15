import { ArrowDown, ArrowUp } from "lucide-react";
import clsx from "clsx";

function SortableHeaderCell({
  label,
  sortKey,
  currentSort,
  order,
  setSort,
  setOrder,
}) {
  const isActive = currentSort === sortKey;
  const icon = isActive && order === "asc" ? <ArrowUp /> : <ArrowDown />;

  return (
    <div
      className="flex items-center justify-start gap-1 cursor-pointer select-none"
      onClick={() => {
        if (isActive) {
          setOrder(order === "asc" ? "desc" : "asc");
        } else {
          setSort(sortKey);
          setOrder("desc"); // default when switching column
        }
      }}
    >
      <span>{label}</span>
      <span
        className={clsx("w-4 h-4 flex items-center", {
          "text-indigo-600 dark:text-indigo-400": isActive,
          "text-slate-400 dark:text-slate-500": !isActive,
        })}
      >
        {icon}
      </span>
    </div>
  );
}

export default SortableHeaderCell;