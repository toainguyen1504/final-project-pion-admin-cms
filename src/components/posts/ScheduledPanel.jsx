import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

import { CalendarDays } from "lucide-react";

function ScheduledPanel({ isVisible, publishDate, setPublishDate }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isVisible ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isVisible]);

  return (
    <div
      ref={contentRef}
      style={{ height }}
      className="transition-all duration-300 ease-in-out overflow-hidden"
    >
      <div className="pt-4 flex items-center px-1 space-x-1 whitespace-nowrap">
        <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <Popover>
          <PopoverTrigger asChild>
            <span className="inline-block">
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer transition-all duration-300
                 hover:text-indigo-700 hover:dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950"
              >
                {format(publishDate, "PPPp")}
              </Button>
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={publishDate}
              onSelect={setPublishDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export { ScheduledPanel };
