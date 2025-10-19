# 简介

使用 `React`、`Antd`，采用 monorepo 架构管理的台管理系统模板，内容精简，方便本地自定义和开发。

## 项目启动

1. `pnpm install -w`：安装依赖。
2. `pnpm -F admin dev`：本地启动 admin 项目。
3. `pnpm -F admin mock`：启动 admin 项目mock服务。
4. `pnpm -F admin build`：打包 admin 项目。

## 项目结构

```tree
- packages 通用包
- project 项目
```

## 图标(iconify)

- 参考 [iconify官方地址](https://icon-sets.iconify.design/)
- VS Code安装Iconify IntelliSense - 图标内联显示和自动补全

## 其他

### 1. 路由

路由根据文件夹路径自动生成，路径包含以下文件名或文件夹名称则不生成：

* login
* forget
* components
* utils
* lib
* hooks
* model.tsx
* 404.tsx

可自行在 src/router/utils/config.ts 修改路由生成规则。

### 2. 菜单

有两种配置菜单的方式：

1. 动态菜单，通过菜单接口(/menu/list)获取菜单数据。
2. 静态菜单，查看 localMenus 变量，使用其 localMenus  覆盖接口返回数据即可。

### 3. 页面权限

1. 通过登录接(/user/login)或重新授权接口(/user/refresh-permissions)获取permissions权限数据。
2. 通过菜单接口(/menu/list)获取data中的rule权限数据，这个rule数据影响菜单显示，如果没返回rule则一直都显示。
3. 页面内权限参考src/pages/system/menu.index.tsx文件内的pagePermission数据，pagePermission.page是显示页面的权限，根据第一点返回的permissions进行匹配。


