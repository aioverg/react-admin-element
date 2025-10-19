import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { message } from "antd";
import { getLocalInfo } from "@packages/utils";
import { globalConfig } from "@packages/utils";
import { Spin } from "antd";
import nprogress from "nprogress";
import Layout from "@/layouts";

// 路由导航
function Guards() {
  const { t } = useTranslation();
  const outlet = useOutlet();
  const navigate = useNavigate();
  const location = useLocation();

  // 同步检查权限，避免异步导致的页面闪动
  // passed 是否校验通过
  // isRedirect 是否重定向
  // redirectPath 重定向地址
  const { passed, isRedirect, redirectPath } = useMemo(() => {
    const token = getLocalInfo<string>(globalConfig.TOKEN_KEY) || null;
    const isLoginPage = location.pathname === "/login";

    // 有token且访问登录页，重定向到首页
    if (token && isLoginPage) {
      const redirect = new URLSearchParams(location.search).get("redirect");
      return {
        passed: false,
        isRedirect: true,
        redirectPath: redirect || "/",
      };
    }

    // 无token且访问非登录页, 重定向到登录页
    if (!token && !isLoginPage) {
      const param =
        location.pathname?.length > 1 ? `?redirect=${location.pathname}${location.search}` : "";
      return {
        passed: false,
        isRedirect: true,
        redirectPath: `/login${param}`,
      };
    }

    // 其他情况正常渲染
    return {
      passed: !!token || isLoginPage,
      isRedirect: false,
      redirectPath: "",
    };
  }, [location.pathname, location.search]);

  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    nprogress.start();

    if (isRedirect) {
      // 执行重定向
      navigate(redirectPath, { replace: true });
      setRedirected(true);

      // 如果重定向到登录页, 显示提示信息
      if (redirectPath.startsWith("/login") && location.pathname !== "/") {
        message.warning({
          content: t("未登录无法访问"),
          key: "noLoginVisit",
        });
      }

      nprogress.done();

      return;
    }

    nprogress.done();

    return () => {
      nprogress.start();
    };
  }, [isRedirect, redirectPath, navigate]);

  // 重定向时不渲染任何内容
  if (isRedirect || redirected) {
    return <Spin spinning={true} />;
  }

  // 渲染页面
  const renderPage = () => {
    // 校验通过, 且访问登录页, 但 useEffect 还没执行跳转时
    if (location.pathname === "/login" && passed) {
      return <div>{outlet}</div>;
    }

    // 校验通过, 且访问其他页面, 渲染布局
    if (passed) {
      return <Layout />;
    }

    // 无权限或跳转情况，渲染登录页
    return <div>{outlet}</div>;
  };

  return <>{renderPage()}</>;
}

export default Guards;
