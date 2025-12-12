import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { slugify } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function AppBreadcrumb({
  module = "Categories",
  current = "List",
}) {
  const navigate = useNavigate();

  // List → Don't display breadcrumb
  if (current === "List") return null;

  const basePath = `/${slugify(module)}`;

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center space-x-2">
        {/* Module link */}
        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={() => navigate(basePath)}
            className="cursor-pointer text-slate-500 dark:text-slate-400 
            hover:text-indigo-600 dark:hover:text-indigo-400 
            transition-colors duration-300 font-medium"
          >
            {module}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Separator */}
        <BreadcrumbSeparator className="text-slate-400 dark:text-slate-500" />

        {/* Current page */}
        <BreadcrumbItem>
          <BreadcrumbPage className="text-slate-800 dark:text-slate-100 font-semibold transition-colors">
            {current}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
