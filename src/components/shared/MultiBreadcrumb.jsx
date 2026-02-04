import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

export default function MultiBreadcrumb({ items = [] }) {
  const navigate = useNavigate();

  if (!items.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center space-x-2">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.path ? (
                <BreadcrumbLink
                  onClick={() => navigate(item.path)}
                  className="cursor-pointer text-slate-500 dark:text-slate-400 
                    hover:text-indigo-600 dark:hover:text-indigo-400 
                    transition-colors duration-300 font-medium"
                >
                  {item.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-slate-800 dark:text-slate-100 font-semibold transition-colors">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {index < items.length - 1 && (
              <BreadcrumbSeparator className="text-slate-400 dark:text-slate-500" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
