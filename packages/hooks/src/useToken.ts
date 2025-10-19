import { setLocalInfo, getLocalInfo, removeLocalInfo } from "@packages/utils";
import { globalConfig } from "@packages/utils";

// token
export function useToken() {
  // 获取token
  const getToken = () => {
    return getLocalInfo<string>(globalConfig.TOKEN_KEY) || "";
  };

  // 设置token
  const setToken = (value: string) => {
    setLocalInfo(globalConfig.TOKEN_KEY, value);
  };

  // 删除token
  const removeToken = () => {
    removeLocalInfo(globalConfig.TOKEN_KEY);
  };

  return [getToken, setToken, removeToken] as const;
}

export default useToken;
