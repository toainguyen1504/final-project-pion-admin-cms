import { useCallback } from "react";

// ===== Helper functions =====
function getTitleScore(title) {
  if (!title) return 0;
  const length = title.trim().length;
  if (length < 30) return 2;
  if (length < 50) return 5;
  if (length <= 60) return 8;
  return 4; // quá dài
}

function getDescriptionScore(description) {
  if (!description) return 0;
  const length = description.trim().length;
  if (length < 70) return 1;
  if (length < 120) return 3;
  if (length <= 160) return 4;
  return 1; // quá dài
}

function getSlugScore(slug) {
  if (!slug) return 0;
  const length = slug.trim().length;
  if (length < 10) return 0;
  if (length < 30) return 2;
  if (length <= 60) return 1;
  return 0; // quá dài
}

// ===== Logic =====
function normalizeText(str) {
  return str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim();
}

function checkKeywordInTitle(title, keyword) {
  const hasKeyword = normalizeText(title)?.includes(normalizeText(keyword));
  const lengthScore = getTitleScore(title);
  return { score: (hasKeyword ? 2 : 0) + lengthScore, hasKeyword };
}

function checkKeywordInDescription(description, keyword) {
  if (!description || !keyword) return { score: 0, hasKeyword: false };
  const desc = normalizeText(description);
  const key = normalizeText(keyword);

  const keywordParts = key.split(/\s+/);
  const matchedWords = keywordParts.filter((word) => desc.includes(word));
  const keywordScore =
    matchedWords.length === keywordParts.length
      ? 1
      : matchedWords.length / keywordParts.length >= 0.5
      ? 0.5
      : 0;

  const lengthScore = getDescriptionScore(description);
  return { score: keywordScore + lengthScore, hasKeyword: keywordScore > 0 };
}

function checkKeywordInSlug(slug, keyword) {
  const hasKeyword = normalizeText(slug)?.includes(
    normalizeText(keyword?.replace(/\s+/g, "-"))
  );
  const lengthScore = getSlugScore(slug);
  return { score: (hasKeyword ? 3 : 0) + lengthScore, hasKeyword };
}

function checkKeywordInFirst10Percent(content, keyword) {
  if (!content || !keyword) return { score: 0, hasKeyword: false };
  const normalizedContent = normalizeText(content);
  const normalizedKeyword = normalizeText(keyword);
  const firstCharsCount = Math.max(
    1,
    Math.floor(normalizedContent.length * 0.1)
  );
  const firstPart = normalizedContent.slice(0, firstCharsCount);
  const hasKeyword = firstPart.includes(normalizedKeyword);
  return { score: hasKeyword ? 5 : 0, hasKeyword };
}

function checkContentLength(content) {
  const wordCount = content?.trim().split(/\s+/).length || 0;
  return { score: wordCount >= 600 && wordCount <= 2500 ? 5 : 0, wordCount };
}

// ===== Custom Hook =====
export default function useSeoBasicScore() {
  const calculateBasicScore = useCallback(
    ({ title, description, slug, content, keyword }) => {
      const titleCheck = checkKeywordInTitle(title, keyword);
      const descCheck = checkKeywordInDescription(description, keyword);
      const slugCheck = checkKeywordInSlug(slug, keyword);
      const first10Check = checkKeywordInFirst10Percent(content, keyword);
      const contentLengthCheck = checkContentLength(content);

      // 📊 Tổng điểm
      const totalScore =
        titleCheck.score +
        descCheck.score +
        slugCheck.score +
        first10Check.score +
        contentLengthCheck.score;

      // 🧾 Checklist tạo tự động
      const checklist = [
        {
          title: "Basic SEO",
          items: [
            {
              text: "Title is optimized",
              level:
                titleCheck.score >= 7
                  ? "success"
                  : titleCheck.score > 4
                  ? "warning"
                  : "error",
            },
            {
              text: "Meta description is optimized",
              level:
                descCheck.score >= 3
                  ? "success"
                  : descCheck.score > 0
                  ? "warning"
                  : "error",
            },
            {
              text: "Slug is optimized",
              level:
                slugCheck.score >= 3
                  ? "success"
                  : slugCheck.score > 0
                  ? "warning"
                  : "error",
            },
            {
              text: first10Check.hasKeyword
                ? "Keyword appears in the first 10% of content"
                : "Keyword missing in the first 10% of content",
              level: first10Check.hasKeyword ? "success" : "warning",
            },
            {
              text:
                contentLengthCheck.wordCount < 600
                  ? `Content too short (${contentLengthCheck.wordCount} words)`
                  : contentLengthCheck.wordCount > 2500
                  ? `Content too long (${contentLengthCheck.wordCount} words)`
                  : `Content length is good (${contentLengthCheck.wordCount} words)`,
              level:
                contentLengthCheck.wordCount < 600
                  ? "error"
                  : contentLengthCheck.wordCount > 2500
                  ? "warning"
                  : "success",
            },
          ],
        },
      ];

      // 🔍 Debug log (tuỳ chọn)
      // console.groupCollapsed(
      //   "%c📈 SEO Basic Analysis",
      //   "color:#16a34a;font-weight:bold"
      // );
      // console.log("Total Score:", totalScore);
      // console.log("Details:", {
      //   titleCheck,
      //   descCheck,
      //   slugCheck,
      //   first10Check,
      //   contentLengthCheck,
      // });
      // console.groupEnd();

      return {
        totalScore,
        checklist,
        details: {
          titleCheck,
          descCheck,
          slugCheck,
          first10Check,
          contentLengthCheck,
        },
      };
    },
    []
  );

  return { calculateBasicScore };
}
