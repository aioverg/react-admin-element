import { BaseContent } from "@packages/components";
import { useCommonStore } from "@packages/hooks";
import { checkPermission } from "@/utils/permissions";
import { useTranslation } from "react-i18next";

function Page() {
  const { t } = useTranslation();
  const { permissions } = useCommonStore();
  const isPermission = checkPermission("/demo/level", permissions);

  return (
    <BaseContent isPermission={isPermission}>
      <h1>{t("level1_2_1")}</h1>
    </BaseContent>
  );
}

export default Page;
