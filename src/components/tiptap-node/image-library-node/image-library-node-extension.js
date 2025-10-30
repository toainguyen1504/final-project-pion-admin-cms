// src/components/image-library-node/image-library-node-extension.js
import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";

export const ImageLibraryNode = Image.extend({
  name: "image", // ⚠️ Giữ nguyên tên "image"

  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: null },
      alt: { default: null },
      title: { default: null },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      { class: "image" },
      ["img", mergeAttributes(HTMLAttributes)],
      HTMLAttributes.caption ? ["figcaption", HTMLAttributes.caption] : "",
    ];
  },
});
