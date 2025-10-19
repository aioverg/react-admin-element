import type { TFunction } from "i18next";

export const globalConfig = {
  TOKEN_KEY: "token", // token 在localStorage中的键值
  LANG_KEY: "lang", // 语言 在localStorage中的键值
  VERSION_KEY: "version", // 版本 在localStorage中的键值
  THEME_KEY: "theme", // 主题 在localStorage中的键值

  EMPTY_PLACEHOLDER: "-", // 空值占位
  // 分页默认值
  PAGINATION: {
    page: 1,
    pageSize: 20,
  },

  DEFAULT_LANG: "en", // 默认语言

  PROJECT_NAME: (t: TFunction) => t("comm.systemName"),
};
