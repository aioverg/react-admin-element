import type { TFunction } from "i18next";
import type { TableOptions, TableColumn } from "#/public";

/**
 * 表格数据
 * @param optionRender - 渲染操作函数
 */
export const tableColumns = (t: TFunction, optionRender: TableOptions<object>): TableColumn[] => {
  return [
    {
      title: "ID",
      dataIndex: "id",
      width: 200,
    },
    {
      title: t("名称"),
      dataIndex: "name",
      width: 200,
    },
    {
      title: t("描述"),
      dataIndex: "description",
      width: 200,
    },
    {
      title: t("创建时间"),
      dataIndex: "createdAt",
      width: 200,
    },
    {
      title: t("更新时间"),
      dataIndex: "updatedAt",
      width: 200,
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
