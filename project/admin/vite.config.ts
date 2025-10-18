import { defineConfig } from "vite";
import defaultConfig from "../../packages/viteConfig/src/index";

// https://vitejs.dev/config/
export default defineConfig((val) => ({
  // 其他配置
  ...defaultConfig(val),
}));
