import type { TFunction } from "i18next";
import { globalConfig } from "@packages/utils";

// 金额格式化 3000 => 3,000
export function amountFormatter(num: number) {
  return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 设置浏览器标题
export function setTitle(t: TFunction, title: string) {
  const value = `${title ? title + "-" : ""}${globalConfig.PROJECT_NAME(t)}`;
  if (document.title === value) return;
  document.title = value;
}
