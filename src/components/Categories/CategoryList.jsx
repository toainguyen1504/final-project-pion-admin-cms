import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

import CategoryTable from "@/components/categories/CategoryTable";
import { useCategories } from "@/hooks";

function CategoryList() {
  const { categories, loading } = useCategories();
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-4 pb-10">
      <Helmet>
        <title>All Category | Pion CMS</title>
        <meta
          name="description"
          content="List Categories for system management"
        />
        <link rel="icon" href="/assets/favicon/favicon-96x96.png" />
      </Helmet>

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            All Categories
          </h2>
          <p className="text-slate-500 mt-0.5">
            View, manage, and update all categories used across the system.
          </p>
        </div>
        <Button
          onClick={() => navigate("/categories/create")}
          className="bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 
        transition-colors duration-300 cursor-pointer rounded-xl"
        >
          {/* <Plus className="w-4 h-4" /> */}
          Add New Category
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-300">
          <Spinner className="size-8 text-indigo-600 dark:text-indigo-500" />
          <span>Loading categories...</span>
        </div>
      ) : (
        <CategoryTable data={categories} />
      )}
    </div>
  );
}

export default CategoryList;
