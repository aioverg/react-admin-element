import { useEffect, useMemo } from "react";
import { App } from "antd";
import { useTranslation } from "react-i18next";
import { HashRouter } from "react-router-dom";
import nprogress from "nprogress";
import RouterPage from "./components/Router";

// 缓存
import { AliveScope } from "react-activation";

// antd
import { theme, ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import enUS from "antd/es/locale/en_US";

// 禁止进度条添加loading
nprogress.configure({ showSpinner: false });

// antd主题
const { defaultAlgorithm, darkAlgorithm } = theme;

import { useCommonStore } from "@packages/hooks";

function Page() {
  const { i18n } = useTranslation();
  const { theme } = useCommonStore();
  const antdConfig = useMemo(
    () => ({
      lang: {
        ch: zhCN,
        en: enUS,
      },
      theme: {
        light: defaultAlgorithm,
        dark: darkAlgorithm,
      },
    }),
    [],
  );
  // 获取当前语言
  const curLang = i18n.language as unknown as "ch" | "en";

  useEffect(() => {
    // 关闭loading
    const firstElement = document.getElementById("first");
    if (firstElement && firstElement.style?.display !== "none") {
      firstElement.style.display = "none";
    }
  }, []);

  return (
    <HashRouter>
      <ConfigProvider
        locale={antdConfig.lang[curLang] || antdConfig.lang.ch}
        theme={{
          algorithm: [antdConfig.theme[theme] || antdConfig.theme.light],
        }}
      >
        <App>
          <AliveScope>
            <RouterPage />
          </AliveScope>
        </App>
      </ConfigProvider>
    </HashRouter>
  );
}

export default Page;
