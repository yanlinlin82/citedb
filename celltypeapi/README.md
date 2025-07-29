# CellTypeDB API

基于 Koa + SQLite3 的细胞类型数据库 API 服务。

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式（前台运行，显示详细日志）
```bash
npm run dev
```

### 生产模式
```bash
npm start
```

### PM2 管理（可选）
```bash
npm run pm2:start  # 启动
npm run pm2:stop   # 停止
```

## API 端点

- `GET /api/tree` - 获取树结构数据
- `GET /api/cell-type-tree` - 获取细胞类型树结构
- `GET /api/download/count` - 获取下载计数
- `POST /api/download/update` - 更新下载计数

## 配置

数据库配置位于 `config/database.js`，默认使用 SQLite3 数据库文件 `./database/cell_type_interact.db`。