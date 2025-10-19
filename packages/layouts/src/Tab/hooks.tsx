import type { MenuProps } from "antd";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  RedoOutlined,
  CloseOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
} from "@ant-design/icons";
import { useAliveController } from "react-activation";
import { useCommonStore } from "@packages/hooks";
import { useTabsStore } from "@packages/store";

enum ITabEnums {
  REFRESH = "refresh", // 重新加载
  CLOSE_CURRENT = "close_current", // 关闭当前
  CLOSE_OTHER = "close_other", // 关闭其他
  CLOSE_LEFT = "close_left", // 关闭左侧
  CLOSE_RIGHT = "close_right", // 关闭右侧
}

interface Props {
  activeKey: string;
  onOpenChange?: (open: boolean) => void;
  handleRefresh: (activeKey: string) => void;
}

export function useDropdownMenu(props: Props) {
  const { t } = useTranslation();
  const { activeKey, onOpenChange, handleRefresh } = props;
  const { pathname } = useLocation();
  const { dropScope } = useAliveController();
  const { tabs } = useCommonStore();
  const { closeLeft, closeOther, closeRight, closeTabs } = useTabsStore((state) => state);

  // 菜单项
  const items: (key?: string) => MenuProps["items"] = (key = activeKey) => {
    const index = tabs.findIndex((item) => item.key === key);
    return [
      {
        key: ITabEnums.REFRESH,
        label: t("重新加载"),
        disabled: key !== pathname,
        icon: <RedoOutlined />,
      },
      {
        key: ITabEnums.CLOSE_CURRENT,
        label: t("关闭标签"),
        disabled: tabs.length <= 1,
        icon: <CloseOutlined />,
      },
      {
        key: ITabEnums.CLOSE_OTHER,
        label: t("关闭其他"),
        disabled: tabs.length <= 1,
        icon: <VerticalAlignMiddleOutlined />,
      },
      {
        key: ITabEnums.CLOSE_LEFT,
        label: t("关闭左侧"),
        disabled: index === 0,
        icon: <VerticalAlignTopOutlined />,
      },
      {
        key: ITabEnums.CLOSE_RIGHT,
        label: t("关闭右侧"),
        disabled: index === tabs.length - 1,
        icon: <VerticalAlignTopOutlined />,
      },
    ];
  };

  /** 点击菜单 */
  const onClick = (type: string, key = activeKey) => {
    // 复原箭头
    onOpenChange?.(false);

    switch (type) {
      // 重新加载
      case ITabEnums.REFRESH:
        handleRefresh(key);
        break;

      // 关闭当前
      case ITabEnums.CLOSE_CURRENT:
        closeTabs(key, dropScope);
        break;

      // 关闭其他
      case ITabEnums.CLOSE_OTHER:
        closeOther(key, dropScope);
        break;

      // 关闭左侧
      case ITabEnums.CLOSE_LEFT:
        closeLeft(key, dropScope);
        break;

      // 关闭右侧
      case ITabEnums.CLOSE_RIGHT:
        closeRight(key, dropScope);
        break;

      default:
        break;
    }
  };

  return [items, onClick] as const;
}
