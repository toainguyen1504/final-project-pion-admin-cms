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

function formatTime(date) {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

function getNextValidTime() {
  const next = new Date();
  next.setMinutes(next.getMinutes() + 1);
  next.setSeconds(0);
  next.setMilliseconds(0);
  return next;
}

function isSameDay(dateA, dateB) {
  return dateA.toDateString() === dateB.toDateString();
}

function ScheduledPanel({ isVisible, publishDate, setPublishDate }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(() => formatTime(publishDate));

  const now = new Date();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  maxDate.setHours(23, 59, 59, 999);

  const isSelectedToday = isSameDay(publishDate, now);
  const minTime = isSelectedToday ? formatTime(getNextValidTime()) : undefined;

  useEffect(() => {
    setTime(formatTime(publishDate));
  }, [publishDate]);

  const normalizeDateTime = (date, timeValue) => {
    const [h, m] = timeValue.split(":").map(Number);

    const result = new Date(date);
    result.setHours(h);
    result.setMinutes(m);
    result.setSeconds(0);
    result.setMilliseconds(0);

    const currentNow = new Date();

    if (result <= currentNow) {
      return getNextValidTime();
    }

    return result;
  };

  const handleSelectDate = (date) => {
    if (!date) return;

    const nextDate = normalizeDateTime(date, time);

    setTime(formatTime(nextDate));
    setPublishDate(nextDate);
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    const nextDate = normalizeDateTime(publishDate, newTime);

    setTime(formatTime(nextDate));
    setPublishDate(nextDate);
  };

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
                disabled={(date) => date < today || date > maxDate}
              />

              <div className="flex items-center group">
                <Input
                  type="time"
                  value={time}
                  min={minTime}
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
