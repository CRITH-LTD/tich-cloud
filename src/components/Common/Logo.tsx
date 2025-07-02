import { Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

type LogoProps = {
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const Logo: React.FC<LogoProps> = ({ theme = "light", size = "md", className = "" }) => {
  const isDark = theme === "dark";

  const sizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link
      to="/"
      className={`flex items-center space-x-2 font-semibold ${className}`}
      aria-label="Go to homepage"
    >
      <Cloud
        className={`h-6 w-6 ${isDark ? "text-blue-600" : "text-blue-50"}`}
        aria-hidden="true"
      />
      <span className={`${sizeClasses[size]} font-bold ${isDark ? "text-gray-900" : "text-white"}`}>
        TICH
      </span>
      <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        Education Cloud
      </span>
    </Link>
  );
};
