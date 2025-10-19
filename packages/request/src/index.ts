import type { RequestCancel } from "./types";
import { message } from "antd";
import { getLocalInfo } from "@packages/utils";
import axios from "axios";
import AxiosRequest from "./request";

// 异常处理
const handleError = (error: string, content?: string) => {
  message.error({
    content: content || error || "服务器错误",
    key: "error",
  });
};

// 创建请求
function creteRequest(url: string, tokenKey: string) {
  return new AxiosRequest({
    baseURL: url,
    timeout: 180 * 1000,
    interceptors: {
      // 检查 token
      requestInterceptors(res) {
        const tokenLocal = getLocalInfo(tokenKey) || "";
        if (res?.headers && tokenLocal) {
          res.headers.Authorization = `Authorization_${tokenLocal}` as string;
        }
        return res;
      },

      // 超时
      requestInterceptorsCatch(err) {
        message.error("请求超时！");
        return err;
      },

      // 响应
      responseInterceptors(res) {
        const { data } = res;

        // 错误处理
        if (data?.code !== 200) {
          handleError(data?.message);
          return res;
        }

        return res;
      },
      responseInterceptorsCatch(err) {
        // 取消重复请求不报错
        if (axios.isCancel(err)) {
          err.data = err.data || {};
          return err;
        }

        handleError((err as RequestCancel)?.response?.data?.message || "服务器错误！");
        return err;
      },
    },
  });
}

export { creteRequest };
export type * from "./types";
