import type { MenuProps } from "antd";
import { useRef } from "react";
import { App, Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { useCommonStore } from "@packages/hooks";
import { useMenuStore } from "@packages/store";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  FormOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Fullscreen } from "@packages/components";
import { LayoutTheme } from "@packages/layouts";
import { Password, PasswordModal } from "@packages/components";
import LayoutNav from "../Nav";
import LayoutLang from "../Lang";
import { useLogout } from "@packages/hooks";

type MenuKey = "password" | "logout";
type PropsType = {};

const Compnent = (props: PropsType) => {
  const [handleLogout] = useLogout();
  const { t } = useTranslation();
  const { modal } = App.useApp();
  const { collapsedMenu, userInfo, nav } = useCommonStore();
  const passwordRef = useRef<PasswordModal>(null);
  const setToggleCollapsed = useMenuStore((state) => state.setToggleCollapsed);

  // 操作菜单
  const items: MenuProps["items"] = [
    {
      key: "password",
      label: <span>{t("修改密码")}</span>,
      icon: <FormOutlined />,
    },
    {
      key: "logout",
      label: <span>{t("退出登录")}</span>,
      icon: <LogoutOutlined />,
    },
  ];

  // 点击菜单
  const onClick: MenuProps["onClick"] = (e) => {
    switch (e.key as MenuKey) {
      case "password":
        passwordRef.current?.open();
        break;

      case "logout":
        onLogout();
        break;

      default:
        break;
    }
  };

  // 退出登录
  const onLogout = () => {
    modal.confirm({
      title: t("温馨提示"),
      icon: <ExclamationCircleOutlined />,
      content: t("是否确定退出系统？"),
      onOk() {
        handleLogout();
      },
    });
  };

  return (
    <>
      <header
        style={{
          display: "flex",
          borderBottom: "1px solid #eee",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 1.5rem",
          transitionProperty: "all",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDuration: "150ms",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* 折叠菜单 */}
          <div
            style={{ marginRight: "6px", cursor: "pointer" }}
            onClick={() => setToggleCollapsed(!collapsedMenu)}
          >
            {collapsedMenu && <MenuUnfoldOutlined />}
            {!collapsedMenu && <MenuFoldOutlined />}
          </div>
          {/* 导航面包屑 */}
          <LayoutNav data={nav} />
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {/* 切换全屏 */}
          <Fullscreen />
          {/* 切换语言 */}
          <LayoutLang />
          {/* 切换主题 */}
          <LayoutTheme />

          {/* 用户信息及操作 */}
          <Dropdown menu={{ items, onClick }}>
            <div
              className="ant-dropdown-link"
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={(e) => e.preventDefault()}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "27px",
                  height: "27px",
                  textAlign: "center",
                  lineHeight: "27px",
                  borderRadius: "50%",
                  background: "gray",
                  color: "#fff",
                }}
              >
                ico
              </span>
              <span
                style={{
                  fontSize: "15px",
                  minWidth: "50px",
                  marginLeft: "0.5rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userInfo?.username || "-"}
              </span>
            </div>
          </Dropdown>
        </div>
      </header>

      <Password passwordRef={passwordRef} />
    </>
  );
};

export default Compnent;
