import { useAliveController } from "react-activation";
import { useLocation, useNavigate } from "react-router-dom";
import { useToken } from "@packages/hooks";
import { useUserStore, useTabsStore } from "@packages/store";

// 退出登录
export const useLogout = () => {
  const [, , removeToken] = useToken();
  const { clear } = useAliveController();
  const { closeAllTab, setActiveKey } = useTabsStore((state) => state);
  const clearInfo = useUserStore((state) => state.clearInfo);
  const navigate = useNavigate();
  const location = useLocation();
  /** 退出登录 */
  const handleLogout = () => {
    clearInfo();
    closeAllTab();
    setActiveKey("");
    removeToken();
    clear(); // 清除keepalive缓存
    navigate(`/login?redirect=${location.pathname}${location.search}`);
  };

  return [handleLogout] as const;
};

export default useLogout;
