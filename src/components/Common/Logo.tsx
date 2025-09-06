import { Link } from "react-router-dom";
import React from "react";
import logo_crith from "../../assets/images/logo_cr_white.png";

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
      <div className="bg-blue-500 p-1 rounded-full">
      <img
        src={logo_crith}
        alt="CRITH Logo"
        className={`h-6 w-6  rounded-full object-left-bottom`}
        aria-hidden="true"
      />
      </div>
      <span className={`${sizeClasses[size]} font-bold ${isDark ? "text-gray-900" : "text-white"}`}>
        CRITH
      </span>
      <span className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        Education Cloud
      </span>
    </Link>
  );
};
