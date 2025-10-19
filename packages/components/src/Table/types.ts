import type { ReactNode } from "react";
import type { ColumnType } from "antd/es/table";

export type EnumShowType = "text" | "tag";

// 表格列表枚举
export interface ColumnsEnum {
  label: string;
  value: unknown;
  color?: string;
  type?: EnumShowType;
}

// 表格列数据
export interface TableColumn<T = object> extends ColumnType<T> {
  enum?: ColumnsEnum[] | Record<string, unknown>;
  children?: TableColumn<T>[];
  isKeepFixed?: boolean; // 手机端默认关闭fixed，该属性开启fixed
}

// 表格操作
export type TableOptions<T = object> = (value: unknown, record: T, index?: number) => ReactNode;
