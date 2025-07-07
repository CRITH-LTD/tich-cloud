import { RouteObject } from "react-router";
import { pathnames } from "./path-names";
import { layouts, pages } from "./definitions";
import PrivateRoute from "../components/Common/PrivateRoute";
import DashboardPage from "../pages/Dashboard/Dashboard.page";

export const routes: RouteObject[] = [
  {
    path: pathnames.LANDING,
    element: pages.Landing,
  },
  {
    path: pathnames.SIGN_UP,
    element: pages.SignUpPage,
  },
  {
    path: pathnames.SIGN_IN,
    element: pages.SignInPage,
  },
  {
    path: pathnames.DASHBOARD,
    element: (
      <PrivateRoute>
        <layouts.DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: pathnames.CRATE_UMS,
        element: pages.CreateUMSFragment,
      },
      {
        path: pathnames.UMS_PAGE,
        element: pages.UMSPage,
      },
      {
        path: pathnames.UMS_DETAIL_PAGE,
        element: pages.UMSDetailPage,
      },
       {
        path: pathnames.UMS_SETTINGS_PAGE,
        element: pages.UMSSettingsPage,
      }
    ],
  },
  {
    path: "*",
    element: pages.Error404 || <div>Ooops! Page not found.</div>,
  },
];
