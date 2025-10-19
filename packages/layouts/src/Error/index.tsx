import { Component, ErrorInfo, ReactNode } from "react";
import { Button, Result, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { LogoutOutlined, MessageOutlined, RedoOutlined } from "@ant-design/icons";
import { useUserStore } from "@packages/store";
import { useLogout } from "@packages/hooks";
import axios from "axios";
import dayjs from "dayjs";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// 错误处理及上报组件
const ErrorContent = ({ error }: { error: Error | null }) => {
  const [handleLogout] = useLogout();
  const { t } = useTranslation();

  /** 刷新当前页面 */
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Result
        status="error"
        title={t("页面出现错误")}
        subTitle={
          <div style={{ display: "flex" }}>
            <Tooltip title={String(error)} placement="top">
              <MessageOutlined style={{ marginRight: "5px" }} />
            </Tooltip>
            {t("抱歉，页面出现了错误，无法正常显示内容。")}
          </div>
        }
        extra={[
          <Button key="refresh" type="primary" icon={<RedoOutlined />} onClick={handleRefresh}>
            {t("刷新页面")}
          </Button>,
          <Button key="hard-refresh" icon={<LogoutOutlined />} onClick={handleLogout}>
            {t("退出登录")}
          </Button>,
        ]}
      />
    </div>
  );
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true, error: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 错误日志打印
    console.error("错误信息:", error, errorInfo);
    this.setState({ error });

    // 将错误信息上传至服务器
    this.sendErrorLog(error, errorInfo);
  }

  private async sendErrorLog(error: Error, errorInfo: ErrorInfo) {
    try {
      // 获取用户信息
      const userInfo = useUserStore.getState().userInfo;

      // 准备日志数据
      const logData = {
        userInfo,
        error: error.toString(),
        errorInfo: JSON.stringify(errorInfo),
        createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        type: "frontError",
      };

      // 发送错误日志到服务器
      await axios.post("/log/create", logData);
    } catch (e) {
      console.error("发送错误日志失败:", e);
    }
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorContent error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
