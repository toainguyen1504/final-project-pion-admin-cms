export default function useSeoReadabilityScore() {
  // Keyword near the beginning of the title (position 0–4)
  function checkKeywordNearTitleStart(title, keyword) {
    const titleWords = title.toLowerCase().trim().split(/\s+/);
    const keywordWords = keyword.toLowerCase().trim().split(/\s+/);

    let found = false;
    for (let i = 0; i <= 4; i++) {
      const segment = titleWords.slice(i, i + keywordWords.length).join(" ");
      if (segment === keywordWords.join(" ")) {
        found = true;
        break;
      }
    }

    const scoreTitleStart = found ? 5 : 0;
    const messageTitleStart = found
      ? "Từ khóa nằm gần đầu tiêu đề."
      : "Từ khóa chưa nằm gần đầu tiêu đề.";

    return { scoreTitleStart, messageTitleStart };
  }

  // Title has number (year, ranking, etc.)
  function checkTitleHasNumber(title) {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 2;
    const maxYear = currentYear + 1;

    const yearRegex = /\b(20\d{2})\b/g;
    const topRegex = /\btop\s*\d+\b/i;
    const numberRegex = /\b\d{1,3}\b/;

    let found = false;
    const yearMatches = [...title.matchAll(yearRegex)];
    const validYear = yearMatches.some((match) => {
      const year = parseInt(match[1]);
      return year >= minYear && year <= maxYear;
    });

    const hasTop = topRegex.test(title);
    const hasGeneralNumber = numberRegex.test(title);

    found = validYear || hasTop || hasGeneralNumber;

    const scoreTitleNumber = found ? 5 : 0;
    const messageTitleNumber = found
      ? "Tiêu đề có chứa số hợp lệ (năm, xếp hạng hoặc số lượng)."
      : "Tiêu đề chưa có số hợp lệ hoặc năm không phù hợp.";

    return { scoreTitleNumber, messageTitleNumber };
  }

  // Title length (≤ 70 chars, ideally 40–70)
  function checkTitlePostLength(title) {
    const length = title.trim().length;
    let score = 0;
    let message = "";
    let status = "fail";

    if (length >= 40 && length <= 70) {
      score = 5;
      message = `Tiêu đề bài viết tối ưu (${length}/70 ký tự).`;
      status = "good";
    } else if (length >= 20 && length < 40) {
      score = 3;
      message = `Tiêu đề hơi ngắn (${length}/70 ký tự) – nên mở rộng thêm.`;
      status = "ok";
    } else if (length < 20) {
      score = 0;
      message = `Tiêu đề quá ngắn (${length}/70 ký tự) – chưa đủ rõ ràng.`;
      status = "fail";
    } else {
      score = 0;
      message = `Tiêu đề quá dài (${length}/70 ký tự) – cần rút gọn.`;
      status = "fail";
    }

    return { score, message, status };
  }

  // Paragraph clarity
  function checkParagraphLength(normalizedContent) {
    const paragraphs = normalizedContent
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p);

    if (paragraphs.length === 0) {
      return {
        score: 0,
        message: "Không tìm thấy đoạn văn nào để đánh giá.",
        status: "fail",
      };
    }

    let score = 0;
    let hasEmptyParagraph = false;
    let hasExtremeParagraph = false;

    paragraphs.forEach((p) => {
      const wordCount = p.split(/\s+/).filter((w) => w.length > 0).length;
      const charCount = p.length;

      if (wordCount <= 2 || charCount <= 10) {
        hasEmptyParagraph = true;
        return;
      }

      if (wordCount < 20 || wordCount > 250) {
        hasExtremeParagraph = true;
        return;
      }

      if (wordCount >= 30 && wordCount <= 180 && charCount <= 900) {
        score += 1;
      }
    });

    const finalScore = Math.max(0, Math.min(score, 5));
    let message = "Các đoạn văn đều ngắn gọn, dễ đọc và phù hợp.";
    let status = "good";

    if (hasEmptyParagraph) {
      message = "Bài viết có chứa đoạn rỗng hoặc chỉ có khoảng trắng.";
      status = "fail";
    } else if (
      hasExtremeParagraph ||
      finalScore < Math.ceil(paragraphs.length * 0.7)
    ) {
      message = "Một số đoạn văn quá dài hoặc quá ngắn – nên điều chỉnh.";
      status = "ok";
    }

    return {
      score: finalScore,
      message,
      status,
    };
  }

  // Image count (max 5 pts)
  function checkImages(content) {
    const imgCount = (content.match(/<img\b[^>]*>/gi) || []).length;
    let score = 0;
    let message = "";
    let status = "fail";

    if (imgCount >= 3) {
      score = 5;
      message = `Bài viết có ${imgCount} ảnh minh họa -> Rất tốt!`;
      status = "good";
    } else if (imgCount > 0) {
      score = 3;
      message = `Bài viết có ${imgCount} ảnh minh họa -> Tạm ổn, nên có ≥3 ảnh.`;
      status = "ok";
    } else {
      score = 0;
      message = "Bài viết chưa có ảnh minh họa.";
      status = "fail";
    }

    return { score, message, status };
  }

  // Media check (video/audio/iframe)
  function checkMedia(content) {
    const mediaCount = (content.match(/<(video|audio|iframe)\b[^>]*>/gi) || [])
      .length;

    if (mediaCount >= 1) {
      return {
        score: 5,
        message: `Bài viết có ${mediaCount} video/media bổ trợ -> Tốt!`,
      };
    } else {
      return {
        score: 0,
        message: "Bài viết chưa có video/media bổ trợ.",
      };
    }
  }

  // Tạo hàm tổng hợp để tính điểm readability
  function calculateReadabilityScore({
    title = "",
    content = "",
    keyword = "",
  }) {
    let score = 0;

    // Cộng điểm từng phần
    score += checkKeywordNearTitleStart(title, keyword).scoreTitleStart;
    score += checkTitleHasNumber(title).scoreTitleNumber;
    score += checkTitlePostLength(title).score;
    score += checkParagraphLength(content).score;
    score += checkImages(content).score;
    score += checkMedia(content).score;

    return score; // Tổng tối đa 35 điểm
  }
  return { calculateReadabilityScore };
}
