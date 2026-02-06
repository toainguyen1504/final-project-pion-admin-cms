import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { fetchProgram } from "@/lib/api/programs";
import { fetchCategories } from "@/lib/api/categories";
import { fetchCourse, updateCourse } from "@/lib/api/courses";
import { getCurrentUser } from "@/utils/auth";
import MultiBreadcrumb from "@/components/shared/MultiBreadcrumb";

export default function CourseEditPage() {
  const { programId, courseId } = useParams();

  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState("draft");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const prog = await fetchProgram(programId);
      setProgram(prog);

      const cats = await fetchCategories();
      const courseCategories = (cats.data || []).filter(
        (cat) => cat.type === "course",
      );
      setCategories(courseCategories);

      // fetch course detail
      const course = await fetchCourse(courseId);
      if (course) {
        setTitle(course.title || "");
        setDescription(course.description || "");
        setLanguage(course.language || "");
        setThumbnail(course.thumbnail || "");
        setPrice(course.price || 0);
        setDiscountPrice(course.discount_price || "");
        setIsFree(course.is_free || false);
        setLevel(course.level || 0);
        setStatus(course.status || "draft");
        setCategoryId(course.category_id || "");
      }
    };
    loadData();
  }, [programId, courseId]);

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      await updateCourse(courseId, {
        program_id: programId,
        title,
        description,
        language,
        thumbnail,
        price,
        discount_price: discountPrice || null,
        is_free: isFree,
        level,
        status,
        category_id: categoryId || null,
        user_id: currentUser?.id,
      });
      toast.success("Khóa học đã được cập nhật thành công!");
      navigate(`/chuong-trinh-hoc/${programId}`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Cập nhật khóa học thất bại!",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!program) return <div>Đang tải...</div>;

  return (
    <div className="px-4 py-6 max-w-2xl space-y-6">
      {/* Breadcrumb */}
      <MultiBreadcrumb
        items={[
          { label: "Chương trình học", path: "/chuong-trinh-hoc" },
          { label: program.title, path: `/chuong-trinh-hoc/${program.id}` },
          { label: "Chỉnh sửa khóa học" },
        ]}
      />

      {/* Title + Desc */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Chỉnh sửa khóa học
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Cập nhật thông tin cho khóa học thuộc chương trình{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {program.title}
          </span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded-xl space-y-6 mt-4"
      >
        <div className="grid grid-cols-1 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="form-label">
              Tiêu đề <span className="text-red-500 text-sm">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="VD: Ferris Wheel 1"
            />
          </div>

          {/* Status + Level + Category */}
          <div className="flex items-center gap-6">
            {/* Level */}
            <div className="w-40 space-y-2">
              <Label
                htmlFor="level"
                className="ml-2 text-slate-700 dark:text-slate-300"
              >
                Cấp độ
              </Label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="form-select"
              >
                {[...Array(10).keys()].map((lv) => (
                  <option key={lv} value={lv}>
                    Level {lv}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="w-40 space-y-2">
              <Label
                htmlFor="status"
                className="ml-2 text-slate-700 dark:text-slate-300"
              >
                Trạng thái
              </Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select"
              >
                <option value="draft">Nháp</option>
                <option value="pending">Chờ duyệt</option>
                <option value="published">Xuất bản</option>
                <option value="inactive">Tạm dừng</option>
                <option value="archived">
                  Đã lưu trữ (không còn khả dụng)
                </option>
              </select>
            </div>

            {/* Category */}
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="category_id"
                className="ml-2 text-slate-700 dark:text-slate-300"
              >
                Danh mục
              </Label>
              <select
                id="category_id"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="form-select"
              >
                <option value="">-- Chọn danh mục --</option>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Chưa có danh mục nào cho khóa học</option>
                )}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="form-label">
              Mô tả
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về khóa học"
            />
          </div>

          {/* Price + Discount + Free */}
          <div className="flex items-center gap-6">
            <div className="flex-1 space-y-2">
              <Label htmlFor="price" className="form-label">
                Giá
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isFree}
                placeholder="VD: 500000"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="discount_price" className="form-label">
                Giá khuyến mãi
              </Label>
              <Input
                id="discount_price"
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="VD: 400000"
              />
            </div>
            <div className="flex items-center gap-2 ml-2 mt-7">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
              />
              <span className="text-slate-700 dark:text-slate-300">
                Miễn phí
              </span>
            </div>
          </div>

          {/* Language + Thumbnail */}
          <div className="flex items-center gap-6">
            <div className="w-40 space-y-2">
              <Label htmlFor="language" className="form-label">
                Ngôn ngữ
              </Label>
              <Input
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="VD: Tiếng Anh"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="thumbnail" className="form-label">
                Ảnh thumbnail
              </Label>
              <Input
                id="thumbnail"
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="URL ảnh thumbnail"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl 
        text-white w-full cursor-pointer select-none transition-all duration-300 mt-2"
        >
          {loading ? "Đang xử lý..." : "Cập nhật Khóa Học"}
        </Button>
      </form>
    </div>
  );
}
