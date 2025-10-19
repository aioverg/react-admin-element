import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTabsStore } from "@packages/store";

function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addTabs, setActiveKey } = useTabsStore();

  /** 跳转首页 */
  const goIndex = () => {
    navigate("/home");
    setActiveKey("/home");
    addTabs({
      label: "首页",
      icon: "fluent:box-20-regular",
      key: "/home",
      rule: "/home",
    });
  };

  return (
    <div style={{ textAlign: "center", overflow: "hidden" }}>
      <h1 style={{ width: "100%", fontSize: "6rem", fontWeight: "bold" }} className="global_shake">
        404
      </h1>
      <p
        style={{
          width: "100%",
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        {t("当前页面无法访问，可能没权限或已删除")}
      </p>
      <Button style={{ margin: "auto" }} onClick={goIndex}>
        {t("返回首页")}
      </Button>
    </div>
  );
}

export default NotFound;
