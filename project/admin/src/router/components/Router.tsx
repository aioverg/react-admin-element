import type { RouteObject } from "react-router-dom";
import type { DefaultComponent } from "@loadable/component";
import { useEffect, lazy } from "react";
import { handleRoutes } from "../utils/helper";
import { useLocation, useRoutes } from "react-router-dom";
import nprogress from "nprogress";
import Guards from "./Guards";

// 解决动态导入和静态导入打包时的冲突
const Login = lazy(() => import("@/pages/login"));
const Forget = lazy(() => import("@/pages/forget"));
const NotFound = lazy(() => import("@/pages/404"));

type PageFiles = Record<string, () => Promise<DefaultComponent<unknown>>>;
const pages = import.meta.glob("../../pages/**/*.tsx") as PageFiles;
const layouts = handleRoutes(pages);

const newRoutes: RouteObject[] = [
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "forget",
    element: <Forget />,
  },
  {
    path: "",
    element: <Guards />,
    children: layouts,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

function App() {
  const location = useLocation();

  // 顶部进度条
  useEffect(() => {
    nprogress.start();
  }, []);

  useEffect(() => {
    nprogress.done();

    return () => {
      nprogress.start();
    };
  }, [location]);

  return <>{useRoutes(newRoutes)}</>;
}

export default App;
