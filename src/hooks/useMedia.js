import { useEffect, useState } from "react";
import { fetchMedia, uploadMedia } from "@/lib/api/media";

export function useMedia() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Base URL render media (tuỳ theo môi trường)
  const BASE_MEDIA_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_BASE_MEDIA_URL_LOCAL
      : import.meta.env.VITE_BASE_MEDIA_URL_PRODUCTION;

  // Lấy toàn bộ media
  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await fetchMedia();
      // console.log("Media fetched from API:", data);
      setMediaList(data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // console.error("Error loading media:", error);
    } finally {
      setLoading(false);
    }
  };

  // Upload media rồi reload lại danh sách
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
    BASE_MEDIA_URL,
  };
}
