import type { PaginationProps } from "antd";
import { Pagination } from "antd";
import { useTranslation } from "react-i18next";
import "./index.less";

function BasePagination(props: PaginationProps) {
  const { t } = useTranslation();

  /**
   * 显示总数
   * @param total - 总数
   */
  const showTotal = (total?: number): string => {
    return t("comm.totalNum", { num: total || 0 });
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
      }}
    >
      <Pagination showSizeChanger showQuickJumper size="small" showTotal={showTotal} {...props} />
    </div>
  );
}

export default BasePagination;
