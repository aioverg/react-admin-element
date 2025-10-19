import type { LoginData } from "./model";
import type { FormProps } from "antd";
import { Form, Button, Input, Checkbox } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { setTitle, encryption, decryption, globalConfig } from "@packages/utils";
import { useToken } from "@packages/hooks";
import { usePublicStore, type ThemeType } from "@packages/store";
import { LayoutTheme, LayoutLang } from "@packages/layouts";
import Logo from "@/assets/images/logo.svg";
import { login } from "@/servers/login";

const CHECK_REMEMBER = "remember_me";
const USER_USERNAME = "login_username";
const USER_PASSWORD = "login_password";

function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [getToken, setToken] = useToken();
  const [isLoading, setLoading] = useState(false);
  const [isRemember, setRemember] = useState(true);
  const { search } = useLocation();
  const setThemeValue = usePublicStore((state) => state.setThemeValue);
  const themeCache = (localStorage.getItem(globalConfig.THEME_KEY) || "light") as ThemeType;

  useEffect(() => {
    if (!themeCache) {
      localStorage.setItem(globalConfig.THEME_KEY, "light");
    }
    if (themeCache === "dark") {
      document.body.className = "theme-dark";
    }
    setThemeValue(themeCache === "dark" ? "dark" : "light");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeCache]);

  useEffect(() => {
    // 如果存在token，则直接进入页面
    if (getToken()) {
      handleGoMenu();
    }

    // 如果存在记住我缓存
    const remember = localStorage.getItem(CHECK_REMEMBER);
    setRemember(remember !== "false");

    // 如果存在账号密码缓存，则自动填充
    const username = localStorage.getItem(USER_USERNAME);
    const password = localStorage.getItem(USER_PASSWORD);
    if (username && password) {
      const newPassword = decryption(password);
      form.setFieldsValue({ username, password: newPassword.value });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 语言切换修改title
  useEffect(() => {
    setTitle(t, t("登录"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  // 登录成功跳转
  const handleGoMenu = async () => {
    // 如果存在重定向
    if (search?.includes("?redirect=")) {
      const key = "?redirect=";
      const start = search.includes(key) ? search.indexOf(key) + 10 : 0;
      const end = search.includes("&") ? search.indexOf("&") : search.length;
      const url = search.substring(start, end);
      if (url) {
        navigate(url);
        return;
      }
    }

    navigate("/home");
  };

  // 提交表单
  const confirm: FormProps["onFinish"] = async (values: LoginData) => {
    try {
      setLoading(true);
      const { code, data } = await login(values);
      if (Number(code) !== 200) return;
      const { token } = data;

      // 【记住我】逻辑
      handleRemember(values.username, encryption({ value: values.password, expire: 0 }));

      setToken(token);
      handleGoMenu();
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理失败
   * @param errors - 错误信息
   */
  const handleFinishFailed: FormProps["onFinishFailed"] = (errors) => {
    console.error("错误信息:", errors);
  };

  // 【记住我】checkbox
  const onRemember = () => {
    setRemember(!isRemember);
    localStorage.setItem(CHECK_REMEMBER, isRemember ? "false" : "true");
  };

  // 【记住我】逻辑
  const handleRemember = (username: string, password: string) => {
    if (isRemember) {
      localStorage.setItem(USER_USERNAME, username);
      localStorage.setItem(USER_PASSWORD, password);
    } else {
      localStorage.removeItem(USER_USERNAME);
      localStorage.removeItem(USER_PASSWORD);
    }
  };

  // 忘记密码
  const onForgetPassword = () => {
    navigate(`/forget${search}`);
  };

  return (
    <>
      <div
        style={{
          background: themeCache === "dark" ? "#000" : "#f6f6f6",
          width: "100vw",
          height: "100vh",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: "5px",
            right: "5px",
          }}
        >
          <LayoutLang />
          <LayoutTheme />
        </div>
        <div
          style={{
            width: "340px",
            padding: "2rem",
            borderRadius: "10px",
            position: "absolute",
            left: "calc(50% - 170px)",
            top: "calc(50% - 185px)",
            boxShadow: "2px 5px 20px var(--un-shadow-color, rgba(0, 0, 0, 0.1))",
            background: themeCache === "dark" ? "#323232" : "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: "20px",
            }}
          >
            <img width="32" height="32" src={Logo} alt="LOGO" />
            <span
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                letterSpacing: "2px",
              }}
            >
              {t("管理系统")}
            </span>
          </div>
          <Form
            form={form}
            layout="vertical"
            name="horizontal_login"
            autoComplete="on"
            onFinish={confirm}
            onFinishFailed={handleFinishFailed}
            initialValues={{
              username: "admin",
              password: "admin123456",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#AAA6A6",
                marginBottom: "8px",
              }}
            >
              {t("用户名")}
            </div>

            <Form.Item
              name="username"
              style={{ marginBottom: "15px" }}
              rules={[
                {
                  required: true,
                  message: t("请输入用户名"),
                },
              ]}
            >
              <Input allow-clear="true" placeholder={t("请输入用户名")} autoComplete="username" />
            </Form.Item>

            <div
              style={{
                fontSize: "14px",
                color: "#AAA6A6",
                marginBottom: "8px",
              }}
            >
              {t("密码")}
            </div>

            <Form.Item
              name="password"
              style={{ marginBottom: "15px" }}
              rules={[
                {
                  required: true,
                  message: t("请输入密码"),
                },
                PASSWORD_RULE(t),
              ]}
            >
              <Input.Password placeholder={t("请输入密码")} autoComplete="current-password" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                marginTop: "5px",
                letterSpacing: "2px",
                marginBottom: "25px",
              }}
              loading={isLoading}
            >
              {t("登录")}
            </Button>
          </Form>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Checkbox checked={isRemember} onChange={onRemember}>
              {t("记住我")}
            </Checkbox>

            <div
              style={{
                color: "#3b82f6",
                cursor: "pointer",
              }}
              onClick={onForgetPassword}
            >
              {t("忘记密码?")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
