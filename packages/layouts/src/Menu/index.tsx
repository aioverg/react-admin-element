import type { MenuProps } from "antd";
import type { MenuType, PropsType } from "./types";
import type { ItemType, MenuItemType } from "antd/es/menu/interface";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Menu } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useCommonStore } from "@packages/hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { filterMenusByPermissions, getOpenMenuByRouter } from "./utils";
import styles from "./index.module.less";

const Component = (props: PropsType) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const [menus, setMenus] = useState<MenuType[]>([]);
  const { collapsedMenu, openKeys, selectedKeys, permissions, menuList } = useCommonStore();
  const [currentOpenKeys, setCurrentOpenKeys] = useState(openKeys || []);
  const [currentSelectedKeys, setCurrentSelectedKeys] = useState(
    selectedKeys ? [selectedKeys] : [],
  );

  // 点击菜单
  const onClickMenu: MenuProps["onClick"] = (e) => {
    setCurrentSelectedKeys([e.key]);
    navigate(e.key);
  };

  // 菜单图标
  const filterMenuIcon = useCallback((menus: MenuType[]) => {
    for (let i = 0; i < menus.length; i++) {
      if (menus[i]?.icon) {
        menus[i].icon = <ProfileOutlined icon={menus[i].icon as string} />;
      }

      if (menus[i]?.children?.length) {
        filterMenuIcon(menus[i].children as MenuType[]);
      }
    }
  }, []);

  // 处理菜单数据
  useEffect(() => {
    if (permissions.length > 0) {
      const newMenus = filterMenusByPermissions(menuList, permissions, t);
      filterMenuIcon(newMenus);
      setMenus(newMenus || []);
    }
  }, [permissions, menuList, filterMenuIcon, i18n.language]);

  useEffect(() => {
    const newOpenKey = getOpenMenuByRouter(pathname);
    setCurrentOpenKeys(newOpenKey);
    setCurrentSelectedKeys([pathname]);
  }, []);

  return useMemo(
    () => (
      <>
        <div
          style={{
            overflow: "auto",
            transitionProperty: "all",
            transitionDuration: "150ms",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          className={`
            ${styles.menu}
        `}
        >
          <Menu
            id="layout-menu"
            selectedKeys={currentSelectedKeys}
            openKeys={currentOpenKeys}
            defaultOpenKeys={currentOpenKeys}
            mode="inline"
            theme="dark"
            forceSubMenuRender
            inlineCollapsed={Boolean(collapsedMenu)}
            items={menus as ItemType<MenuItemType>[]}
            onClick={onClickMenu}
            onOpenChange={(val) => setCurrentOpenKeys(val)}
          />
        </div>
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentOpenKeys, currentSelectedKeys, collapsedMenu, menus],
  );
};

export default Component;
