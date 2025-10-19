import { useEffect, useCallback, useState } from "react";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { setTitle } from "@packages/utils";
import { getTabTitle } from "../Menu/utils";
import { useShallow } from "zustand/react/shallow";
import { useLocation } from "react-router-dom";
import { useTabsStore } from "@packages/store";
import { globalConfig } from "@packages/utils";

export type Langs = "zh" | "en";

function I18n() {
  // 下拉菜单内容
  const items: MenuProps["items"] = [
    {
      key: "zh",
      label: <span>简体中文</span>,
    },
    {
      key: "en",
      label: <span>English</span>,
    },
    {
      key: "vn",
      label: <span>越南</span>,
    },
  ];

  const { t, i18n } = useTranslation();
  const { pathname, search } = useLocation();
  const { tabs } = useTabsStore(useShallow((state) => state));
  const [lang, setLang] = useState(
    localStorage.getItem(globalConfig.LANG_KEY) || globalConfig.DEFAULT_LANG,
  );

  useEffect(() => {
    // 本地缓存的语言
    const lcalLang = localStorage.getItem(globalConfig.LANG_KEY);

    // i18正在使用的语言
    const il8nLang = i18n.language;

    if (!lcalLang) {
      localStorage.setItem(globalConfig.LANG_KEY, globalConfig.DEFAULT_LANG);
      i18n.changeLanguage(globalConfig.DEFAULT_LANG);
    } else if (il8nLang !== lcalLang) {
      i18n.changeLanguage(lcalLang);
      setLang(il8nLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 设置浏览器标签名
  const handleSetTitle = useCallback(() => {
    const path = `${pathname}${search || ""}`;
    // 通过路由获取标签名
    const aimMenu = getTabTitle(tabs, path);
    if (aimMenu) setTitle(t, t(aimMenu.i18nkey || aimMenu.label));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 切换语言
  const onClick: MenuProps["onClick"] = (e) => {
    i18n.changeLanguage(e.key as Langs);
    localStorage.setItem(globalConfig.LANG_KEY, e.key);
    setLang(e.key);
    handleSetTitle();
  };

  return (
    <Dropdown placement="bottom" trigger={["click"]} menu={{ items, onClick }}>
      <div
        className="ant-dropdown-link"
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={(e) => e.preventDefault()}
      >
        {items.find((i) => i?.key === lang)?.label}
        <DownOutlined />
      </div>
    </Dropdown>
  );
}

export default I18n;
