import { setLocalInfo, getLocalInfo, removeLocalInfo } from "@packages/utils";
import { config } from "@packages/utils";

// token
export function useToken() {
  // 获取token
  const getToken = () => {
    return getLocalInfo<string>(config.TOKEN_KEY) || "";
  };

  // 设置token
  const setToken = (value: string) => {
    setLocalInfo(config.TOKEN_KEY, value);
  };

  // 删除token
  const removeToken = () => {
    removeLocalInfo(config.TOKEN_KEY);
  };

  return [getToken, setToken, removeToken] as const;
}

export default useToken;
