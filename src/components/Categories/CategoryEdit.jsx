import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

import { fetchCategory, updateCategory } from "@/lib/api/categories";

import AppBreadcrumb from "@/components/shared/AppBreadcrumb";

function CategoryEdit() {
  const { id } = useParams(); // get category id from route
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("post");
  const [isFeatured, setIsFeatured] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // state lưu giá trị gốc để check điều kiện Save btn disable
  const [originalName, setOriginalName] = useState("");
  const [originalType, setOriginalType] = useState("post");
  const [originalIsFeatured, setOriginalIsFeatured] = useState(false);

  // get old data
  useEffect(() => {
    const loadCategory = async () => {
      setLoadingData(true);
      const data = await fetchCategory(id);
      if (data) {
        setName(data.name || "");
        setSlug(data.slug || "");
        setType(data.type || "post");
        setIsFeatured(data.is_featured || false);

        // Lưu giá trị gốc
        setOriginalName(data.name || "");
        setOriginalType(data.type || "post");
        setOriginalIsFeatured(data.is_featured || false);
      } else {
        toast.error("Category not found!");
        navigate("/categories");
      }
      setLoadingData(false);
    };
    loadCategory();
  }, [id]);

  // Auto-generate slug
  useEffect(() => {
    setSlug(slugify(name));
  }, [name]);

  // check change value
  const isChanged =
    name !== originalName ||
    type !== originalType ||
    isFeatured !== originalIsFeatured;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { name, slug, type, is_featured: isFeatured };

    try {
      const res = await updateCategory(id, payload);
      if (res.success) {
        toast.success("Category updated successfully!");
        setTimeout(() => navigate("/categories"), 1000);
      } else {
        toast.error(res.message || "Failed to update category!");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        toast.error("Validation failed!");
      } else {
        toast.error("An unexpected error occurred!");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner className="w-8 h-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-10 space-y-3">
      <Helmet>
        <title>Chỉnh Sửa Danh Mục | Pion CMS</title>
      </Helmet>

      {/* Breadcrumb */}
      <AppBreadcrumb module="Danh mục" current="Chỉnh sửa" />

      {/* Header + Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Chỉnh Sửa Danh Mục
          </h2>
          <p className="text-slate-500 mt-1">
            Chỉnh sửa danh mục để thay đổi các thông tin của nó.
          </p>
        </div>
        <Button
          type="submit"
          form="category-form"
          className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl 
            text-white min-w-40 cursor-pointer select-none transition-all duration-300"
          disabled={loading || !isChanged} // disable nếu loading hoặc chưa thay đổi
        >
          {loading && <Spinner className="w-4 h-4 mr-2 text-white" />}
          Cập Nhật Danh Mục
        </Button>
      </div>

      {/* Form */}
      <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
            >
              Name <span className="text-red-500 text-sm">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter category name"
              className="py-5 px-4 border border-slate-200 dark:border-slate-700 rounded-xl caret-blue-600
              focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none
               text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
            />
            {errors.name && (
              <p className="ml-2 text-sm mt-1 text-red-600 dark:text-red-400">
                {errors.name[0]}
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label
              htmlFor="slug"
              className="ml-2 text-slate-700 dark:text-slate-300 inline-flex items-center gap-1"
            >
              Slug <span className="text-red-500 text-sm">*</span>
            </Label>
            <Input
              id="slug"
              value={slug}
              disabled
              placeholder="Auto-generate category Slug"
              className="py-5 px-4 border-slate-200 dark:border-slate-700 rounded-xl caret-blue-600
              focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none
               text-slate-700 dark:text-slate-200 bg-background dark:bg-slate-950 
               dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)] cursor-not-allowed"
            />
          </div>
        </div>

        {/* Type + Featured */}
        <div className="ml-2 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          <div className="flex items-center space-x-4 pt-6 md:pt-0">
            <Label className="text-slate-700 dark:text-slate-300">Type</Label>
            <Tabs value={type} onValueChange={setType}>
              <TabsList className="bg-slate-200 dark:bg-slate-700 rounded-full p-1">
                <TabsTrigger
                  value="post"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer
                    data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600
                    dark:data-[state=active]:bg-indigo-500 dark:data-[state=active]:text-indigo-50
                    text-slate-700 dark:text-slate-300"
                >
                  Post
                </TabsTrigger>

                <TabsTrigger
                  value="course"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer
                    data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-600
                    dark:data-[state=active]:bg-indigo-500 dark:data-[state=active]:text-indigo-100
                    text-slate-700 dark:text-slate-300"
                >
                  Course
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center space-x-4 pt-6 md:pt-0">
            <div className="flex items-center gap-1">
              <Label
                htmlFor="featured"
                className="text-slate-700 dark:text-slate-300"
              >
                Featured Mode
              </Label>
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
                  When this mode is enabled, the category will be highlighted in
                  the user interface.
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

export default CategoryEdit;
