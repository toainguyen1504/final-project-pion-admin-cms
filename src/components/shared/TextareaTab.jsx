import { Textarea } from "@/components/ui/textarea";
import { forwardRef } from "react";

/**
 * Textarea hỗ trợ phím Tab để indent (không chuyển focus)
 */
const TextareaTab = forwardRef(
  ({ value = "", onChange, rows = 5, ...props }, ref) => {
    // đảm bảo luôn là string
    const safeValue = Array.isArray(value) ? value.join("\n") : String(value);
    const safeRows = Math.max(3, rows);

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();

        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // const tab = " ".repeat(tabSize);
        const tab = "\t";

        const newValue =
          safeValue.substring(0, start) + tab + safeValue.substring(end);

        onChange({
          target: { value: newValue },
        });

        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + tab.length;
        });
      }
    };

    return (
      <Textarea
        ref={ref}
        value={safeValue}
        rows={safeRows}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);

TextareaTab.displayName = "TextareaTab";

export default TextareaTab;
