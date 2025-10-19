import type { FormProps } from "antd";
import { InputNumber, message } from "antd";
import { Form, Button, Input } from "antd";
import { setTitle } from "@packages/utils";
import { message as globalMessage } from "antd";
import { forgetPassword } from "@/servers/login";
import Logo from "@/assets/images/logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutTheme } from "@packages/layouts";
import { LayoutLang } from "@packages/layouts";
import { ThemeType, usePublicStore } from "@packages/store";
import { PasswordStrength } from "@packages/components";
import { globalConfig } from "@packages/utils";

interface ForgetData {
  username: string;
  newPassword: string;
  confirmPassword: string;
  phone: number;
  verification: number;
}

function Forget() {
  const { t, i18n } = useTranslation();
  const { search } = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [verificationTime, setVerificationTime] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
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
    return () => {
      if (timer.current) {
        clearInterval(timer.current as NodeJS.Timeout);
        timer.current = null;
      }
    };
  }, []);

  // 语言切换修改title
  useEffect(() => {
    setTitle(t, t("重置密码"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  /**
   * 修改密码
   * @param values - 表单数据
   */
  const handleFinish: FormProps["onFinish"] = async (values: ForgetData) => {
    // 当密码和确认密码不同时则提示错误
    if (values.newPassword !== values.confirmPassword) {
      return messageApi.warning({
        content: t("密码和确认密码不相同!"),
        key: "confirmPassword",
      });
    }

    try {
      setLoading(true);
      const { code } = await forgetPassword(values);
      if (Number(code) !== 200) return;

      globalMessage.success({
        content: t("验证通过"),
        key: "success",
      });
      navigate(`/login${search}`);
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

  /** 点击获取验证码 */
  const onVerificationCode = () => {
    const phone = form.getFieldValue("phone");

    if (!phone) {
      return messageApi.warning({
        content: t("请输入", { name: t("手机号码") }),
        key: "phone",
      });
    }

    // 匹配是否是正确手机号码
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(phone)) {
      return messageApi.warning({
        content: t("请输入有效的11位手机号码"),
        key: "phone",
      });
    }

    setVerificationTime(60);
    timer.current = setInterval(() => {
      setVerificationTime((prev) => {
        if (prev <= 1) {
          if (timer.current) {
            clearInterval(timer.current as NodeJS.Timeout);
            timer.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    // ...获取验证码逻辑
  };

  return (
    <>
      {contextHolder}
      <div>
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
            width: "400px",
            padding: "2rem",
            borderRadius: "10px",
            position: "absolute",
            left: "calc(50% - 200px)",
            top: "calc(50% - 250px)",
            boxShadow: "2px 5px 20px var(--un-shadow-color, rgba(0, 0, 0, 0.1))",
            background: themeCache === "dark" ? "#323232" : "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: "30px",
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
              {t("重置密码")}
            </span>
          </div>
          <Form
            form={form}
            name="horizontal_login"
            autoComplete="on"
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: t("请输入用户名"),
                },
              ]}
            >
              <Input allow-clear="true" placeholder={t("用户名")} autoComplete="username" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: t("请输入密码"),
                },
                PASSWORD_RULE(t),
              ]}
            >
              <PasswordStrength placeholder={t("密码")} autoComplete="current-password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: t("请确认密码"),
                },
                PASSWORD_RULE(t),
              ]}
            >
              <PasswordStrength placeholder={t("确认密码")} autoComplete="current-password" />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                {
                  required: true,
                  message: t("请输入手机号"),
                },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: t("请输入有效的11位手机号码"),
                },
              ]}
            >
              <InputNumber
                controls={false}
                style={{ width: "100%" }}
                placeholder={t("手机号码")}
                autoComplete="phone"
              />
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item
                name="verification"
                rules={[
                  {
                    required: true,
                    message: t("请输入验证码"),
                  },
                ]}
              >
                <InputNumber
                  controls={false}
                  style={{ width: "210px" }}
                  placeholder={t("验证码")}
                />
              </Form.Item>

              <Button
                type="primary"
                style={{ width: "120px" }}
                disabled={verificationTime > 0}
                onClick={onVerificationCode}
              >
                {verificationTime > 0 ? <span>{t("重新获取")}</span> : t("获取验证码")}
              </Button>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", marginTop: "5px", letterSpacing: "2px" }}
              loading={isLoading}
            >
              {t("确定")}
            </Button>
          </Form>

          <Button
            htmlType="submit"
            style={{ width: "100%", marginTop: "5px", letterSpacing: "2px" }}
            onClick={() => navigate(`/login${search}`)}
          >
            {t("返回")}
          </Button>
        </div>
      </div>
    </>
  );
}

export default Forget;
