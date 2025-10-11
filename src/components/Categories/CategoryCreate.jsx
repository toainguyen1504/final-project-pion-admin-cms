import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import clsx from "clsx";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

function CategoryCreate() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("post");
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      // eslint-disable-next-line no-useless-escape
      .replace(/[^a-z0-9\-]/g, "");
    setSlug(generatedSlug);
  }, [name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, slug, type, is_featured: isFeatured };
    console.log("Submit category:", payload);
    // TODO: call API here
  };

  return (
    <div className="p-4 space-y-6">
      <Helmet>
        <title>Create Category | Pion CMS</title>
        <meta
          name="description"
          content="Create Categories for system management"
        />
        <link rel="icon" href="/assets/favicon/favicon-96x96.png" />
      </Helmet>

      {/* Header + Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Add Category
          </h2>
          <p className="text-slate-500 mt-1">
            Create a new category to organize and classify your content more
            effectively.
          </p>
        </div>
        <Button
          type="submit"
          form="category-form"
          className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 rounded-xl text-white 
            min-w-36 select-none cursor-pointer"
        >
          Save
        </Button>
      </div>

      {/* Form */}
      <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-slate-700 dark:text-slate-300"
            >
              Name
            </Label>

            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter category name"
              className="pt-2 pb-2.5 px-4 border border-slate-300 dark:border-slate-600 rounded-xl caret-blue-600
              focus-visible:ring-blue-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus:outline-none text-slate-700 dark:text-slate-300"
            />
          </div>

          {/* slug */}
          <div className="space-y-2">
            <Label
              htmlFor="slug"
              className="text-slate-700 dark:text-slate-300"
            >
              Slug
            </Label>
            <Input
              id="slug"
              value={slug}
              disabled
              placeholder="Auto generate category slug"
              className="pt-2 pb-2.5 px-4 border border-slate-300 dark:border-slate-600 bg-slate-100 
                dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {/* Type */}
          <div className="flex items-center space-x-4 pt-6 md:pt-0">
            <Label className="text-slate-700 dark:text-slate-300">Type</Label>
            <Tabs value={type} onValueChange={setType}>
              <TabsList className="bg-slate-200 dark:bg-slate-800 rounded-full p-1">
                <TabsTrigger
                  value="post"
                  className={clsx(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                    type === "post"
                      ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-100"
                      : "text-slate-700 dark:text-slate-300"
                  )}
                >
                  Post
                </TabsTrigger>
                <TabsTrigger
                  value="course"
                  className={clsx(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer",
                    type === "course"
                      ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-100"
                      : "text-slate-700 dark:text-slate-300"
                  )}
                >
                  Course
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Featured */}
          <div className="flex items-center space-x-4 pt-6 md:pt-0">
            <Label
              htmlFor="featured"
              className="text-slate-700 dark:text-slate-300"
            >
              Featured Mode
            </Label>

            <Switch
              id="featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
            ></Switch>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CategoryCreate;
