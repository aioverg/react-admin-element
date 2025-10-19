import type { MenuType } from "@packages/layouts";

export const level: MenuType[] = [
  {
    label: "层级",
    key: "/level",
    icon: "fluent:box-20-regular",
    children: [
      {
        label: "层级1_1",
        key: "/level/level1_1",
        rule: "/level/level1_1",
      },
      {
        label: "层级1_2",
        key: "/level/level1_2",
        children: [
          {
            label: "层级1_2_1",
            key: "/level/level1_2/level1_2_1",
            rule: "/level/level1_2/level1_2_1",
          },
          {
            label: "层级1_2_2",
            key: "/level/level1_2/level1_2_2",
            rule: "/level/level1_2/level1_2_2",
          },
        ],
      },
    ],
  },
  {
    label: "动态路由",
    key: "/dynamic",
    icon: "fluent:box-20-regular",
  },
];
