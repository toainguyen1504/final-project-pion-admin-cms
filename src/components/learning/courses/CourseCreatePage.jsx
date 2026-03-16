import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

import { createCourse } from "@/lib/api/learning/courses";
import { fetchPrograms } from "@/lib/api/learning/programs";
import { fetchCategories } from "@/lib/api/categories";
import { getCurrentUser } from "@/utils/auth";
import MultiBreadcrumb from "@/components/shared/MultiBreadcrumb";

export default function CourseCreatePage() {
  const navigate = useNavigate();

  const [programId, setProgramId] = useState("");
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);

  // form states -> Form state nên gom lại
  const [title, setTitle] = useState(""); // required
  const [description, setDescription] = useState(""); // nên có để hiển thị đẹp bên frontend client - nếu public thì nên có
  const [benefits, setBenefits] = useState(""); // nên có để hiển thị đẹp bên frontend client - nếu public thì nên có
  const [language, setLanguage] = useState("");
  const [thumbnail, setThumbnail] = useState(""); // nên có để hiển thị đẹp bên frontend client - nếu public thì nên có
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState("draft");
  const [categoryId, setCategoryId] = useState(""); // required

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const progRes = await fetchPrograms();
      if (progRes.success) setPrograms(progRes.data);

      const cats = await fetchCategories();
      // lọc category có type = "course"
      const courseCategories = (cats.data || []).filter(
        (cat) => cat.type === "course",
      );
      setCategories(courseCategories);
    };
    loadData();
  }, []);

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const currentUser = getCurrentUser();
      await createCourse({
        program_id: programId,
        title,
        description,
        benefits,
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
      toast.success("Khóa học đã được tạo thành công!");
      navigate("/khoa-hoc"); // quay về trang list sau khi tạo xong
    } catch (error) {
      toast.error(error?.response?.data?.message || "Tạo khóa học thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // if (!program) return <div>Đang tải...</div>;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <MultiBreadcrumb
        items={[{ label: "Khóa học", path: "/khoa-hoc" }, { label: "Tạo mới" }]}
      />

      {/* Header + Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Thêm Khóa học
          </h2>
          <p className="text-slate-500 mt-1">
            Tạo khóa học mới để thêm vào hệ thống. Vui lòng điền đầy đủ thông
            tin để khóa học hiển thị tốt trên trang học tập của người dùng.
          </p>
        </div>

        <Button
          type="submit"
          form="course-form"
          className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl 
            text-white min-w-40 cursor-pointer select-none transition-all duration-300"
          disabled={loading}
        >
          {loading && <Spinner className="w-4 h-4 mr-2 text-white" />}
          Lưu Khóa Học
        </Button>
      </div>

      {/* Course Form */}
      <form
        id="course-form"
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-8 rounded-xl space-y-6 mt-4"
      >
        <div className="grid grid-cols-1 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="form-label after:content-['*'] after:text-red-500 after:ml-1"
            >
              Tiêu đề
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="VD: Ferris Wheel 1"
            />
          </div>

          {/* Program + Category + Level + Status */}
          <div className="flex gap-6">
            {/* Program */}
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="program_id"
                className="form-label after:content-['*'] after:text-red-500 after:ml-1"
              >
                Chương trình học
              </Label>
              <select
                id="program_id"
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="form-select w-full"
                required
              >
                <option value="">-- Chọn chương trình học --</option>
                {Array.isArray(programs) && programs.length > 0 ? (
                  programs.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.title}
                    </option>
                  ))
                ) : (
                  <option disabled>Chưa có chương trình nào</option>
                )}
              </select>
            </div>

            {/* Category */}
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="category_id"
                className="form-label after:content-['*'] after:text-red-500 after:ml-1"
              >
                Danh mục
              </Label>
              <select
                id="category_id"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="form-select w-full"
                required
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

            {/* Level */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="level" className="form-label">
                Cấp độ
              </Label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="form-select w-full"
              >
                {[...Array(10).keys()].map((lv) => (
                  <option key={lv} value={lv}>
                    Level {lv}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="status" className="form-label">
                Trạng thái
              </Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select w-full"
              >
                <option value="draft">Nháp</option>
                <option value="pending">Chờ duyệt</option>
                <option value="published">Xuất bản</option>
                <option value="inactive">Tạm dừng</option>
                <option value="archived">Đã lưu trữ</option>
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

          {/* Benefits */}
          <div className="space-y-2">
            <Label htmlFor="benefits" className="form-label">
              Lợi ích (Benefits)
            </Label>
            <Textarea
              id="benefits"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="Mỗi lợi ích cách nhau bằng phím Tab hoặc xuống dòng"
            />
            <p className="text-xs text-slate-500">
              Ví dụ: "Cải thiện kỹ năng nghe [Tab] Tăng vốn từ vựng [Tab] Phát
              âm chuẩn hơn"
            </p>
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
      </form>
    </div>
  );
}
