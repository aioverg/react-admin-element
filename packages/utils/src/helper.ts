import type { TFunction } from "i18next";
import { config } from "@packages/utils";

/**
 * 金额格式化3000->3,000
 * @param amount - 金额
 */
export function amountFormatter(amount: number) {
  return `${amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 设置浏览器标题
export function setTitle(t: TFunction, title: string) {
  const value = `${title ? title + "-" : ""}${config.PROJECT_NAME(t)}`;
  if (document.title === value) return;
  document.title = value;
}
