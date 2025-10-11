import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        "bg-slate-300 data-[state=checked]:bg-indigo-600 dark:bg-slate-700 dark:data-[state=checked]:bg-indigo-500",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform",
          "translate-x-0 data-[state=checked]:translate-x-5"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
