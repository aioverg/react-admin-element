import type { BaseFormData } from "#/form";
import type { PagePermission } from "#/public";
import { Button } from "antd";
import { tableColumns } from "./model";
import { getRolePage } from "@/servers/system/role";
import { useCommonStore } from "@packages/hooks";
import { BaseContent } from "@packages/components";
import { BaseCard } from "@packages/components";
import { BaseTable } from "@packages/components";
import { BasePagination } from "@packages/components";
import { globalConfig } from "@packages/utils";

function Page() {
  const { t } = useTranslation();
  const columns = tableColumns(t, optionRender);
  const [isFetch, setFetch] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(globalConfig.PAGINATION.page);
  const [pageSize, setPageSize] = useState(globalConfig.PAGINATION.pageSize);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<BaseFormData[]>([]);
  const { permissions } = useCommonStore();

  // 权限前缀
  const permissionPrefix = "/authority/role";

  // 权限
  const pagePermission: PagePermission = {
    page: checkPermission(`${permissionPrefix}/index`, permissions),
    create: checkPermission(`${permissionPrefix}/create`, permissions),
    update: checkPermission(`${permissionPrefix}/update`, permissions),
    delete: checkPermission(`${permissionPrefix}/delete`, permissions),
  };

  /** 获取表格数据 */
  const getPage = useCallback(async () => {
    const params = { page, pageSize };

    try {
      setLoading(true);
      const res = await getRolePage(params);
      const { code, data } = res;
      if (Number(code) !== 200) return;
      const { items, total } = data;
      setTotal(total || 0);
      setTableData(items || []);
    } finally {
      setFetch(false);
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    if (isFetch) getPage();
  }, [getPage, isFetch]);

  // 首次进入自动加载接口数据
  useEffect(() => {
    if (pagePermission.page) getPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagePermission.page]);

  /**
   * 处理分页
   * @param page - 当前页数
   * @param pageSize - 每页条数
   */
  const onChangePagination = useCallback((page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
    setFetch(true);
  }, []);

  /**
   * 渲染操作
   * @param _ - 当前值
   * @param record - 当前行参数
   */
  function optionRender(_: unknown, record: object) {
    return <div>{pagePermission.update === true && <Button>{t("操作")}</Button>}</div>;
  }

  return (
    <BaseContent isPermission={pagePermission.page}>
      <BaseCard>
        <BaseTable
          isLoading={isLoading}
          columns={columns}
          dataSource={tableData}
          getPage={getPage}
        />

        <BasePagination
          disabled={isLoading}
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={onChangePagination}
        />
      </BaseCard>
    </BaseContent>
  );
}

export default Page;
