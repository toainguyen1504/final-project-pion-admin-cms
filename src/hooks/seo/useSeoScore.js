import { useCallback } from "react";
import useSeoBasicScore from "./useSeoBasicScore";
import useSeoAdditionalScore from "./useSeoAdditionalScore";
import useSeoReadabilityScore from "./useSeoReadabilityScore";

export default function useSeoScore() {
  const { calculateBasicScore } = useSeoBasicScore();
  const { calculateAdditionalScore } = useSeoAdditionalScore();
  const { calculateReadabilityScore } = useSeoReadabilityScore();

  // Tính điểm cho secondary keywords
  const calculateSecondaryKeywordScore = useCallback(
    ({ title, seoDescription, slug, content, keywords }) => {
      let score = 0;
      keywords.forEach((keyword) => {
        const lower = keyword.toLowerCase();
        if (title.toLowerCase().includes(lower)) score += 1;
        if (seoDescription.toLowerCase().includes(lower)) score += 1;
        if (slug.toLowerCase().includes(lower)) score += 1;
        if (content.toLowerCase().includes(lower)) score += 2;
      });
      return Math.min(score, 5);
    },
    []
  );

  // -->>> Hàm tính tổng điểm SEO
  const calculateSeoScore = useCallback(
    ({
      title,
      seoTitle,
      seoDescription,
      slug,
      content,
      rawHtml,
      keywords,
      baseDomain,
    }) => {
      if (!keywords?.length) return 0;

      const focusKeyword = keywords[0];
      const secondaryKeywords = keywords.slice(1);

      // Basic (30 điểm) - dùng SEO title
      const { totalScore: basicScore } = calculateBasicScore({
        title: seoTitle, // SEO snippet title
        description: seoDescription,
        slug,
        content,
        keyword: focusKeyword,
      });

      // Additional (35 điểm) - dùng SEO title
      const additionalScore = calculateAdditionalScore({
        content,
        rawHtml,
        keyword: focusKeyword,
        normalizedTitleInput: seoTitle, // SEO snippet title
        baseDomain,
      }).additionalScore;

      // Readability (35 điểm) - dùng H1 title
      const readabilityScore = calculateReadabilityScore({
        title, // H1
        content,
        keyword: focusKeyword,
      });

      // Secondary keyword bonus
      const secondaryScore = calculateSecondaryKeywordScore({
        title,
        seoDescription,
        slug,
        content,
        keywords: secondaryKeywords,
      });

      const totalScore =
        basicScore + additionalScore + readabilityScore + secondaryScore;

      console.log(
        "🧾 [useSeoBasicScore] Received description:",
        seoDescription
      );

      return Math.round(totalScore);
    },
    [
      calculateBasicScore,
      calculateAdditionalScore,
      calculateReadabilityScore,
      calculateSecondaryKeywordScore,
    ]
  );

  return { calculateSeoScore };
}
