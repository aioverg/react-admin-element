import { ReactNode } from "react";

export type MenuType = {
  key: string;
  label: string;
  i18nkey?: string; // 多语言编码
  icon?: string | ReactNode;
  rule?: string;
  urlParams?: string; // 参数
  closable?: boolean; // 是否允许关闭
  children?: MenuType[];
};

// 组件参数
export type PropsType = {};
