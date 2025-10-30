// ImageLibraryNodeView.jsx
import React from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { Trash2 } from "lucide-react";

/**
 * React node view for library images.
 * Props available: node, editor, selected, getPos, ... (provided by ReactNodeViewRenderer)
 */
export default function ImageLibraryNodeView(props) {
  const { node, editor, selected, getPos } = props;
  const { src, caption, alt, title } = node.attrs || {};

  const handleDelete = (e) => {
    e.stopPropagation();
    // getPos is a function that returns the current position
    const pos = typeof getPos === "function" ? getPos() : getPos;
    if (typeof pos !== "number") return;

    // delete the node range [pos, pos + node.nodeSize)
    editor
      .chain()
      .focus()
      .deleteRange({ from: pos, to: pos + node.nodeSize })
      .run();
  };

  return (
    <NodeViewWrapper className="relative group inline-block">
      <figure className={`m-0 ${selected ? "ring-2 ring-indigo-500" : ""}`}>
        <img
          src={src}
          alt={alt || ""}
          title={title || ""}
          className="max-w-full rounded-md cursor-pointer"
          draggable={false}
        />
        {caption && (
          <figcaption className="text-sm text-center text-gray-500 mt-1">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Delete button (appears when hover via CSS .group) */}
      <button
        onClick={handleDelete}
        title="Xóa ảnh"
        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </NodeViewWrapper>
  );
}
