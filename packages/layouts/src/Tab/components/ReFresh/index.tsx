import { Tooltip } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

// 刷新
interface Props {
  isRefresh: boolean;
  onClick: () => void;
}

function TabRefresh(props: Props) {
  const { t } = useTranslation();
  const { isRefresh, onClick } = props;

  return (
    <Tooltip title={t("重新加载")} placement="bottom">
      <ReloadOutlined
        style={{ cursor: "pointer" }}
        className={isRefresh ? "global_rotate_360 global_pointer_events_none" : ""}
        onClick={() => onClick()}
      />
    </Tooltip>
  );
}

export default TabRefresh;
