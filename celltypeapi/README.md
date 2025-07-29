# CellTypeDB API

基于 Koa + SQLite3 的细胞类型数据库 API 服务。

## 快速开始

### 安装依赖
```bash
npm install
```

### 环境配置
复制环境配置示例文件：
```bash
cp env.example .env
```

根据需要修改 `.env` 文件中的配置。

### 开发模式（前台运行，显示详细日志）
```bash
npm run dev
# 或者
npm run start:dev
```

### 生产模式
```bash
npm start
# 或者
npm run start:prod
```

### PM2 管理（可选）
```bash
npm run pm2:start  # 启动
npm run pm2:stop   # 停止
npm run pm2:restart # 重启
```

## 配置说明

### 端口配置
- **默认端口**: 3000
- **环境变量**: `API_PORT` 或 `PORT`
- **示例**: `API_PORT=8080 npm start`

### 环境变量支持
| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `API_PORT` | 3000 | API服务端口 |
| `NODE_ENV` | development | 运行环境 |
| `DB_PATH` | ./database/cell_type_interact.db | 数据库文件路径 |
| `CORS_ORIGIN` | * | CORS允许的源 |
| `ENABLE_CACHE` | true | 是否启用缓存 |
| `ENABLE_REQUEST_LOG` | true | 是否启用请求日志 |

## API 端点

- `POST /api/v1/get_tree` - 获取树结构数据
- `POST /api/v1/get_cell_type_tree` - 获取细胞类型树结构
- `POST /api/v1/get_data_img` - 获取图表数据
- `POST /api/v1/get_data_table` - 获取表格数据
- `POST /api/v1/get_count` - 获取计数数据
- `POST /api/v1/show_count` - 显示下载计数
- `POST /api/v1/update_count` - 更新下载计数

## 配置

数据库配置位于 `config/database.js`，默认使用 SQLite3 数据库文件 `./database/cell_type_interact.db`。

应用配置位于 `config/app.js`，支持通过环境变量进行配置。