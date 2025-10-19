import type { ReactNode } from "react";

interface Props {
  isPermission?: boolean;
  children: ReactNode;
}

function BaseContent(props: Props) {
  const { isPermission, children } = props;

  return (
    <>
      {isPermission !== false && (
        <div className="base-content" style={{ padding: "10px" }}>
          {children}
        </div>
      )}
      {isPermission === false && <h1 style={{ textAlign: "center" }}>没有权限</h1>}
    </>
  );
}

export default BaseContent;
