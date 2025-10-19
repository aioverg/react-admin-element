import { useActivate } from "react-activation";
import { useCommonStore } from "@packages/hooks";
import { BaseContent } from "@packages/components";
import { globalConfig } from "@packages/utils";
function Home() {
  const { t } = useTranslation();
  const { permissions } = useCommonStore();
  const isPermission = checkPermission("/dashboard", permissions);

  useActivate(() => {
    console.log("进入和退出时执行");

    return () => {
      console.log("退出时执行");
    };
  });

  useActivate(() => {
    console.log("第二次进入和退出时执行");

    return () => {
      console.log("第二次退出时执行");
    };
  });

  return (
    <BaseContent isPermission={isPermission}>
      <h1>{globalConfig.PROJECT_NAME(t)}</h1>
    </BaseContent>
  );
}

export default Home;
