export default function useSeoReadabilityScore() {
  // ===== Check 1: Keyword near title H1 start =====
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
      ? "Từ khóa xuất hiện gần đầu tiêu đề"
      : "Từ khóa không xuất hiện gần đầu tiêu đề";

    return { score: scoreTitleStart, message: messageTitleStart };
  }

  // ===== Check 2: Title H1 has number (year/ranking) =====
  function checkTitleHasNumber(title) {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 2;
    const maxYear = currentYear + 1;

    const yearRegex = /\b(20\d{2})\b/g;
    const topRegex = /\btop\s*\d+\b/i;
    const numberRegex = /\b\d{1,3}\b/;

    const yearMatches = [...title.matchAll(yearRegex)];
    const validYear = yearMatches.some((match) => {
      const year = parseInt(match[1]);
      return year >= minYear && year <= maxYear;
    });

    const hasTop = topRegex.test(title);
    const hasGeneralNumber = numberRegex.test(title);

    const found = validYear || hasTop || hasGeneralNumber;

    const score = found ? 5 : 0;
    const message = found
      ? "Tiêu đề chứa một con số hợp lệ (ví dụ: năm, xếp hạng hoặc số lượng)"
      : "Tiêu đề không chứa một con số hợp lệ (ví dụ: năm, xếp hạng hoặc số lượng)";

    return { score, message };
  }

  // ===== Check 3: Title H1 length =====
  function checkTitlePostLength(title) {
    const length = title.trim().length;
    let score = 0;
    let message = "";
    let status = "fail";

    if (length >= 40 && length <= 70) {
      score = 5;
      message = `Tiêu đề bài viết được tối ưu tốt (${length}/70 characters)`;
      status = "good";
    } else if (length >= 20 && length < 40) {
      score = 3;
      message = `Tiêu đề bài viết hơi ngắn (${length}/70 characters) – nên mở rộng thêm`;
      status = "ok";
    } else if (length < 20) {
      score = 0;
      message = `Tiêu đề bài viết quá ngắn (${length}/70 characters) – chưa đủ mô tả`;
      status = "fail";
    } else {
      score = 0;
      message = `Tiêu đề bài viết quá dài (${length}/70 characters) – nên rút gọn lại`;
      status = "fail";
    }

    return { score, message, status };
  }

  // ===== Check 4: Paragraph clarity =====
  function checkParagraphLength(normalizedContent) {
    const paragraphs = normalizedContent
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter((p) => p);

    if (paragraphs.length === 0) {
      return {
        score: 0,
        message: "Không tìm thấy đoạn văn nào để đánh giá",
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

    let message = "Tất cả đoạn văn đều ngắn gọn, dễ đọc và có cấu trúc tốt";
    let status = "good";

    if (hasEmptyParagraph) {
      message = "Bài viết chứa các đoạn trống hoặc chỉ có khoảng trắng";
      status = "fail";
    } else if (
      hasExtremeParagraph ||
      finalScore < Math.ceil(paragraphs.length * 0.7)
    ) {
      message = "Một số đoạn quá dài hoặc quá ngắn – nên điều chỉnh lại";
      status = "ok";
    }

    return {
      score: finalScore,
      message,
      status,
    };
  }

  // ===== Check 5: Images =====
  function checkImages(rawHtml) {
    const imgCount = (rawHtml.match(/<img\b[^>]*>/gi) || []).length;
    let score = 0;
    let message = "";
    let status = "fail";

    if (imgCount >= 3) {
      score = 5;
      message = `Bài viết có ${imgCount} hình minh họa – Rất tốt!`;
      status = "good";
    } else if (imgCount > 0) {
      score = 3;
      message = `Bài viết có ${imgCount} hình – Tạm ổn, nhưng nên có ít nhất 3 hình`;
      status = "ok";
    } else {
      score = 0;
      message = "Bài viết không có hình minh họa nào";
      status = "fail";
    }

    return { score, message, status };
  }

  // ===== Check 6: Media (video/audio/iframe) =====
  function checkMedia(rawHtml) {
    const mediaCount = (rawHtml.match(/<(video|audio|iframe)\b[^>]*>/gi) || [])
      .length;

    return mediaCount >= 1
      ? {
          score: 5,
          message: `Bài viết có ${mediaCount} nội dung media (video/âm thanh) – Tuyệt vời!`,
          status: "good",
        }
      : {
          score: 0,
          message: "Bài viết không có video hoặc nội dung media hỗ trợ",
          status: "ok",
        };
  }

  // ===== Tổng hợp điểm & checklist =====
  function calculateReadabilityScore({
    title = "",
    content = "",
    keyword = "",
    rawHtml = "",
  }) {
    const titleStart = checkKeywordNearTitleStart(title, keyword);
    const titleNumber = checkTitleHasNumber(title);
    const titleLength = checkTitlePostLength(title);
    const paragraph = checkParagraphLength(content);
    const images = checkImages(rawHtml);
    const media = checkMedia(rawHtml);

    const totalScore =
      titleStart.score +
      titleNumber.score +
      titleLength.score +
      paragraph.score +
      images.score +
      media.score;

    // Checklist
    const checklist = [
      {
        title: "Content Readability",
        items: [
          {
            text: titleStart.message,
            level: titleStart.score > 0 ? "success" : "warning",
          },
          {
            text: titleNumber.message,
            level: titleNumber.score > 0 ? "success" : "error",
          },
          {
            text: titleLength.message,
            level:
              titleLength.status === "good"
                ? "success"
                : titleLength.status === "ok"
                ? "warning"
                : "error",
          },
          {
            text: paragraph.message,
            level:
              paragraph.status === "good"
                ? "success"
                : paragraph.status === "ok"
                ? "warning"
                : "error",
          },
          {
            text: images.message,
            level:
              images.status === "good"
                ? "success"
                : images.status === "ok"
                ? "warning"
                : "error",
          },
          {
            text: media.message,
            level: media.score > 0 ? "success" : "warning",
          },
        ],
      },
    ];

    // 🧩 Debug log
    // console.groupCollapsed(
    //   "%c📖 SEO Readability Analysis",
    //   "color:#0284c7;font-weight:bold"
    // );
    // console.log("📊 Total Score:", totalScore);
    // console.log("📋 Details:", {
    //   titleStart,
    //   titleNumber,
    //   titleLength,
    //   paragraph,
    //   images,
    //   media,
    // });
    // console.groupEnd();

    return {
      totalScore,
      checklist,
      details: {
        titleStart,
        titleNumber,
        titleLength,
        paragraph,
        images,
        media,
      },
    };
  }

  return { calculateReadabilityScore };
}
