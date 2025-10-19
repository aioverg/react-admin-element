import { MenuType } from "@packages/layouts";
import type { AliveController } from "react-activation";
import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TabsState {
  isCloseTabsLock: boolean;
  activeKey: string;
  nav: MenuType[];
  tabs: MenuType[];
  toggleCloseTabsLock: (isCloseTabsLock: boolean) => void;
  setActiveKey: (key: string) => void;
  setNav: (nav: MenuType[]) => void;
  addTabs: (tab: MenuType) => void;
  setTabs: (key: string, searchParams?: string) => void;
  sortTabs: (tabs: MenuType[]) => void;
  closeTabs: (tabKey: string, dropScope: AliveController["dropScope"]) => void;
  closeLeft: (tabKey: string, dropScope: AliveController["dropScope"]) => void;
  closeRight: (tabKey: string, dropScope: AliveController["dropScope"]) => void;
  closeOther: (tabKey: string, dropScope: AliveController["dropScope"]) => void;
  closeAllTab: () => void;
}

export const useTabsStore = create<TabsState>()(
  devtools(
    persist(
      (set) => ({
        nav: [],
        tabs: [],
        isCloseTabsLock: false,
        activeKey: "",
        toggleCloseTabsLock: (isCloseTabsLock) => set({ isCloseTabsLock }),
        setActiveKey: (key) => set({ activeKey: key }),
        setNav: (nav) => set({ nav }),
        // 新增
        addTabs: (tab) =>
          set((state) => {
            const { tabs } = state;
            const has = tabs.find((item) => item.key === tab.key);
            if (!has) tabs.push(tab);

            if (tabs.length) {
              tabs[0].closable = tabs.length > 1;
            }
            return { tabs };
          }),
        // 设置
        setTabs: (key, searchParams) =>
          set((state) => {
            const { tabs } = state;
            const aim = tabs.find((item) => item.key === key);
            if (aim) {
              // 设置表标签的搜索参数, 下次进入时可以拿到
              aim.urlParams = searchParams;
            }
            return { tabs };
          }),
        // 排序
        sortTabs: (tabs) => {
          set({ tabs: tabs });
        },
        // 关闭
        closeTabs: (tabKey, dropScope) =>
          set((state) => {
            const { tabs } = state;
            const index = tabs.findIndex((item) => item.key === tabKey);

            if (index >= 0) {
              tabs.splice(index, 1);
            }

            if (tabKey === state.activeKey) {
              let target = "";
              if (index < tabs.length) {
                target = tabs?.[index]?.key || "";
              } else {
                target = tabs[index - 1]?.key || "";
              }
              set({ activeKey: target, isCloseTabsLock: true });
            }

            // 如果 tab 大于1个, 第一个可以删除
            if (tabs.length) {
              tabs[0].closable = tabs.length > 1;
            }

            // 清除当前标签的keepalive缓存
            dropScope(tabKey);

            return { tabs };
          }),
        // 关闭标签左侧标签
        closeLeft: (tabKey, dropScope) =>
          set((state) => {
            const { tabs, activeKey } = state;

            const index = tabs.findIndex((item) => item.key === tabKey);
            if (index >= 0) {
              // 清除这些标签的keepalive缓存
              for (let i = 0; i < +index; i++) {
                const item = tabs[i];
                if (item.key !== tabKey) {
                  dropScope(item.key);
                }
              }
              tabs.splice(0, index);
            }

            // 如果当前标签不是指定标签, 跳转过去
            if (activeKey !== tabKey) {
              set({ isCloseTabsLock: true });
            }

            set({ activeKey: tabs[0]?.key || "" });

            if (tabs.length) {
              tabs[0].closable = tabs.length > 1;
            }

            return { tabs };
          }),
        // 关闭标签右侧标签
        closeRight: (tabKey, dropScope) =>
          set((state) => {
            const { tabs, activeKey } = state;

            const index = tabs.findIndex((item) => item.key === tabKey);
            if (index >= 0) {
              for (let i = +index + 1; i < tabs?.length; i++) {
                const item = tabs[i];
                if (item.key !== tabKey) {
                  dropScope(item.key);
                }
              }
              tabs.splice(index + 1, tabs.length - index - 1);
            }

            // 如果当前标签不是指定标签, 跳转过去
            if (activeKey !== tabKey) {
              set({ isCloseTabsLock: true });
            }
            set({ activeKey: tabs[tabs.length - 1]?.key || "" });

            if (tabs.length) {
              tabs[0].closable = tabs.length > 1;
            }

            return { tabs };
          }),

        // 关闭标签外的其他标签
        closeOther: (tabKey, dropScope) =>
          set((state) => {
            const { tabs, activeKey } = state;

            const reservedTabs: MenuType[] = [];
            tabs.forEach((i) => {
              if (i.key !== tabKey) {
                dropScope(i.key);
              } else {
                reservedTabs.push(i);
              }
            });

            const aim = reservedTabs.find((i) => i.key === activeKey);
            // 如果当前标签不是指定标签, 跳转过去
            if (!aim) {
              set({ isCloseTabsLock: true });
            }

            // 如果当前标签不是指定标签, 跳转过去
            if (activeKey !== tabKey) {
              set({ isCloseTabsLock: true });
            }

            if (reservedTabs.length) {
              reservedTabs[0].closable = reservedTabs.length > 1;
            }

            return {
              tabs: reservedTabs,
              activeKey: reservedTabs[0]?.key || "",
            };
          }),
        closeAllTab: () => {
          set({ tabs: [], activeKey: "" });

          return {
            tabs: [],
            activeKey: "",
          };
        },
      }),
      {
        name: "tabs_storage", // 存储中的项目名称，必须是唯一的
        storage: createJSONStorage(() => localStorage), // 使用sessionStorage作为存储
      },
    ),
    {
      enabled: process.env.NODE_ENV === "development",
      name: "tabsStore",
    },
  ),
);
