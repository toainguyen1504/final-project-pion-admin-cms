import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function FilterSelect({
  options = [],
  value,
  onChange,
  placeholder,
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-48 rounded-xl border border-slate-300 dark:border-slate-600">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
