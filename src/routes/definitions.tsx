import { ReactNode, lazy, FC } from "react";
import { LazyComponentWrapper } from "./util";

// --- Lazy Imports for Pages ---
export const lazyPages = {
  Landing: lazy(() => import("../pages/Landing/Landing.page")),
  SignUpPage: lazy(() => import("../pages/Auth/SignUp.page")),
  SignInPage: lazy(() => import("../pages/Auth/SignIn.page")),
  Error404: lazy(() => import("../components/errors/_404")),
  DashboardPage: lazy(() => import("../pages/Dashboard/Dashboard.page")),
  CreateUMSFragment: lazy(() => import("../pages/Dashboard/CreateUMS.fragment")),
  UMSPage: lazy(() => import("../pages/Dashboard/UMSPage")),
  UMSDetailPage: lazy(() => import("../pages/Dashboard/UMSCreationSteps/UMSDetail/UMSDetailPage")),
  UMSSettingsPage: lazy(() => import("../pages/Dashboard/UMSCreationSteps/UMSSettings/UMSSettingsPage")),
  
} as const;

// --- Lazy Layouts (separate from pages) ---
export const layouts = {
  DashboardLayout: lazy(() => import("../pages/Dashboard/Dashboard.layout")),
};

// --- Types ---
type LazyPages = typeof lazyPages;
type PageKeys = keyof LazyPages;
type PageObject = Record<PageKeys, ReactNode>;

type LayoutGroup = Array<{
  layout: FC<{ children?: ReactNode }>;
  children: PageKeys[];
}>;

// --- Layout Mapping ---
export const LayoutDefinitionGroups: LayoutGroup = [
  {
    layout: layouts.DashboardLayout,
    children: ["DashboardPage"],
  },
];

// --- Animation Exclusions ---
const animationExclude: Partial<Record<PageKeys, boolean>> = {
  // Add keys here if any should skip animation
};

// --- Build Pages with Layouts Applied ---
export const pages: PageObject = Object.entries(lazyPages).reduce((acc, [key, Component]) => {
  const nodeKey = key as PageKeys;

  const wrapped = (
    <LazyComponentWrapper
      childNode={<Component />}
      animated={!animationExclude[nodeKey]}
    />
  );

  const layoutGroup = LayoutDefinitionGroups.find(group => group.children.includes(nodeKey));

  acc[nodeKey] = layoutGroup
    ? <layoutGroup.layout>{wrapped}</layoutGroup.layout>
    : wrapped;

  return acc;
}, {} as PageObject);
