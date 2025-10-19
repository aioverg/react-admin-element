import { useMenuStore, usePublicStore, useTabsStore, useUserStore } from "@packages/store";

/**
 * 获取常用的状态数据
 */
export const useCommonStore = () => {
  // 权限
  const permissions = useUserStore((state) => state.permissions);
  // 用户信息
  const userInfo = useUserStore((state) => state.userInfo);
  // 导航数据
  const nav = useTabsStore((state) => state.nav);
  // 菜单是否折叠
  const collapsedMenu = useMenuStore((state) => state.collapsedMenu);
  // 是否重新加载
  const isRefresh = usePublicStore((state) => state.isRefresh);
  // 是否全屏
  const isFullscreen = usePublicStore((state) => state.isFullscreen);
  // 菜单打开的key
  const openKeys = useMenuStore((state) => state.openKeys);
  // 菜单选中的key
  const selectedKeys = useMenuStore((state) => state.selectedKeys);
  // 标签栏
  const tabs = useTabsStore((state) => state.tabs);
  // 主题
  const theme = usePublicStore((state) => state.theme);
  // 菜单数据
  const menuList = useMenuStore((state) => state.menuList);

  return {
    collapsedMenu,
    isRefresh,
    isFullscreen,
    nav,
    permissions,
    openKeys,
    selectedKeys,
    tabs,
    theme,
    menuList,
    userInfo,
  } as const;
};

export default useCommonStore;
