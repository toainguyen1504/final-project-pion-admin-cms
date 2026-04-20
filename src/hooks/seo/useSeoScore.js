import { useMemo } from "react";
import useSeoBasicScore from "./useSeoBasicScore";
import useSeoReadabilityScore from "./useSeoReadabilityScore";
import useSeoAdditionalScore from "./useSeoAdditionalScore";

// *** Một số điểm cần cải thiện ***
// - Content length nên >=300 → ok, >=1000 → tốt (vì một số bài viết chuyên sâu thì 4000 từ vẫn ổn)
// - Image >=3 là hơi chưa tốt, Blog ngắn vẫn ok với 1–2 hình
// - Media = optional, thực tế 90% bài viết không cần video
// -----> chỉ giống SEO scoring engine chuẩn SaaS (giống RankMath) 80%, cần optimize thêm
export default function useSeoScore() {
  const { calculateBasicScore } = useSeoBasicScore();
  const { calculateReadabilityScore } = useSeoReadabilityScore();
  const { calculateAdditionalScore } = useSeoAdditionalScore();

  const calculateSeoScore = useMemo(() => {
    return ({
      title,
      description,
      slug,
      content,
      rawHtml,
      keywords = [], // hỗ trợ nhiều keyword
      baseDomain,
    }) => {
      // Keyword chính (focus keyword)
      const mainKeyword = keywords[0] || "";
      const secondaryKeywords = keywords.slice(1);

      if (!mainKeyword) {
        return { totalScore: 0, checklist: [], details: {} };
      }

      // --- Tính điểm cho keyword chính ---
      const basic = calculateBasicScore({
        title,
        description,
        slug,
        content,
        keyword: mainKeyword,
      });

      const readability = calculateReadabilityScore({
        title,
        content,
        keyword: mainKeyword,
        rawHtml,
      });

      const additional = calculateAdditionalScore
        ? calculateAdditionalScore({
            content,
            rawHtml,
            keyword: mainKeyword,
            normalizedTitleInput: title,
            baseDomain,
          })
        : { totalScore: 0, checklist: [], details: {} };

      // --- Tổng điểm ban đầu ---
      let totalScore =
        basic.totalScore + readability.totalScore + additional.totalScore;

      // --- Phần tính điểm keyword phụ ---
      let bonusScore = 0;
      const secondaryResults = secondaryKeywords.map((kw) => {
        const foundInContent = content
          ? content.toLowerCase().includes(kw.toLowerCase())
          : false;
        const foundInTitle = title
          ? title.toLowerCase().includes(kw.toLowerCase())
          : false;
        const foundInSlug = slug
          ? slug.toLowerCase().includes(kw.toLowerCase())
          : false;

        const foundAnywhere = foundInContent || foundInTitle || foundInSlug;
        const bonus = foundAnywhere ? 2 : 0; // mỗi keyword phụ có thể +2 điểm

        bonusScore += bonus;

        return {
          keyword: kw,
          foundInContent,
          foundInTitle,
          foundInSlug,
          bonus,
        };
      });

      // --- Giới hạn điểm tối đa ---
      totalScore = Math.min(totalScore + bonusScore, 100);

      // --- Gộp checklist (giữ nguyên format của bạn) ---
      const mergedChecklist = [
        ...basic.checklist,
        ...additional.checklist,
        ...readability.checklist,
        // thêm checklist cho keyword phụ
        ...secondaryResults.map((r) => ({
          level: r.bonus > 0 ? "success" : "error",
          text: `Keyword "${r.keyword}" ${
            r.bonus > 0 ? "found" : "not found"
          } in title/content/slug.`,
        })),
      ];

      // --- Debug ---
      // console.groupCollapsed(
      //   "%c💥 SEO Overall Analysis",
      //   "color:#9333ea;font-weight:bold"
      // );
      // console.log("🧩 Basic Score:", basic.totalScore, basic.details);
      // console.log(
      //   "📖 Readability Score:",
      //   readability.totalScore,
      //   readability.details
      // );
      // console.log(
      //   "⚙️ Additional Score:",
      //   additional.totalScore,
      //   additional.details
      // );
      // console.log("💫 Secondary Keyword Bonus:", bonusScore, secondaryResults);
      // console.log("🔥 Total SEO Score:", totalScore);
      // console.groupEnd();

      return {
        totalScore,
        checklist: mergedChecklist, // giữ nguyên format checklist
        details: {
          basic: basic.details,
          readability: readability.details,
          additional: additional.details,
          secondaryResults,
        },
      };
    };
  }, [
    calculateBasicScore,
    calculateReadabilityScore,
    calculateAdditionalScore,
  ]);

  return { calculateSeoScore };
}
