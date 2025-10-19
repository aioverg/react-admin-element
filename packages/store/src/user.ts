import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserInfo {
  id: number;
  username: string;
  roles: number[];
}

interface UserState {
  permissions: string[];
  userInfo: UserInfo | null;
  setPermissions: (permissions: string[]) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  clearInfo: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      permissions: [], // 权限列表
      // 用户信息
      userInfo: null,
      // 存储用户信息
      setUserInfo: (userInfo) => set({ userInfo }),
      // 存储权限
      setPermissions: (permissions) => set({ permissions }),
      // 清除用户信息
      clearInfo: () =>
        set({
          userInfo: null,
        }),
    }),
    {
      enabled: process.env.NODE_ENV === "development",
      name: "userStore",
    },
  ),
);
