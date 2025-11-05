// image-library-node-extension.js
import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageLibraryNodeView from "./ImageLibraryNodeView"; // đường dẫn tương đối

export const ImageLibraryNode = Image.extend({
  // giữ name = "image" để dùng API mặc định (setImage etc.)
  name: "image",

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: null },
      alt: { default: null },
      title: { default: null },
      // nếu muốn lưu source đã expand (full url) có thể thêm attr custom ở đây
    };
  },

  // Bổ sung parseHTML để nhận figcaption
  parseHTML() {
    return [
      {
        tag: "figure.image",
        getAttrs: (el) => {
          const img = el.querySelector("img");
          const figcaption = el.querySelector("figcaption");

          return {
            src: img?.getAttribute("src") || "",
            alt: img?.getAttribute("alt") || "",
            title: img?.getAttribute("title") || "",
            caption:
              figcaption?.textContent?.trim() ||
              img?.getAttribute("caption") ||
              "",
          };
        },
        // Chặn parse nội dung con như figcaption thành text node (tag p)
        getContent: () => [],
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      { class: "image" },
      ["img", mergeAttributes(HTMLAttributes)],
      HTMLAttributes.caption ? ["figcaption", HTMLAttributes.caption] : "",
    ];
  },

  addNodeView() {
    // kết nối React NodeView
    return ReactNodeViewRenderer(ImageLibraryNodeView);
  },
});
