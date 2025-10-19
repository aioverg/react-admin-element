import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCommonStore } from "@packages/hooks";

function Page() {
  const { permissions, menuList } = useCommonStore();
  const navigate = useNavigate();

  /** 跳转第一个有效菜单路径 */
  const goFirstMenu = useCallback(() => {
    navigate("/home");
  }, [menuList, navigate, permissions]);

  useEffect(() => {
    // 跳转第一个有效菜单路径
    goFirstMenu();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuList, permissions]);

  return <div></div>;
}

export default Page;
