import type { PermissionData } from "@/servers/system/role";
import { Checkbox, Spin } from "antd";
import { type Key, useState, useEffect, useCallback } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

interface Props {
  isBordered?: boolean;
  isLoading?: boolean;
  treeData: PermissionData[];
  defaultCheckedKeys?: Key[];
  onChange: (checkedKeys: Key[]) => void;
}

function MenuAuthorize(props: Props) {
  const { treeData, defaultCheckedKeys, onChange, isLoading = false } = props;
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
  const [list, setList] = useState<PermissionData[]>(treeData || []);

  useEffect(() => {
    setCheckedKeys(
      defaultCheckedKeys?.length ? defaultCheckedKeys.map((item) => item?.toString()) : [],
    );
  }, [defaultCheckedKeys]);

  useEffect(() => {
    setList(treeData || []);
  }, [treeData]);

  /** 更新选中状态 */
  const updateCheckedKeys = useCallback(
    (keys: Key[]) => {
      setCheckedKeys(keys);
      onChange?.(keys);
    },
    [onChange],
  );

  /** 获取所有节点的key */
  const getAllKeys = useCallback((data: PermissionData[]): Key[] => {
    const keys: Key[] = [];

    const traverse = (nodes: PermissionData[]) => {
      nodes.forEach((node) => {
        keys.push(node.key);
        if (node.children) {
          traverse(node.children);
        }
      });
    };

    traverse(data);
    return keys;
  }, []);

  /** 处理节点选中/取消选中 */
  const handleCheck = useCallback(
    (checked: boolean, item: PermissionData) => {
      const { key } = item;
      const childrenKeys = getChildKeys(item);

      const newKeys = [...checkedKeys];

      if (checked) {
        // 添加选中项
        if (!newKeys.includes(key)) {
          newKeys.push(key);
        }

        // 如果是选中，需要将所有子节点也选中
        for (let i = 0; i < childrenKeys?.length; i++) {
          const child = childrenKeys[i];
          if (!newKeys.includes(child)) {
            newKeys.push(child);
          }
        }
      } else {
        // 取消选中
        for (let i = 0; i < newKeys.length; i++) {
          const newKey = newKeys[i];
          if (childrenKeys.includes(newKey) || newKey === key) {
            newKeys.splice(i, 1);
            i--;
          }
        }
      }

      updateCheckedKeys(newKeys);
    },
    [checkedKeys, list, updateCheckedKeys],
  );

  /** 全选/取消全选 */
  const handleCheckAll = useCallback(
    (e: CheckboxChangeEvent) => {
      const checked = e.target.checked;
      let newKeys: Key[] = [];

      if (checked) {
        newKeys = getAllKeys(list);
      }

      updateCheckedKeys(newKeys);
    },
    [getAllKeys, list, updateCheckedKeys],
  );

  /** 切换展开/收起状态 */
  const toggleExpand = useCallback((key: Key) => {
    setExpandedKeys((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      } 
        return [...prev, key];
      
    });
  }, []);

  /** 获取所有可展开的节点key */
  const getAllExpandableKeys = useCallback((data: PermissionData[]): Key[] => {
    const keys: Key[] = [];

    const traverse = (nodes: PermissionData[]) => {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          keys.push(node.key);
          traverse(node.children);
        }
      });
    };

    traverse(data);
    return keys;
  }, []);

  /** 展开/收起所有节点 */
  const toggleExpandAll = useCallback(() => {
    const allExpandableKeys = getAllExpandableKeys(list);
    if (expandedKeys.length === allExpandableKeys.length) {
      // 如果所有可展开节点都已展开，则收起所有节点
      setExpandedKeys([]);
    } else {
      // 否则展开所有有子节点的节点
      setExpandedKeys(allExpandableKeys);
    }
  }, [expandedKeys.length, list, getAllExpandableKeys]);

  /**
   * 获取子节点全部key
   * @param item - 列表
   */
  const getChildKeys = (item?: PermissionData) => {
    if (!item?.children?.length) return [];
    const result: Key[] = [];

    for (let i = 0; i < item.children.length; i++) {
      const child = item.children[i];
      if (child?.key) result.push(child.key);
      if (child?.children?.length) {
        const childKeys = getChildKeys(child);
        result.push(...childKeys);
      }
    }
    return result;
  };

  /** 渲染树节点 */
  const renderTreeNode = (list: PermissionData[], step = 0) => {
    if (!list?.length) return null;
    const isAuthorizeBtn = list.every((item) => item.type === 3);

    return (
      <div
        style={{
          marginLeft: isAuthorizeBtn ? (step + 1) * 20 : 0,
          display: isAuthorizeBtn ? "inline-block" : "block",
        }}
      >
        {list.map((item) => {
          let isChecked = checkedKeys.includes(item.key);
          const isExpanded = expandedKeys.includes(item.key);
          const childrenKeys = getChildKeys(item);
          const isEmptyChildrenKeys = !childrenKeys?.some((child) => checkedKeys.includes(child));
          const isAllCheckedChildrenKeys = childrenKeys?.every((child) =>
            checkedKeys.includes(child),
          );
          const isIndeterminate =
            item?.children?.length && !isEmptyChildrenKeys ? !isAllCheckedChildrenKeys : undefined;
          const hasChildren = item.children && item.children.length > 0;
          let marginLeft = step * 20;
          const isAuthorizeBtn = item.type === 3;

          // 如果有子节点，判断子数据是否为空
          if (hasChildren) {
            if (isChecked && isEmptyChildrenKeys) {
              isChecked = false;
              handleCheck(false, item);
            }
            if (!isChecked && isAllCheckedChildrenKeys) {
              isChecked = true;
              handleCheck(true, item);
            }
          }

          // 如果是权限按钮，则左间距调整
          if (item.type === 3) {
            marginLeft = 10;
          }

          return (
            <div key={item.key} style={{ display: item.type === 3 ? "inline-block" : "block" }}>
              <div
                style={{
                  marginLeft: marginLeft,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {hasChildren ? (
                  <div
                    style={{
                      fontSize: "12px",
                      display: "inline-block",
                      cursor: "pointer",
                      padding: "5px",
                    }}
                    onClick={() => toggleExpand(item.key)}
                  >
                    {isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
                  </div>
                ) : (
                  <div
                    style={{
                      width: !isAuthorizeBtn ? "24px" : "",
                      height: !isAuthorizeBtn ? "24px" : "",
                    }}
                  ></div> // 占位符，保持对齐
                )}
                <Checkbox
                  checked={isChecked}
                  indeterminate={isIndeterminate}
                  onChange={(e) => handleCheck(e.target.checked, item)}
                  style={{ width: "100%" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    {item?.icon && typeof item.icon === "string" && (
                      <ReloadOutlined icon={item.icon} style={{ fontSize: "12px" }} />
                    )}
                    <div style={{ flex: "1" }}>{item.title as string}</div>
                  </div>
                </Checkbox>
              </div>
              {hasChildren && isExpanded && renderTreeNode(item.children!, step + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  // 计算是否全选
  const allKeys = getAllKeys(list);
  const isAllChecked =
    checkedKeys.length > 0 && allKeys.every((item) => checkedKeys.includes(item));
  const hasCheckedKeys = checkedKeys.length > 0;

  return (
    <Spin spinning={isLoading}>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Checkbox
            checked={isAllChecked}
            indeterminate={!isAllChecked && hasCheckedKeys}
            onChange={handleCheckAll}
          >
            全选
          </Checkbox>
          <div
            style={{ color: "#3b82f6", cursor: "pointer", fontSize: "12px" }}
            onClick={toggleExpandAll}
          >
            {expandedKeys.length === getAllExpandableKeys(list).length ? "收起所有" : "展开所有"}
          </div>
        </div>
        {renderTreeNode(list)}
      </div>
    </Spin>
  );
}

export default MenuAuthorize;
