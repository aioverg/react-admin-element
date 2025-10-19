import type { MenuType } from "@packages/layouts";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
interface MenuState {
  collapsedMenu: boolean; // 折叠菜单
  selectedKeys: string; // 菜单选中值
  openKeys: string[]; // 菜单展开项
  menuList: MenuType[]; // 菜单列表数据
  setToggleCollapsed: (collapsedMenu: boolean) => void;
  setSelectedKeys: (selectedKeys: string) => void;
  setOpenKeys: (openKeys: string[]) => void;
  setMenuList: (menuList: MenuType[]) => void;
}

export const useMenuStore = create<MenuState>()(
  devtools(
    (set) => ({
      collapsedMenu: false,
      selectedKeys: "dashboard",
      openKeys: ["Dashboard"],
      menuList: [],
      setToggleCollapsed: (collapsedMenu: boolean) => set({ collapsedMenu }),
      setSelectedKeys: (selectedKeys: string) => set({ selectedKeys }),
      setOpenKeys: (openKeys: string[]) => set({ openKeys }),
      setMenuList: (menuList: MenuType[]) => set({ menuList }),
    }),
    {
      enabled: process.env.NODE_ENV === "development",
      name: "menuStore",
    },
  ),
);
