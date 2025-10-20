import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function FocusKeywordInput() {
  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const MAX_KEYWORDS = 10;
  const MAX_LENGTH = 60;

  const handleAddKeyword = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const value = inputValue.trim().toLowerCase();
    if (!value) return;

    setError(""); // reset error

    // Length validation
    if (value.length > MAX_LENGTH) {
      return setError(`Keyword cannot exceed ${MAX_LENGTH} characters.`);
    }

    // Keyword limit validation
    if (keywords.length >= MAX_KEYWORDS) {
      return setError(`Maximum ${MAX_KEYWORDS} keywords allowed.`);
    }

    // Validation rules
    // eslint-disable-next-line no-useless-escape
    const isValid = /^[a-zA-Z0-9À-ỹ\s\-]+$/.test(value);
    const notTooShort = value.length >= 6;
    const minTwoWords = value.trim().split(/\s+/).length >= 2;
    const notAllNumbers = !/^\d+$/.test(value);
    const notSpamRepeat = !/^([a-zA-ZÀ-ỹ0-9])\1{2,}$/.test(value);

    if (
      !isValid ||
      !notTooShort ||
      !minTwoWords ||
      !notAllNumbers ||
      !notSpamRepeat
    ) {
      return setError(
        "Invalid keyword! Please enter at least 2 meaningful words."
      );
    }

    // Prevent duplicate
    if (!keywords.includes(value)) {
      setKeywords([...keywords, value]);
      setInputValue("");
    }
  };

  // Remove a keyword when clicking X
  const handleRemove = (keyword) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Label htmlFor="focus-keyword" className="text-base ml-2">
          Focus Keyword
        </Label>
        <Badge
          variant="destructive"
          className="px-1.5 py-1 rounded-full select-none"
        >
          30
        </Badge>
      </div>

      {/* Input field */}
      <div className="space-y-2">
        <Input
          id="focus-keyword"
          placeholder="Enter keyword and press Enter..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddKeyword}
          className="py-6 px-6 !text-base border border-slate-300 dark:border-slate-600 
                     focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 
                     caret-blue-600 rounded-xl"
        />

        {/* Keyword list */}
        <div className="flex flex-wrap gap-2">
          {keywords.map((kw, i) => (
            <div
              key={kw}
              className={`px-3 pt-1 pb-1.5 rounded-full text-sm flex items-center gap-1 cursor-default pointer-events-none
              ${
                i === 0
                  ? "bg-yellow-400 text-white font-semibold"
                  : "bg-yellow-100 text-gray-700 dark:bg-yellow-200"
              }`}
            >
              <span className="pointer-events-none">{kw}</span>
              <button
                type="button"
                onClick={() => handleRemove(kw)}
                className="ml-1 pt-0.5 pointer-events-auto text-gray-500 hover:text-red-500
                    cursor-pointer duration-300 transition-colors"
                title="Remove keyword"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
