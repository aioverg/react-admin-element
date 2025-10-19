import type { TFunction } from "i18next";
import type { TableOptions, TableColumn } from "#/public";
import { ReloadOutlined } from "@ant-design/icons";
import { Switch } from "antd";
import { globalConfig } from "@packages/utils";

/**
 * 表格数据
 * @param optionRender - 渲染操作函数
 */
export const tableColumns = (t: TFunction, optionRender: TableOptions<object>): TableColumn[] => {
  return [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
    },
    {
      title: t("systems:menu.icon"),
      dataIndex: "icon",
      width: 50,
      render: (text: string) => (
        <div>{text ? <ReloadOutlined icon="text" /> : globalConfig.EMPTY_PLACEHOLDER}</div>
      ),
    },
    {
      title: t("systems:menu.label"),
      dataIndex: "label",
      width: 200,
    },
    {
      title: t("systems:menu.labelEn"),
      dataIndex: "labelEn",
      width: 200,
    },
    {
      title: t("systems:menu.type"),
      dataIndex: "type",
      width: 160,
      ellipsis: false,
    },
    {
      title: t("systems:menu.router"),
      dataIndex: "router",
      width: 200,
    },
    {
      title: t("system.status"),
      dataIndex: "state",
      width: 80,
      render: (text: number, record) => <Switch />,
    },
    {
      title: t("systems:menu.sort"),
      dataIndex: "order",
      width: 50,
    },
    {
      title: t("systems:menu.rule"),
      dataIndex: "rule",
      width: 150,
    },
    {
      title: t("操作"),
      dataIndex: "operate",
      width: 210,
      fixed: "right",
      render: (value: unknown, record: object) => optionRender(value, record),
    },
  ];
};
