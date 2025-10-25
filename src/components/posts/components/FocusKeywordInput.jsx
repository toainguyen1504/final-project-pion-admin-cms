import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

import { useSeoScore } from "@/hooks";

export function FocusKeywordInput({
  title,
  content,
  rawHtml,
  seoTitle,
  seoSlug,
  seoDescription,
  onKeywordChange, // send to seoManager
}) {
  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [seoScore, setSeoScore] = useState(0);

  const { calculateSeoScore } = useSeoScore();

  const MAX_KEYWORDS = 10;
  const MAX_LENGTH = 60;

  const handleAddKeyword = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const value = inputValue.trim().toLowerCase();
    if (!value) return;

    setError(""); // reset error

    // Validation
    if (value.length > MAX_LENGTH)
      return setError(`Keyword cannot exceed ${MAX_LENGTH} characters.`);
    if (keywords.length >= MAX_KEYWORDS)
      return setError(`Maximum ${MAX_KEYWORDS} keywords allowed.`);

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

    if (keywords.some((k) => k === value))
      return setError("Keyword already exists.");

    setKeywords([...keywords, value]);
    setInputValue("");
  };

  const handleRemove = (keyword) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const mainKeyword = keywords[0] || "";

  // Auto calculate SEO score
  useEffect(() => {
    if (!title || !content || !mainKeyword) return; // tránh tính khi data chưa sẵn sàng

    const score = calculateSeoScore({
      title,
      description: seoDescription,
      slug: seoSlug,
      content,
      rawHtml,
      keywords,
      baseDomain: "example.com",
    });

    // chỉ set state khi điểm thực sự khác với state hiện tại
    setSeoScore((prev) => {
      if (prev?.totalScore === score.totalScore) return prev;
      return score;
    });

    if (onKeywordChange) {
      onKeywordChange(mainKeyword);
    }
  }, [
    mainKeyword, // chỉ theo keyword chính
    title,
    seoTitle,
    seoSlug,
    seoDescription,
    content,
    rawHtml,
    calculateSeoScore,
  ]);

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
          {seoScore?.totalScore ?? 0}
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
              className={`px-3 pt-1 pb-1.5 rounded-full text-sm flex items-center gap-1 cursor-default
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
                className="ml-1 pt-0.5 text-gray-500 hover:text-red-500 cursor-pointer duration-300 transition-colors"
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
