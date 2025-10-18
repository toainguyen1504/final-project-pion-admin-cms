import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

function ScheduledPanel({ isVisible, publishDate, setPublishDate }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");
  const [open, setOpen] = useState(false);

  // get time
  const [time, setTime] = useState(() => {
    const h = publishDate.getHours().toString().padStart(2, "0");
    const m = publishDate.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  });

  // Handle select date
  const handleSelectDate = (date) => {
    if (!date) return;
    const [h, m] = time.split(":").map(Number);
    date.setHours(h);
    date.setMinutes(m);
    setPublishDate(date);
  };

  // Handle change time
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);
    const [h, m] = newTime.split(":").map(Number);
    const newDate = new Date(publishDate);
    newDate.setHours(h);
    newDate.setMinutes(m);
    setPublishDate(newDate);
  };

  // Animation when open panel
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
      {isVisible && (
        <div className="pt-4 flex items-center px-1 space-x-1 whitespace-nowrap">
          <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />

          {/* Popover date + time */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <span className="inline-block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer transition-all duration-300
                  hover:text-indigo-700 hover:dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950"
                >
                  {format(publishDate, "PPP HH:mm")}
                </Button>
              </span>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-3 space-y-3" align="end">
              <Calendar
                mode="single"
                selected={publishDate}
                onSelect={handleSelectDate}
                initialFocus
              />
              <div className="flex items-center group">
                <Input
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className="custom-time-input w-[140px] h-9 text-sm rounded-md border border-input bg-background px-2
                  transition-colors focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-1
                  focus-visible:outline-none group-hover:border-indigo-400"
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}

export { ScheduledPanel };
