import { useMemo } from "react";

// 导航面包屑组件
type navDataType = Array<{
  label: string;
}>;
interface PropsType {
  data: navDataType;
}

const Component = (props: PropsType) => {
  const { data = [] } = props;
  return useMemo(
    () => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
        className="ellipsis"
      >
        {data?.map((i, j) => (
          <span key={j}>
            {j !== 0 && (
              <span
                style={{
                  padding: "0 4px",
                }}
                className="breadcrumb-separator"
              >
                /
              </span>
            )}
            <span
              style={{ padding: "0 4px" }}
              className={`${j !== data.length - 1 ? "breadcrumb-separator" : ""}`}
            >
              {i.label}
            </span>
          </span>
        ))}
      </div>
    ),
    [data],
  );
};

export default Component;
