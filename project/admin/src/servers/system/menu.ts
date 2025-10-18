import { request } from "@/utils/request";
import localMenus from "@/menus";
import { MenuType } from "@packages/layouts";

enum API {
  URL = "/system/menu",
}

/**
 * 获取分页数据
 * @param data - 请求数据
 */
export function getMenuPage(data: Partial<BaseFormData> & PaginationData) {
  return request.get<PageServerResult<BaseFormData[]>>(`${API.URL}/page`, {
    params: data,
  });
}

/**
 * 获取当前菜单数据
 * @param data - 请求数据
 */
export function getMenuList() {
  return Promise.resolve({
    code: 200,
    data: localMenus,
  });
  return request.get<MenuType[]>(`${API.URL}/list`);
}
