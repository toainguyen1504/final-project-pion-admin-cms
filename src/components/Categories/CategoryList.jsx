import { Helmet } from "react-helmet-async";
import CategoryTable from "@/components/categories/CategoryTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// mock categories data
const mockCategories = [
  {
    id: 1,
    name: "Design",
    slug: "design",
    visible: true,
    updatedAt: "2025-09-15",
  },
  {
    id: 2,
    name: "Marketing",
    slug: "marketing",
    visible: false,
    updatedAt: "2025-08-10",
  },
  {
    id: 3,
    name: "Development",
    slug: "development",
    visible: true,
    updatedAt: "2025-07-22",
  },
  {
    id: 4,
    name: "Finance",
    slug: "finance",
    visible: true,
    updatedAt: "2025-06-30",
  },
  {
    id: 5,
    name: "Human Resources",
    slug: "human-resources",
    visible: false,
    updatedAt: "2025-06-15",
  },
  {
    id: 6,
    name: "Sales",
    slug: "sales",
    visible: true,
    updatedAt: "2025-05-28",
  },
  {
    id: 7,
    name: "Support",
    slug: "support",
    visible: true,
    updatedAt: "2025-05-10",
  },
  {
    id: 8,
    name: "Legal",
    slug: "legal",
    visible: false,
    updatedAt: "2025-04-20",
  },
  {
    id: 9,
    name: "Operations",
    slug: "operations",
    visible: true,
    updatedAt: "2025-04-01",
  },
  {
    id: 10,
    name: "Content",
    slug: "content",
    visible: true,
    updatedAt: "2025-03-15",
  },
  {
    id: 11,
    name: "Analytics",
    slug: "analytics",
    visible: false,
    updatedAt: "2025-03-01",
  },
  {
    id: 12,
    name: "Strategy",
    slug: "strategy",
    visible: true,
    updatedAt: "2025-02-20",
  },
];

function CategoryList() {
  return (
    <div className="p-4">
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
          <p className="text-slate-500 mt-0.5">Manage all system categories</p>
        </div>
        <Button
          className="bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 
        transition-colors cursor-pointer rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Add New Category
        </Button>
      </div>

      <CategoryTable data={mockCategories} />
    </div>
  );
}

export default CategoryList;
