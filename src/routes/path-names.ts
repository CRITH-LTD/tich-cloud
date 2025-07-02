export const pathnames = {
  LANDING: "/",
  SIGN_UP: "/signup",
  SIGN_IN: "/signin",
  DASHBOARD: "/dashboard",
  CRATE_UMS: "/dashboard/create-ums",
  UMS_PAGE: "/dashboard/ums",
  UMS_DETAIL_PAGE: "/dashboard/ums/:id",
} as const;

export type PathKey = keyof typeof pathnames;
export type PathValue = (typeof pathnames)[PathKey];
