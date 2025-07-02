import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const capitalize = (str: string) =>
  str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

export const Breadcrumbs = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  const baseCrumbs = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
  ];

  const dynamicCrumbs = segments.slice(1).map((segment, i) => {
    const path = "/dashboard/" + segments.slice(1, i + 2).join("/");
    return {
      name: capitalize(segment),
      path,
    };
  });

  const allCrumbs = [...baseCrumbs, ...dynamicCrumbs];

  return (
    <nav className="text-sm text-gray-500 mb-6">
      <ol className="flex items-center space-x-2">
        {allCrumbs.map((crumb, index) => {
          const isLast = index === allCrumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center space-x-2">
              {!isLast ? (
                <Link
                  to={crumb.path}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {crumb.name}
                </Link>
              ) : (
                <span className="text-gray-400">{crumb.name}</span>
              )}
              {!isLast && <ChevronRight className="h-4 w-4 text-gray-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
