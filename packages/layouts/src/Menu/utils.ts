import type { MenuType } from "./types";
import type { TFunction } from "i18next";
import { cloneDeep } from "lodash";

// 检查路由权限
function hasPermission(route: MenuType, permissions: string[]): boolean {
  return true;
  return permissions?.includes(route?.rule || "");
}

// 获取路由数组
export function splitPath(pathname: string): string[] {
  if (!pathname || typeof pathname !== "string") {
    return [];
  }

  const arr = pathname?.split("/") || [];

  if (arr?.[0] === "") {
    arr.shift();
  }

  return arr;
}

// 根据路由获取展开数组
export function getOpenMenuByRouter(pathname: string): string[] {
  const pathnameArr = splitPath(pathname);
  const routerArr: Array<string> = [];
  pathnameArr.forEach((i) => {
    routerArr.push(`${routerArr[0] || ""}/${i}`);
  });
  return routerArr;
}

// 根据权限过滤菜单
export function filterMenusByPermissions(
  menus: MenuType[],
  permissions: string[],
  t: TFunction,
): MenuType[] {
  const result: MenuType[] = [];
  const copyMenus = cloneDeep(menus);

  for (let i = 0; i < copyMenus.length; i++) {
    const item = copyMenus[i];
    if (item?.children?.length) {
      const result = filterMenusByPermissions(item.children, permissions, t);

      item.children = result?.length ? result : undefined;
    }

    if (hasPermission(item, permissions) || item?.children?.length) {
      if (item.i18nkey) {
        item.label = t(item.i18nkey);
      }

      result.push(item);
    }
  }

  return result;
}

// 根据 key 获取菜单及及父级菜单
export function getMenuByKey(data: {
  menus: MenuType[]; // 菜单列表
  permissions: Array<string>; // 权限列表
  key: string; // 菜单 key 值
}): { cur: MenuType[] | null; level: MenuType[] | null } | undefined {
  const { menus, permissions = [], key } = data;

  let curMenu = null;
  let levelMenu = null;
  const tier = (menus: MenuType[], key: string, level: MenuType[]) => {
    for (const i of menus) {
      if (i.key === key) {
        curMenu = i;
        levelMenu = [...level, i];
        break;
      } else if (i?.children?.length) {
        tier(i.children, key, [...level, i]);
      }
    }
  };
  tier(menus, key, []);
  return {
    cur: curMenu,
    level: levelMenu,
  };
}

// 根据路由获取菜单名
export const getTabTitle = (tabs: MenuType[], path: string): MenuType | null => {
  for (let i = 0; i < tabs?.length; i++) {
    const item = tabs[i];

    if (item.key === path) {
      return item;
    }
  }

  return null;
};
