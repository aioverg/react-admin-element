import type { MouseEventHandler, ReactNode, RefObject } from "react";
import type { ModalProps } from "antd";
import type { DraggableData, DraggableEvent } from "react-draggable";
import { useEffect, useRef, useState } from "react";
import { Modal, Tooltip } from "antd";
import { FullscreenExitOutlined, FullscreenOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import "./index.less";

interface Props extends Omit<ModalProps, "onCancel"> {
  onCancel: () => void;
}

function BaseModal(props: Props) {
  const { width, children, wrapClassName, onCancel } = props;
  const { t } = useTranslation();
  const [isDisabled, setDisabled] = useState(true);
  const [isFullscreen, setFullscreen] = useState(false);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const [cacheBounds, setCacheBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFullscreen) {
      setBounds({ left: 0, top: 0, bottom: 0, right: 0 });
    } else {
      setBounds(cacheBounds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen]);

  // 开始拖拽对话框
  const onStartMouse = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect?.();
    if (!targetRect) return;
    const data = {
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    };
    setBounds(data);
    setCacheBounds(data);
  };

  // 拖拽
  const onMouseOver = () => {
    if (isDisabled) {
      setDisabled(false);
    }
  };

  // 全屏
  const onFullscreen = () => {
    setFullscreen(!isFullscreen);
  };

  // 关闭
  const handleCancel: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onCancel?.();
  };

  // 自定义关闭和放大图标
  const CloseRender = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        position: "absolute",
        right: "5px",
      }}
    >
      <Tooltip placement="bottom" title={!isFullscreen ? t("最大化") : t("退出最大化")}>
        <div style={{ padding: "10px", cursor: "pointer" }} onClick={onFullscreen}>
          <FullscreenExitOutlined style={{ display: isFullscreen ? "block" : "none" }} />
          <FullscreenOutlined style={{ display: !isFullscreen ? "block" : "none" }} />
        </div>
      </Tooltip>
      <Tooltip placement="bottom" title={t("关闭")}>
        <div style={{ padding: "10px", cursor: "pointer" }} onClick={handleCancel}>
          <CloseOutlined />
        </div>
      </Tooltip>
    </div>
  );

  // 自定义标题
  const titleRender = (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        className="modal-custom-title"
        onMouseOver={onMouseOver}
        onMouseOut={() => setDisabled(true)}
      >
        <span style={{ cursor: "text" }}>{props.title || ""}</span>
      </div>
      {CloseRender}
    </div>
  );

  // 自定义渲染对话框 - 拖动对话框
  const modalRender = (modal: ReactNode) => (
    <Draggable
      nodeRef={draggleRef as RefObject<HTMLElement>}
      disabled={isDisabled}
      onStart={onStartMouse}
      bounds={isFullscreen ? undefined : bounds}
      position={isFullscreen ? { x: 0, y: 0 } : undefined}
    >
      <div ref={draggleRef}>{modal}</div>
    </Draggable>
  );

  return (
    <Modal
      destroyOnHidden
      closable={false}
      maskClosable={false}
      modalRender={modalRender}
      okText={t("取消")}
      cancelText={t("确认")}
      {...props}
      className={`base-modal ${props.className}`}
      title={titleRender}
      wrapClassName={isFullscreen ? "full-modal" : wrapClassName || ""}
      width={isFullscreen ? "100%" : width || 520}
    >
      <div className="base-modal-content">{children}</div>
    </Modal>
  );
}

export default BaseModal;
