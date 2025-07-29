# CITEdb: Cell-cell INTeraction DataBase

## 数据库初始化

在启动服务之前，需要先初始化数据库并导入数据：

```sh
cd celltypeapi
node setup-db.js  # 初始化数据库并导入CITEdb.txt数据
```

这个脚本会：

- 创建必要的数据库表（mesh_tree, source, download）
- 从 `celltypeweb/public/CITEdb.txt` 导入初始数据
- 处理数据去重和格式化
- 显示详细的导入进度和统计信息

## 启动服务

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

## 快速开始

1. **初始化数据库**：
   ```sh
   cd celltypeapi
   node setup-db.js
   ```

2. **启动后端服务**：
   ```sh
   cd celltypeapi
   npm start
   ```

3. **启动前端服务**：
   ```sh
   cd celltypeweb
   npm run serve
   ```

4. **访问应用**：
   打开浏览器访问 `http://localhost:8080`
