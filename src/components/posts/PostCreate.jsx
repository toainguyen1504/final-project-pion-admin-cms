import { Helmet } from "react-helmet-async";
import { useCallback, useState } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

import "@/components/tiptap-templates/simple/simple-editor.scss";

function PostCreate() {
  const [editor, setEditor] = useState(null);

  const handleEditorReady = useCallback((editor) => {
    setEditor(editor);
  }, []);

  const handleLogHTML = () => {
    if (editor) {
      const html = editor.getHTML();
      console.log("HTML content:", html);
    } else {
      console.warn("Editor chưa sẵn sàng");
    }
  };
  return (
    <div className="p-4">
      <Helmet>
        <title>Create Post| Pion CMS</title>
        <meta name="description" content="Create Post for system management" />
      </Helmet>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
          Add Post
        </h2>
        <p className="text-slate-500 mt-2">
          Create SEO-friendly posts with rich formatting, image support, and
          structured publishing tools.
        </p>
      </div>

      <div className="flex space-x-4">
        {/* Cột trái: Editor */}
        <div
          className="flex-1 bg-background text-foreground shadow-lg 
          dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)] rounded-xl"
        >
          <SimpleEditor onReady={handleEditorReady} />
        </div>

        {/* Cột phải: Sidebar */}
        <div className="w-[320px] border-l border-border p-6 bg-card text-card-foreground space-y-4">
          <h3 className="text-lg font-semibold mb-4">Đăng bài</h3>
          <ul className="space-y-2 text-sm">
            <li>📌 Tiêu đề: "Cách dùng Tiptap"</li>
            <li>📝 Trạng thái: Nháp</li>
            <li>📅 Ngày tạo: 12/10/2025</li>
            <li>👤 Tác giả: Nguyễn</li>
          </ul>

          <button
            onClick={handleLogHTML}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80 transition"
          >
            Log HTML ra console
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCreate;
