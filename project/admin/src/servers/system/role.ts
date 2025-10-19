import type { Key, ReactNode } from "react";
import type { DataNode } from "antd/es/tree";
import { request } from "@/utils/request";

enum API {
  URL = "/system/role",
}

/**
 * 获取分页数据
 * @param data - 请求数据
 */
export function getRolePage(data: Partial<BaseFormData> & PaginationData) {
  return request.get<PageServerResult<BaseFormData[]>>(`${API.URL}/page`, { params: data });
}

/**
 * 获取权限列表
 * @param data - 搜索数据
 */
export interface PermissionData extends DataNode {
  icon: string | ReactNode;
  type: number;
  children?: PermissionData[];
}
export interface PermissionResult {
  treeData: PermissionData[];
  defaultCheckedKeys: Key[];
}
