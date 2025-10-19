import { type TableProps, type CheckboxProps, Button, Popover, Divider, Checkbox } from "antd";
import { useEffect, useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { TableColumn } from "../../types";
import DragContent from "../DragContent";

/**
 * 表格字段筛选
 */

export interface CheckboxList {
  label: string;
  value: string;
}

interface Props {
  columns: TableProps["columns"];
  cacheColumns: TableProps["columns"];
  className?: string;
  getTableChecks: (checks: string[], sortList: string[]) => void;
}

function TableFilter(props: Props) {
  const { columns, cacheColumns, className, getTableChecks } = props;
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [list, setList] = useState<CheckboxList[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const checkAll = list.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < list.length;
  const params: Partial<Props> = { ...props };
  delete params.getTableChecks;
  delete params.cacheColumns;

  useEffect(() => {
    filterColumns(columns);
  }, [columns]);

  /** 处理点击事件 */
  const handleClick = () => {
    setOpen(!isOpen);
  };

  /**
   * 过滤表格数据为多选组数据
   * @param columns - 表格数据
   */
  const filterColumns = (columns: TableProps["columns"]) => {
    if (!columns?.length) return [];
    const result: CheckboxList[] = [],
      currentOptions: string[] = [];

    for (let i = 0; i < columns?.length; i++) {
      const item = columns[i];
      const { dataIndex } = item as { dataIndex: string };

      if (!item.hidden && dataIndex) {
        currentOptions?.push(dataIndex);
      }

      result.push({
        label: item.title as string,
        value: dataIndex,
      });
    }

    setList(result);
    setCheckedList(currentOptions);
  };

  /**
   * 监听多选组数据
   * @param checkedValue - 已选数据
   */
  const onChangeCheckbox = (checkedValue: string[]) => {
    setCheckedList(checkedValue);
    handleFilter(checkedValue);
  };

  /** 处理筛选 */
  const handleFilter = (checkedList: string[], currentList = list) => {
    getTableChecks(
      checkedList,
      currentList.map((item) => item.value),
    );
  };

  /** 全选 */
  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    const checkedList = e.target.checked ? list.map((item) => item.value) : [];
    setCheckedList(checkedList);
    handleFilter(checkedList);
  };

  /** 重置列表 */
  const handleReset = () => {
    const newList: CheckboxList[] = [];
    const allCheckedList = (cacheColumns as TableColumn[])
      ?.map((item) => (item as { dataIndex: string })?.dataIndex)
      ?.filter(Boolean);

    for (let i = 0; i < (cacheColumns as TableColumn[])?.length; i++) {
      const item = (cacheColumns as TableColumn[])[i];
      newList.push({
        label: item.title as string,
        value: item.dataIndex as string,
      });
    }

    setCheckedList(allCheckedList);
    setList(newList);
    handleFilter(allCheckedList, newList);
  };

  /** 处理拖拽结束 */
  const handleDragEnd = (list: CheckboxList[]) => {
    setList(list);
    getTableChecks(
      checkedList,
      list.map((item) => item.value),
    );
  };

  // 渲染内容
  const content = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: "140px",
        }}
      >
        <div style={{ padding: "0 5px" }}>
          <Checkbox
            style={{ paddingLeft: "10px" }}
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            {t("全选")}
          </Checkbox>
        </div>

        <Divider style={{ margin: "5px 0" }} />

        <Checkbox.Group
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 5px 5px 5px",
            position: "relative",
          }}
          value={checkedList}
          onChange={onChangeCheckbox}
        >
          <DragContent list={list} handleDragEnd={handleDragEnd} />
        </Checkbox.Group>

        <Divider style={{ margin: "10px 0 5px 0" }} />

        <Button
          style={{ flex: "1", textAlign: "center" }}
          type="link"
          size="small"
          onClick={handleReset}
        >
          {t("重置")}
        </Button>
      </div>
    );
  };

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottom"
      styles={{
        body: {
          padding: "8px 0 5px",
        },
      }}
      open={isOpen}
      onOpenChange={handleClick}
    >
      <div {...params} style={{ display: "inline-block" }} className={`${className}`}>
        <Button
          style={{ padding: "0 10px", height: "29px", lineHeight: "29px" }}
          icon={<SettingOutlined />}
        >
          {t("列筛选")}
        </Button>
      </div>
    </Popover>
  );
}

export default TableFilter;
