import { useCallback } from "react";

// ===== Helper Functions =====

// 1. Keyword Density
function checkKeywordDensity(content, keyword, options = {}) {
  const keywordLower = keyword.toLowerCase().trim();
  const contentLower = content.toLowerCase().trim();

  const totalWords = contentLower.split(/\s+/).length;
  const keywordCount = contentLower.split(keywordLower).length - 1;
  const density = (keywordCount / totalWords) * 100;

  const keywordLength = keywordLower.split(/\s+/).length;

  let minDensity = 0.3;
  let maxDensity = 0.8;

  if (keywordLength <= 2) {
    minDensity = 0.8;
    maxDensity = 1.5;
  } else if (keywordLength <= 4) {
    minDensity = 0.6;
    maxDensity = 1.2;
  }

  const range = options.range || {
    good: (d) => d >= minDensity && d <= maxDensity,
    ok: (d) => d > maxDensity && d <= maxDensity + 1,
    fail: (d) => d < minDensity || d > maxDensity + 1 || keywordCount === 0,
  };

  const messages = options.messages || {
    good: "Mật độ từ khóa tối ưu.",
    ok: "Mật độ từ khóa tạm ổn.",
    fail: "Từ khóa chưa xuất hiện hoặc mật độ chưa đạt.",
  };

  let scoreDensity = 0;
  let messageDensity = "";
  let statusDensity = "";

  if (range.good(density)) {
    scoreDensity = 15;
    messageDensity = messages.good;
    statusDensity = "good";
  } else if (range.ok(density)) {
    scoreDensity = 5;
    messageDensity = messages.ok;
    statusDensity = "ok";
  } else {
    scoreDensity = 0;
    messageDensity = messages.fail;
    statusDensity = "fail";
  }

  return { scoreDensity, messageDensity, statusDensity };
}

// 2. Keyword in Headings (H1, H2, H3)
function checkKeywordInHeadings(rawHtml, keyword, normalizedTitleInput) {
  if (!keyword || !normalizedTitleInput) {
    return {
      scoreInHeadings: 0,
      messageInHeadings: "Thiếu dữ liệu tiêu đề hoặc từ khóa.",
      statusInHeadings: "fail",
    };
  }

  const keywordLower = keyword.toLowerCase();
  const headings = rawHtml.match(/<(h2|h3)[^>]*>(.*?)<\/\1>/gi) || [];

  let scoreInHeadings = 0;
  let messageInHeadings =
    "Không tìm thấy từ khóa trong tiêu đề (hoặc H2/H3) của bài viết";
  let statusInHeadings = "fail";

  // H1
  const h1Text = normalizedTitleInput.trim();
  const hasKeywordInH1 = h1Text.includes(keywordLower);

  const h1Words = h1Text.split(/\s+/).length;
  const h1KeywordCount = (h1Text.match(new RegExp(keywordLower, "g")) || [])
    .length;
  const h1DensityOk = h1KeywordCount / h1Words <= 0.4;
  const h1Stuffing = new RegExp(`(${keywordLower}\\s+){2,}`, "gi").test(h1Text);
  const h1LengthOk = h1Words >= 3 && h1Words <= 12;
  const h1Natural = hasKeywordInH1 && h1DensityOk && !h1Stuffing && h1LengthOk;

  // H2/H3
  let naturalCount = 0;
  let totalWithKeyword = 0;

  headings.forEach((h) => {
    const text = h
      .replace(/<[^>]+>/g, "")
      .toLowerCase()
      .trim();
    if (text.includes(keywordLower)) {
      totalWithKeyword++;

      const words = text.split(/\s+/).length;
      const keywordCount = (text.match(new RegExp(keywordLower, "g")) || [])
        .length;
      const densityOk = keywordCount / words <= 0.4;
      const stuffing = new RegExp(`(${keywordLower}\\s+){2,}`, "gi").test(text);
      const lengthOk = words >= 3 && words <= 12;

      if (densityOk && !stuffing && lengthOk) {
        naturalCount++;
      }
    }
  });

  // Điểm số
  if (hasKeywordInH1 || totalWithKeyword > 0) {
    if (h1Natural) {
      if (naturalCount > 0) {
        scoreInHeadings = 5;
        messageInHeadings =
          "Từ khóa xuất hiện tự nhiên trong tiêu đề (hoặc H2/H3) của bài viết.";
        statusInHeadings = "good";
      } else {
        scoreInHeadings = 3;
        messageInHeadings =
          "Từ khóa xuất hiện tự nhiên nhưng chưa có H2/H3 đạt chuẩn.";
        statusInHeadings = "ok";
      }
    } else {
      scoreInHeadings = 0;
      messageInHeadings =
        "Từ khóa có trong tiêu đề (hoặc H2/H3) nhưng chưa tự nhiên!";
      statusInHeadings = "fail";
    }
  }

  return { scoreInHeadings, messageInHeadings, statusInHeadings };
}

// 3. Keyword in Image Alt
function checkKeywordInImageAlt(rawHtml, keyword) {
  const keywordLower = keyword.toLowerCase();
  const imgTags = [...rawHtml.matchAll(/<img[^>]*>/gi)];

  let totalImages = 0;
  let altWithKeyword = 0;
  let altWithoutKeyword = 0;
  let missingAlt = 0;
  let spammyAlt = 0;

  for (const [imgTag] of imgTags) {
    totalImages++;

    const altMatch = imgTag.match(/alt=["']([^"']+)["']/i);
    if (!altMatch) {
      missingAlt++;
      continue;
    }

    const altText = altMatch[1].trim().toLowerCase();

    if (altText === "") {
      missingAlt++;
    } else if (
      altText.includes(keywordLower) &&
      altText.length >= keywordLower.length + 10 &&
      !/(?:keyword){3,}/i.test(altText)
    ) {
      altWithKeyword++;
    } else if (/(?:keyword){3,}/i.test(altText)) {
      spammyAlt++;
    } else {
      altWithoutKeyword++;
    }
  }

  let scoreInImageAlt = 0;
  let messageInImageAlt = "";
  let statusInImageAlt = "fail";

  if (altWithKeyword > 0 && altWithKeyword >= totalImages / 2) {
    scoreInImageAlt = 5;
    messageInImageAlt = `Có ${altWithKeyword}/${totalImages} ảnh có Alt text chứa từ khóa và mô tả tự nhiên – tối ưu.`;
    statusInImageAlt = "good";
  } else if (altWithoutKeyword > 0 || altWithKeyword > 0) {
    scoreInImageAlt = 3;
    messageInImageAlt = `Có Alt text nhưng ${altWithKeyword}/${totalImages} ảnh chứa từ khóa – nên cải thiện thêm.`;
    statusInImageAlt = "ok";
  } else if (missingAlt === totalImages || spammyAlt > 0) {
    scoreInImageAlt = 0;
    messageInImageAlt = `Alt text bị thiếu hoặc spam từ khóa – chưa đạt yêu cầu SEO.`;
    statusInImageAlt = "fail";
  } else {
    scoreInImageAlt = 1;
    messageInImageAlt = `Alt text chưa chứa từ khóa hoặc mô tả chưa rõ ràng.`;
    statusInImageAlt = "ok";
  }

  return { scoreInImageAlt, messageInImageAlt, statusInImageAlt };
}

// 4. Internal Links
function checkInternalLink(rawHtml, baseDomain) {
  const anchors = [...rawHtml.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi)];

  let internalCount = 0;

  for (const [_, href] of anchors) {
    try {
      const url = new URL(href, `https://${baseDomain}`);
      if (url.hostname === baseDomain) {
        internalCount++;
      }
    } catch {
      continue;
    }
  }

  let scoreInternalLinks = 0;
  let messageInternalLinks = "";
  let statusInternalLinks = "fail";

  if (internalCount === 0) {
    scoreInternalLinks = 0;
    messageInternalLinks = "Chưa có liên kết nội bộ trong nội dung.";
    statusInternalLinks = "fail";
  } else if (internalCount === 1) {
    scoreInternalLinks = 2;
    messageInternalLinks = "Có 1 liên kết nội bộ – nên bổ sung thêm.";
    statusInternalLinks = "ok";
  } else if (internalCount >= 2 && internalCount <= 5) {
    scoreInternalLinks = 5;
    messageInternalLinks = `Có ${internalCount} liên kết nội bộ – tối ưu.`;
    statusInternalLinks = "good";
  } else {
    scoreInternalLinks = 2;
    messageInternalLinks = `Có ${internalCount} liên kết nội bộ – hơi nhiều, nên giới hạn 2–5.`;
    statusInternalLinks = "ok";
  }

  return { scoreInternalLinks, messageInternalLinks, statusInternalLinks };
}

// 5. External Links
function checkExternalLink(rawHtml, baseDomain) {
  const anchors = [...rawHtml.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi)];

  let externalCount = 0;
  let relCount = 0;

  for (const [fullMatch, href] of anchors) {
    try {
      const url = new URL(href, `https://${baseDomain}`);
      if (url.hostname !== baseDomain) {
        externalCount++;
        if (/rel=["'](nofollow|dofollow)["']/i.test(fullMatch)) {
          relCount++;
        }
      }
    } catch {
      continue;
    }
  }

  let scoreExternalLinks = 0;
  let messageExternalLinks = "";
  let statusExternalLinks = "fail";

  if (externalCount === 0) {
    scoreExternalLinks = 0;
    messageExternalLinks = "Chưa có liên kết ngoài trong nội dung.";
    statusExternalLinks = "fail";
  } else if (externalCount >= 1 && externalCount <= 3) {
    if (relCount === externalCount) {
      scoreExternalLinks = 5;
      messageExternalLinks =
        "Có 1–3 liên kết ngoài với thuộc tính rel hợp lý – tối ưu.";
      statusExternalLinks = "good";
    } else {
      scoreExternalLinks = 2;
      messageExternalLinks =
        "Có 1–3 liên kết ngoài nhưng thiếu thuộc tính rel – cần bổ sung.";
      statusExternalLinks = "ok";
    }
  } else {
    scoreExternalLinks = 0;
    messageExternalLinks =
      "Có hơn 3 liên kết ngoài – chưa tối ưu, nên giới hạn lại.";
    statusExternalLinks = "fail";
  }

  return { scoreExternalLinks, messageExternalLinks, statusExternalLinks };
}

// ===== Custom Hook: useSeoAdditionalScore =====
export default function useSeoAdditionalScore() {
  const calculateAdditionalScore = useCallback(
    ({
      content = "",
      rawHtml = "",
      keyword = "",
      normalizedTitleInput = "",
      baseDomain = "example.com",
    }) => {
      const density = checkKeywordDensity(content, keyword);
      const headings = checkKeywordInHeadings(
        rawHtml,
        keyword,
        normalizedTitleInput
      );
      const imageAlt = checkKeywordInImageAlt(rawHtml, keyword);
      const internalLinks = checkInternalLink(rawHtml, baseDomain);
      const externalLinks = checkExternalLink(rawHtml, baseDomain);

      const additionalScore =
        density.scoreDensity +
        headings.scoreInHeadings +
        imageAlt.scoreInImageAlt +
        internalLinks.scoreInternalLinks +
        externalLinks.scoreExternalLinks;

      return {
        additionalScore, // tổng tối đa 35 điểm
        density,
        headings,
        imageAlt,
        internalLinks,
        externalLinks,
      };
    },
    []
  );

  return { calculateAdditionalScore };
}
