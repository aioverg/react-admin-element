import type { TFunction } from "i18next";
import type { MessageInstance } from "antd/es/message/interface";
import { globalConfig } from "@packages/utils";
import axios from "axios";

// 版本检查
export const versionCheck = async (t: TFunction, messageApi: MessageInstance) => {
  if (import.meta.env.MODE === "development") return;

  try {
    const versionLocal = localStorage.getItem(globalConfig.VERSION_KEY);
    const {
      data: { version },
    } = await axios.get("version.json", {
      // 添加超时和强制刷新参数
      timeout: 5000,
      params: { t: Date.now() },
    });

    // 首次进入则缓存本地数据
    if (version && !versionLocal) {
      return localStorage.setItem(globalConfig.VERSION_KEY, String(version));
    }

    if (version && versionLocal !== String(version)) {
      localStorage.setItem(globalConfig.VERSION_KEY, String(version));
      // 存储定时器防止被垃圾回收
      let reloadTimer: ReturnType<typeof setTimeout> | null = null;

      messageApi.info({
        content: t("发现新内容，自动更新中..."),
        key: "reload",
        duration: 10,
        onClick: () => {
          // 用户点击消息时立即刷新
          if (reloadTimer) {
            clearTimeout(reloadTimer);
          }
          window.location.reload();
        },
      });

      // 自动刷新页面
      reloadTimer = setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  } catch (error) {
    console.error("版本检查失败:", error);
  }
};
