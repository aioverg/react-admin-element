import type { FormProps } from "antd/es/form/Form";
import { Ref, useImperativeHandle } from "react";
import { useState } from "react";
import { Form } from "antd";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { BaseModal } from "@packages/components";
import PasswordStrength from "../PasswordStrength";
import { useLogout } from "@packages/hooks";

export interface PasswordModal {
  open: () => void;
}

export interface Props {
  passwordRef: Ref<PasswordModal>;
}

export const Password = (props: Props) => {
  const { passwordRef } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [handleLogout] = useLogout();
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  // 外部方法
  useImperativeHandle(passwordRef, () => ({
    open: () => {
      setOpen(true);
    },
  }));

  // 确定
  const onOk = () => {
    form?.submit();
  };

  // 关闭
  const onClose = () => {
    setOpen(false);
    form?.resetFields();
  };

  // 提交表单
  const onFinish: FormProps["onFinish"] = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      return message.warning({
        content: t("密码和确认密码不相同!"),
        key: "confirmPassword",
      });
    }
    try {
      setLoading(true);
      message.success("修改成功");
      setTimeout(() => {
        onClose();
        handleLogout();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      title={t("修改密码")}
      open={isOpen}
      confirmLoading={isLoading}
      onOk={onOk}
      onCancel={() => onClose()}
    >
      <Form
        name="Password"
        form={form}
        labelWrap
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={t("旧密码")}
          name="oldPassword"
          rules={[
            {
              required: true,
              message: t("请输入密码"),
            },
          ]}
        >
          <PasswordStrength />
        </Form.Item>
        <Form.Item
          label={t("新密码")}
          name="newPassword"
          rules={[
            {
              required: true,
              message: t("请输入密码"),
            },
          ]}
        >
          <PasswordStrength />
        </Form.Item>

        <Form.Item
          label={t("确认密码")}
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: t("请输入密码"),
            },
          ]}
        >
          <PasswordStrength />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};
