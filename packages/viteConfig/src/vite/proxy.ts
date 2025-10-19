import type { ProxyOptions } from "vite";

type ProxyList = [string, string][];

type ProxyTargetList = Record<string, ProxyOptions>;

// 生成跨域配置
export function createProxy(list: ProxyList = []) {
  const res: ProxyTargetList = {};

  for (const [prefix, target] of list) {
    res[`^${prefix}`] = {
      target,
      changeOrigin: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ""),
    };
  }

  return res;
}
