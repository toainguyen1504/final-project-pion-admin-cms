import { useRef, useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X, Check, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function SeoChecklist({ data = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!data.length) {
    return (
      <div className="p-4 text-sm text-muted-foreground text-center">
        Please enter a keyword and provide at least one field (e.g. title or
        content) to generate SEO checklist.
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-card text-card-foreground overflow-hidden">
      {data.map((section, index) => (
        <div key={index}>
          <ChecklistSection
            section={section}
            isOpen={openIndex === index}
            onToggle={() =>
              setOpenIndex((prev) => (prev === index ? -1 : index))
            }
          />
          {index < data.length - 1 && <Separator className="border-border" />}
        </div>
      ))}
    </div>
  );
}

// get status section
function getSectionStatus(items = []) {
  const errorCount = items.filter((i) => i.level === "error").length;
  const warningCount = items.filter((i) => i.level === "warning").length;

  if (errorCount > 0) return { status: "error", count: errorCount };
  if (warningCount > 0) return { status: "warning", count: warningCount };
  return { status: "success", count: 0 };
}

function ChecklistSection({ section, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  const { status, count } = getSectionStatus(section.items || []);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  const badgeText =
    status === "error"
      ? `${count} issue${count > 1 ? "s" : ""}`
      : status === "warning"
      ? `${count} warning${count > 1 ? "s" : ""}`
      : "All good";

  const badgeVariant =
    status === "error"
      ? "destructive"
      : status === "warning"
      ? "secondary"
      : "default";

  return (
    <div className="">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium hover:bg-muted 
          transition cursor-pointer"
      >
        <span>{section.title}</span>
        <div className="flex items-center gap-2">
          <Badge
            variant={badgeVariant}
            className={`text-xs ${
              status === "success"
                ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300"
                : status === "warning"
                ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                : status === "error"
                ? "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200"
                : ""
            }`}
          >
            {badgeText}
          </Badge>

          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <div
        ref={contentRef}
        style={{ height }}
        className="overflow-hidden transition-all duration-300 ease-in-out px-4"
      >
        <ul className="py-2 space-y-2 text-sm text-muted-foreground">
          {section.items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              {item.level === "error" && <X className="w-4 h-4 text-red-500" />}
              {item.level === "warning" && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
              {item.level === "success" && (
                <Check className="w-4 h-4 text-green-500" />
              )}
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { SeoChecklist };
