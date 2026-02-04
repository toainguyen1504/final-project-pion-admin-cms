import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";

import { createCategory } from "@/lib/api/categories";
import AppBreadcrumb from "@/components/shared/AppBreadcrumb";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

function CategoryCreate() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("post");
  const [isFeatured, setIsFeatured] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { name, slug, type, is_featured: isFeatured };
    // console.log("Submit category:", payload);

    try {
      const res = await createCategory(payload);
      if (res.success) {
        toast.success("Thêm danh mục thành công!");
        setTimeout(() => navigate("/danh-muc"), 1000);
      } else {
        toast.error(res.message || "Thêm danh mục thất bại! Vui lòng thử lại.");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        toast.error("Vui lòng kiểm tra lại biểu mẫu!");
      } else {
        toast.error("Đã xảy ra lỗi không mong muốn! Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  return (
    <div className="px-4 pt-4 pb-10 space-y-3">
      <Helmet>
        <title>Thêm Danh Mục | Pion CMS</title>
        <meta name="description" content="Tạo Danh Mục cho hệ thống quản lý" />
        <link rel="icon" href="/assets/favicon/favicon-96x96.png" />
      </Helmet>

      <AppBreadcrumb module="Danh mục" current="Tạo mới" />

      {/* Header + Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Thêm Danh Mục
          </h2>
          <p className="text-slate-500 mt-1">
            Tạo danh mục mới để sắp xếp và phân loại nội dung của bạn hiệu quả
            hơn.
          </p>
        </div>
        <Button
          type="submit"
          form="category-form"
          className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl 
            text-white min-w-40 cursor-pointer select-none transition-all duration-300"
          disabled={loading}
        >
          {loading && <Spinner className="w-4 h-4 mr-2 text-white" />}
          Lưu Danh Mục
        </Button>
      </div>

      {/* Form */}
      <form
        id="category-form"
        onSubmit={handleSubmit}
        className="space-y-6 mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
            >
              Tên Danh Mục
              <span className="text-red-500 text-sm">*</span>
            </Label>

            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Tên danh mục (VD: Tin tức,...)"
            />
            {errors.name && (
              <p className="ml-2 text-sm mt-1 text-red-600 dark:text-red-400">
                {errors.name[0]}
              </p>
            )}
          </div>

          {/* slug */}
          <div className="space-y-2">
            <Label
              htmlFor="slug"
              className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
            >
              Slug
              <span className="text-red-500 text-sm">*</span>
            </Label>
            <Input
              id="slug"
              value={slug}
              disabled
              placeholder="Tự động tạo Slug cho danh mục"
              className="cursor-not-allowed"
            />
          </div>
        </div>

        <div className="ml-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Type */}
          <div className="flex items-center space-x-4 pt-6 md:pt-0">
            <Label className="text-slate-700 dark:text-slate-300">
              Loại Danh Mục
            </Label>
            <Tabs value={type} onValueChange={setType}>
              <TabsList className="bg-slate-200 dark:bg-slate-700 rounded-full p-1">
                <TabsTrigger
                  value="post"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer
                    data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600
                    dark:data-[state=active]:bg-indigo-500 dark:data-[state=active]:text-indigo-50
                    text-slate-700 dark:text-slate-300"
                >
                  Bài viết
                </TabsTrigger>

                <TabsTrigger
                  value="course"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer
                    data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600
                    dark:data-[state=active]:bg-indigo-500 dark:data-[state=active]:text-indigo-100
                    text-slate-700 dark:text-slate-300"
                >
                  Khóa học
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Featured */}
          <div className="flex items-center space-x-4 pt-6 md:pt-0">
            <div className="flex items-center gap-1">
              <Label
                htmlFor="featured"
                className="text-slate-700 dark:text-slate-300"
              >
                Chế Độ Nổi Bật
              </Label>

              {/* Tooltip icon */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  side="top"
                  align="start"
                  sideOffset={4}
                  className="max-w-xs p-3 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-md z-50"
                >
                  Khi chế độ này được bật, danh mục sẽ được làm nổi bật trong
                  giao diện người dùng. Nó có thể xuất hiện ở đầu danh sách hoặc
                  được hiển thị với kiểu dáng khác để dễ nhận biết hơn.
                </PopoverContent>
              </Popover>
            </div>

            <Switch
              id="featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default CategoryCreate;
