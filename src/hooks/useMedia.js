import { useEffect, useState } from "react";
import { fetchMedia, uploadMedia } from "@/lib/api/media";

export function useMedia() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Lấy toàn bộ media
  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await fetchMedia();
      console.log("✅ Media fetched from API:", data);
      setMediaList(data);
    } catch (error) {
      console.error("❌ Error loading media:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Upload media rồi reload lại danh sách
  const handleUpload = async (files) => {
    try {
      setLoading(true);
      await uploadMedia(files);
      await loadMedia();
    } catch (error) {
      console.error("❌ Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  return {
    mediaList,
    loading,
    reloadMedia: loadMedia,
    uploadMedia: handleUpload,
  };
}
