import { Tooltip } from "antd";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useFullscreen } from "@packages/hooks";

/**
 * @description: 全屏组件
 */
function Fullscreen() {
  const { t } = useTranslation();
  const [isFullscreen, toggleFullscreen] = useFullscreen();

  return (
    <Tooltip title={isFullscreen ? t("推出全屏") : t("全屏")}>
      <div
        style={{
          fontSize: "1.125rem",
          lineHeight: "1.75rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          marginRight: "0.75rem",
        }}
        onClick={toggleFullscreen}
      >
        <FullscreenExitOutlined style={{ display: isFullscreen ? "block" : "none" }} />
        <FullscreenOutlined style={{ display: !isFullscreen ? "block" : "none" }} />
      </div>
    </Tooltip>
  );
}

export default Fullscreen;
