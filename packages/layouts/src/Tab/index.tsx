import type { TabsProps } from "antd";
import {
  type DragEndEvent,
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import DraggableTabNode, { type DraggableTabPaneProps } from "./components/Node";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { getMenuByKey, getTabTitle } from "../Menu/utils";
import { message, Tabs, Dropdown } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAliveController } from "react-activation";
import { useDropdownMenu } from "./hooks";
import { useCommonStore } from "@packages/hooks";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import { setTitle } from "@packages/utils";
import TabRefresh from "./components/ReFresh";
import TabOptions from "./components/Drop";
import { usePublicStore, useTabsStore } from "@packages/store";

function LayoutTabs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { refresh, dropScope } = useAliveController();
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });
  const [messageApi, contextHolder] = message.useMessage();
  const [refreshTime, seRefreshTime] = useState<null | NodeJS.Timeout>(null);
  const timer = useRef<null | NodeJS.Timeout>(null);
  const setRefresh = usePublicStore((state) => state.setRefresh);
  const {
    tabs,
    isCloseTabsLock,
    activeKey, // 选中的标签值
    setActiveKey,
    addTabs,
    sortTabs,
    closeTabs,
    setNav,
    toggleCloseTabsLock,
  } = useTabsStore(useShallow((state) => state));

  const { permissions, menuList } = useCommonStore();

  // 更新 nav 面包屑
  const updateNav = (key) => {
    const menuByKeyProps = {
      menus: menuList,
      permissions,
      key,
    };
    const menu = getMenuByKey(menuByKeyProps);
    if (menu?.cur?.key) {
      setNav(menu.level);
    }
  };

  // 添加标签
  const handleAddTab = useCallback(
    (path = pathname) => {
      // 当值为空时匹配路由
      if (path === "/") return;
      const menuByKeyProps = {
        menus: menuList,
        permissions,
        key: path,
      };

      const menu = getMenuByKey(menuByKeyProps);
      if (menu?.cur?.key) {
        setActiveKey(menu.cur.key);
        addTabs(menu.cur);
      } else {
        setActiveKey(path);
      }
      updateNav(path);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, menuList],
  );

  // 设置浏览器标签名
  const handleSetTitle = useCallback(() => {
    const aimMenu = getTabTitle(tabs, pathname);
    if (aimMenu) setTitle(t, t(aimMenu.i18nkey || aimMenu.label));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 刷新当前标签
  const onClickRefresh = useCallback(
    (key = activeKey) => {
      if (typeof key !== "string") return;

      if (!timer.current) {
        setRefresh(true);
        refresh(key);

        timer.current = setTimeout(() => {
          messageApi.success({
            content: t("刷新成功"),
            key: "refresh",
          });
          setRefresh(false);
          timer.current = null;
        }, 100);

        seRefreshTime(
          setTimeout(() => {
            seRefreshTime(null);
          }, 1000),
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeKey, timer],
  );

  // 编辑标签
  const onEdit: TabsProps["onEdit"] = (targetKey, action) => {
    // 移除
    if (action === "remove") {
      closeTabs(targetKey as string, dropScope);
    }
  };

  // 重新渲染操作
  const RefreshRender = useMemo(() => {
    return <TabRefresh isRefresh={!!refreshTime} onClick={onClickRefresh} />;
  }, [refreshTime, onClickRefresh]);

  // 更多操作
  const TabOptionsRender = useMemo(() => {
    return <TabOptions activeKey={activeKey} handleRefresh={onClickRefresh} />;
  }, [activeKey, onClickRefresh]);

  // 标签栏功能
  const tabOptions = [{ element: RefreshRender }, { element: TabOptionsRender }];

  // 下拉菜单
  const dropdownMenuParams = { activeKey, handleRefresh: onClickRefresh };
  const [items, onClick] = useDropdownMenu(dropdownMenuParams);

  useEffect(() => {
    handleSetTitle();

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }

      if (refreshTime) {
        clearTimeout(refreshTime);
        seRefreshTime(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeKey === pathname) {
      return;
    }
    const key = isCloseTabsLock ? activeKey : pathname;
    handleSetTitle();

    // 如果是关闭标签
    if (isCloseTabsLock) {
      toggleCloseTabsLock(false);
      updateNav(key);
      navigate(key);
    } else {
      handleAddTab(key);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, pathname]);

  // 拖拽结束
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const oldIndex = tabs.findIndex((item) => item.key === active.id);
      const newIndex = tabs.findIndex((item) => item.key === over?.id);
      const newTabs = arrayMove(tabs, oldIndex, newIndex);
      sortTabs(newTabs);
    }
  };

  // 封装标签
  const renderTabBar: TabsProps["renderTabBar"] = (tabBarProps, DefaultTabBar) => (
    <DndContext sensors={[sensor]} onDragEnd={onDragEnd} collisionDetection={closestCenter}>
      <SortableContext items={tabs.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
        <DefaultTabBar {...tabBarProps}>
          {(node) => (
            <DraggableTabNode
              {...(node as React.ReactElement<DraggableTabPaneProps>).props}
              key={node.key}
            >
              <div>
                <Dropdown
                  menu={{
                    items: items(node.key as string),
                    onClick: (e) => onClick(e.key, node.key as string),
                  }}
                  trigger={["contextMenu"]}
                >
                  {node}
                </Dropdown>
              </div>
            </DraggableTabNode>
          )}
        </DefaultTabBar>
      </SortableContext>
    </DndContext>
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "0 0 0 0.5rem",
        justifyContent: "space-between",
      }}
      className="global_transition_all"
    >
      {contextHolder}
      {tabs.length > 0 ? (
        <Tabs
          hideAdd
          style={{
            flex: "1",
            height: "40px",
          }}
          items={tabs.map((i) => ({
            ...i,
            label: t(i.i18nkey || i.label),
            icon: null,
          }))}
          onChange={(key) => navigate(key)}
          activeKey={activeKey}
          type="editable-card"
          onEdit={onEdit}
          renderTabBar={renderTabBar}
        />
      ) : (
        <div></div>
      )}

      <div style={{ display: "flex" }}>
        {tabOptions?.map((item, index) => (
          <div
            key={index}
            style={{
              width: "36px",
              height: "36px",
              borderLeft: "1px solid #dee3e3ff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item.element}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LayoutTabs;
