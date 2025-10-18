import { useState } from "react";
import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useDropdownMenu } from "../../hooks";

interface Props {
  activeKey: string;
  handleRefresh: (activeKey: string) => void;
}

function TabOptions(props: Props) {
  const { activeKey, handleRefresh } = props;
  const [isOpen, setOpen] = useState(false);

  /**
   * 菜单显示变化
   * @param open - 显示值
   */
  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  // 下拉菜单
  const dropdownMenuParams = { activeKey, onOpenChange, handleRefresh };
  const [items, onClick] = useDropdownMenu(dropdownMenuParams);

  return (
    <Dropdown
      trigger={["click"]}
      menu={{
        items: items(),
        onClick: (e) => onClick(e.key),
      }}
      onOpenChange={onOpenChange}
    >
      <DownOutlined
        style={{
          transform: isOpen ? "rotate(180deg)" : "",
        }}
        className="global_transition_all"
      />
    </Dropdown>
  );
}

export default TabOptions;
