import type { Key, TableRowSelection } from "antd/es/table/interface";
import type { BaseFormData } from "#/form";
import { Button } from "antd";
import { tableColumns } from "./model";
import { getUserPage } from "@/servers/system/user";
import PermissionDrawer from "./components/PermissionDrawer";
import { useCommonStore } from "@packages/hooks";
import { BaseContent } from "@packages/components";
import { BaseCard } from "@packages/components";
import { BaseTable } from "@packages/components";
import { BasePagination } from "@packages/components";
import { globalConfig } from "@packages/utils";

// 当前行数据
interface RowData {
  id: string;
  username: string;
}

function Page() {
  const { t } = useTranslation();
  const columns = tableColumns(t, optionRender);
  const [isFetch, setFetch] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(globalConfig.PAGINATION.page);
  const [pageSize, setPageSize] = useState(globalConfig.PAGINATION.pageSize);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState<BaseFormData[]>([]);

  const [promiseId, setPromiseId] = useState("");
  const [isPromiseOpen, setPromiseOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const { permissions } = useCommonStore();

  // 权限前缀
  const permissionPrefix = "/authority/user";

  // 权限
  const pagePermission: PagePermission = {
    page: checkPermission(`${permissionPrefix}/index`, permissions),
    create: checkPermission(`${permissionPrefix}/create`, permissions),
    update: checkPermission(`${permissionPrefix}/update`, permissions),
    delete: checkPermission(`${permissionPrefix}/delete`, permissions),
    permission: checkPermission(`${permissionPrefix}/authority`, permissions),
  };

  /** 获取表格数据 */
  const getPage = useCallback(async () => {
    const params = { page, pageSize };

    try {
      setLoading(true);
      const { code, data } = await getUserPage(params);
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

  /** 开启权限 */
  const openPermission = async (id: string) => {
    setPromiseId(id);
    setPromiseOpen(true);
  };

  /** 关闭权限 */
  const closePermission = () => {
    setPromiseOpen(false);
  };

  /**
   * 处理分页
   * @param page - 当前页数
   * @param pageSize - 每页条数
   */
  const onChangePagination = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
    setFetch(true);
  };

  /**
   * 监听表格多选变化
   * @param newSelectedRowKeys - 勾选值
   */
  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    console.log("勾选值", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  /** 表格多选  */
  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  /**
   * 渲染操作
   * @param _ - 当前值
   * @param record - 当前行参数
   */
  function optionRender(_: unknown, record: object) {
    return (
      <div>
        {pagePermission.permission === true && (
          <Button onClick={() => openPermission((record as RowData).id)}>
            {t("systems:user.permissions")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <BaseContent isPermission={pagePermission.page}>
      <BaseCard>
        <BaseTable
          isLoading={isLoading}
          columns={columns}
          dataSource={tableData}
          rowSelection={rowSelection}
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
      <PermissionDrawer isOpen={isPromiseOpen} id={promiseId} onClose={closePermission} />
    </BaseContent>
  );
}

export default Page;
