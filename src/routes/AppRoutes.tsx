import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { pages } from "./definitions";
import { Loading } from "../components/Loading/loading";
import Error404 from "../components/errors/_404";

const routeList = [
  { path: "/", element: pages.Landing },
  { path: "/signup", element: pages.SignUpPage },
];



const AppRoutes: React.FC = () => {

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {routeList.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
