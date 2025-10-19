import { useLogout, useToken, useCommonStore } from "@packages/hooks";
import { Suspense, useCallback, useEffect, useState, lazy } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { Skeleton, message } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { useMenuStore, useUserStore } from "@packages/store";
import KeepAlive from "react-activation";
import { LayoutHead, LayoutTab, LayoutMenu, LayoutError, versionCheck } from "@packages/layouts";
const Forbidden = lazy(() => import("@/pages/403"));
import styles from "./index.module.less";
import { getMenuList } from "@/servers/system/menu";
import { getUserRefreshPermissions } from "@/servers/system/user";

function Layout() {
  const [getToken] = useToken();
  const [handleLogout] = useLogout();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const token = getToken();
  const outlet = useOutlet();
  const [isLoading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const { setPermissions, setUserInfo, userInfo } = useUserStore((state) => state);
  const { setMenuList } = useMenuStore((state) => state);

  const { permissions, collapsedMenu, isRefresh } = useCommonStore();

  // 隐藏侧边栏
  const hiddenLeft = (() => {
    if (["/403"].includes(pathname)) {
      return true;
    } 
      return false;
    
  })();

  // 获取用户信息和权限, 并存储
  const getUserInfo = useCallback(async () => {
    try {
      setLoading(true);
      const { code, data } = await getUserRefreshPermissions({
        refresh_cache: false,
      });
      if (Number(code) !== 200) return;
      const { user, permissions } = data;
      setUserInfo(user);
      setPermissions(permissions);
    } catch (err) {
      console.error("获取用户信息:", err);
      handleLogout();
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 获取菜单数据
  const getMenuData = useCallback(async () => {
    try {
      setLoading(true);
      const { code, data } = await getMenuList();
      if (Number(code) !== 200) return;
      setMenuList(data || []);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 已经登录但用户信息还没有获取(一般用于刷新页面, 重新获取用户信息)
    if (token && !userInfo) {
      getUserInfo();
      getMenuData();
    }
  }, [getUserInfo, getMenuData, token]);

  // 监测是否需要刷新
  useEffect(() => {
    versionCheck(t, messageApi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="layout">
      {contextHolder}
      <div
        className={`
          ${styles.layout_left}
          ${collapsedMenu ? styles.layout_left_collapsed : ""}
          ${hiddenLeft ? styles.layout_left_hidden : ""}
      `}
      >
        <LayoutMenu />
      </div>

      <div
        className={`
          ${styles.layout_right}
          ${collapsedMenu ? styles.layout_left_collapsed_right : ""}
          ${hiddenLeft ? styles.layout_left_hidden_right : ""}
      `}
      >
        <div
          className={`
            ${styles.layout_right_header}
            ${collapsedMenu ? styles.layout_right_collapsed_right_header : ""}
            ${hiddenLeft ? styles.layout_right_hidden_right_header : ""}
        `}
        >
          <LayoutHead />
        </div>
        <div
          className={`
            ${styles.layout_right_tab}
            ${collapsedMenu ? styles.layout_right_collapsed_right_tab : ""}
            ${hiddenLeft ? styles.layout_right_hidden_right_tab : ""}
        `}
        >
          <LayoutTab />
        </div>

        <div
          style={{ overflow: "auto" }}
          className={`global_transition_all ${styles.layout_right_contont}`}
        >
          {isLoading && permissions.length === 0 && (
            <Skeleton active style={{ padding: "30px" }} paragraph={{ rows: 10 }} />
          )}
          {!isLoading && permissions.length === 0 && <Forbidden />}
          {isRefresh && (
            <div style={{ position: "absolute", left: "50%", top: "50%" }}>
              <Loading3QuartersOutlined
                style={{ fontSize: "40px" }}
                className="global_rotate_360"
              />
            </div>
          )}

          {permissions.length > 0 && (
            <LayoutError key={pathname}>
              {/* 限制最多缓存10个页面，避免过多导致卡顿 */}
              <KeepAlive id={pathname} name={pathname} max={10} strategy="LRU">
                <div
                  style={{
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                  }}
                >
                  <Suspense
                    fallback={
                      <div style={{ padding: "30px" }}>
                        <Skeleton active paragraph={{ rows: 10 }} />
                      </div>
                    }
                  >
                    {outlet}
                  </Suspense>
                </div>
              </KeepAlive>
            </LayoutError>
          )}
        </div>
      </div>
    </div>
  );
}

export default Layout;
