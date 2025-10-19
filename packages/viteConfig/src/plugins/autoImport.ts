import type { PluginOption } from "vite";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";

// 自动导入
export const autoImportPlugin = (): PluginOption => {
  return AutoImport({
    dirs: [
      "src/utils/permissions.ts",
      "src/utils/config.ts",
      // "src/components/**",
    ],
    imports: [
      "react",
      "react-i18next",
      // "react-router",
      // "react-router-dom",
    ],
    dts: "types/autoImports.d.ts",
    include: [/\.[tj]sx?$/],
    resolvers: [
      (name) => {
        // 处理 @/ 开头的路径别名
        if (name.startsWith("@/")) {
          return {
            from: name.replace("@/", path.resolve(__dirname, "src/") + "/"),
          };
        }
      },
    ],
  });
};
