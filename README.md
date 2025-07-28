# CITEdb: Cell-cell INTeraction DataBase

## 安装方法

当前环境(2022-09-17)：

* node: v12.22.9
* npm: v8.5.1

启动api模块：

```sh
cd celltypeapi
npm install  # 安装所需软件库
npm start    # 启动程序
```

启动web模块：

```sh
cd celltypeweb
npm install --legacy-peer-deps  # 由于存在依赖冲突（解决中），尝试追加参数
npm run serve  # 启动服务
npm run build  # 创建发布版本
```
