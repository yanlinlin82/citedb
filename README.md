# CITEdb: Cell-cell INTeraction DataBase

## 🚀 快速开始

### 1. 安装部署

```bash
# 安装并配置服务 (默认端口: API=3000, 前端=8080)
sudo ./scripts/install.sh

# 自定义端口安装
sudo ./scripts/install.sh 3000 8080
```

### 2. 启动服务

```bash
# 启动systemd服务
sudo ./scripts/manage.sh start

# 或直接运行 (开发模式)
./scripts/start.sh
```

### 3. 管理服务

```bash
# 查看状态
./scripts/manage.sh status

# 停止服务
./scripts/manage.sh stop

# 重启服务
./scripts/manage.sh restart

# 查看日志
./scripts/manage.sh logs
```

## 📋 系统要求

- **操作系统**: Ubuntu 18.04+ 或其他Linux发行版
- **Node.js**: 版本 16.0.0 或更高
- **Apache2**: Web服务器
- **内存**: 建议至少 2GB RAM

## 🔧 环境准备

```bash
# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装Apache2
sudo apt install apache2 -y
```

## 🌐 访问地址

安装完成后，通过以下地址访问：

- **前端界面**: http://localhost
- **后端API**: http://localhost/api

## 📁 项目结构

```
citedb/
├── celltypeapi/          # 后端API服务
├── celltypeweb/          # 前端Vue应用
├── scripts/              # 管理脚本
│   ├── install.sh        # 安装脚本
│   ├── start.sh          # 启动脚本
│   └── manage.sh         # 服务管理
├── config/               # 配置文件 (不纳入git)
└── README.md
```

## ⚙️ 配置说明

### 端口配置
安装时会生成 `config/local.js` 配置文件，包含端口设置：

```javascript
module.exports = {
    api: {
        port: 3000
    },
    frontend: {
        port: 8080
    }
}
```

### 服务配置
- **systemd服务**: `/etc/systemd/system/citedb.service`
- **Apache配置**: `/etc/apache2/sites-available/citedb.conf`
- **项目路径**: `/var/www/html/citedb`

## 🔍 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   sudo netstat -tlnp | grep :3000
   sudo kill -9 <PID>
   ```

2. **权限问题**
   ```bash
   sudo chown -R www-data:www-data /var/www/html/citedb
   ```

3. **服务启动失败**
   ```bash
   ./scripts/manage.sh status
   ./scripts/manage.sh logs
   ```

### 日志位置
- **服务日志**: `journalctl -u citedb -f`
- **Apache日志**: `/var/log/apache2/citedb_*.log`

## 🔒 安全建议

1. **防火墙配置**
   ```bash
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   ```

2. **SSL证书**
   ```bash
   sudo apt install certbot python3-certbot-apache
   sudo certbot --apache -d your-domain.com
   ```

## 📝 开发说明

### 手动启动（开发模式）
```bash
# 后端
cd celltypeapi
npm install
node simple-index.js

# 前端
cd celltypeweb
npm install --legacy-peer-deps
npm run serve
```

### 数据库初始化
```bash
cd celltypeapi
node setup-db.js
```

## 📄 许可证

本项目采用 ISC 许可证。
