import type { MenuType } from "@packages/layouts";
import { level } from "./level";

// 本地默认的菜单, 也可以通过接口动态获取, 见 getMenuList Api
export const localMenus: MenuType[] = [
  {
    label: "首页",
    i18nkey: "menus.home",
    icon: "fluent:box-20-regular",
    key: "/home",
    rule: "/home",
  },
  ...(level as MenuType[]),
  {
    label: "系统管理",
    icon: "ion:settings-outline",
    i18nkey: "menus.system",
    key: "/system",
    children: [
      {
        label: "用户管理",
        icon: null,
        key: "/system/user",
        rule: "/authority/user",
      },
      {
        label: "菜单管理",
        icon: null,
        key: "/system/menu",
        rule: "/authority/menu",
      },
      {
        label: "角色管理",
        icon: null,
        key: "/system/role",
        rule: "/authority/role",
      },
    ],
  },
];

export default localMenus;
