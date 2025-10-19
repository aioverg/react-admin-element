import type { TFunction } from "i18next";

/**
 * 表格数据
 * @param optionRender - 渲染操作函数
 */
export const tableColumns = (t: TFunction, optionRender: TableOptions<object>): TableColumn[] => {
  return [
    {
      title: t("systems:user.id"),
      dataIndex: "id",
      width: 80,
      fixed: "left",
    },
    {
      title: t("systems:user.username"),
      dataIndex: "username",
      width: 100,
      fixed: "left",
    },
    {
      title: t("systems:user.name"),
      dataIndex: "name",
      width: 100,
    },
    {
      title: t("systems:user.state"),
      dataIndex: "status",
      width: 80,
    },
    {
      title: t("systems:user.rolesName"),
      dataIndex: "rolesName",
      width: 150,
      ellipsis: false,
    },
    {
      title: t("systems:user.phone"),
      dataIndex: "phone",
      width: 150,
    },
    {
      title: t("systems:user.email"),
      dataIndex: "email",
      width: 400,
    },
    {
      title: t("操作"),
      dataIndex: "operate",
      width: 80,
      fixed: "right",
      render: (value: unknown, record: object) => optionRender(value, record),
    },
  ];
};
