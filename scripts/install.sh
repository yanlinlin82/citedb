#!/bin/bash

# CITEdb 安装脚本
# 用法: ./scripts/install.sh [API端口] [前端端口]

set -e

# 默认配置
API_PORT=${1:-3000}
FRONTEND_PORT=${2:-8080}
PROJECT_PATH="/var/www/html/citedb"
CONFIG_FILE="config/local.js"

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 检查权限
if [ "$EUID" -ne 0 ]; then
    error "请使用 sudo 运行此脚本"
    exit 1
fi

echo "🚀 CITEdb 安装脚本"
echo "API端口: $API_PORT, 前端端口: $FRONTEND_PORT"

# 创建配置目录
mkdir -p config

# 生成配置文件
log "生成配置文件..."
cat > "$CONFIG_FILE" << EOF
module.exports = {
    api: {
        port: $API_PORT
    },
    frontend: {
        port: $FRONTEND_PORT
    },
    project: {
        path: '$PROJECT_PATH'
    }
}
EOF

# 创建项目目录
log "创建项目目录..."
mkdir -p "$PROJECT_PATH"
cp -r . "$PROJECT_PATH/"

# 设置权限
log "设置文件权限..."
chown -R www-data:www-data "$PROJECT_PATH"
chmod -R 755 "$PROJECT_PATH"
chmod -R 777 "$PROJECT_PATH/celltypeapi/database" 2>/dev/null || true
chmod -R 777 "$PROJECT_PATH/celltypeapi/logs" 2>/dev/null || true

# 安装依赖
log "安装依赖..."
cd "$PROJECT_PATH/celltypeapi" && npm install
cd "$PROJECT_PATH/celltypeweb" && npm install --legacy-peer-deps

# 初始化数据库
log "初始化数据库..."
cd "$PROJECT_PATH/celltypeapi"
if [ ! -f "database/citedb.db" ]; then
    node setup-db.js
fi

# 创建systemd服务
log "创建systemd服务..."
cat > /etc/systemd/system/citedb.service << EOF
[Unit]
Description=CITEdb Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$PROJECT_PATH
ExecStart=/usr/bin/node $PROJECT_PATH/celltypeapi/simple-index.js
Restart=always
Environment=PORT=$API_PORT

[Install]
WantedBy=multi-user.target
EOF

# 启用服务
systemctl daemon-reload
systemctl enable citedb

# 创建Apache配置
log "创建Apache配置..."
cat > /etc/apache2/sites-available/citedb.conf << EOF
<VirtualHost *:80>
    ServerName citedb.local
    DocumentRoot $PROJECT_PATH/celltypeweb/dist
    
    <Directory $PROJECT_PATH/celltypeweb/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    ProxyPreserveHost On
    ProxyPass /api http://localhost:$API_PORT
    ProxyPassReverse /api http://localhost:$API_PORT
    
    ErrorLog \${APACHE_LOG_DIR}/citedb_error.log
    CustomLog \${APACHE_LOG_DIR}/citedb_access.log combined
</VirtualHost>
EOF

# 启用Apache站点
a2ensite citedb
a2enmod proxy proxy_http rewrite headers

# 构建前端
log "构建前端..."
cd "$PROJECT_PATH/celltypeweb"
npm run build

echo ""
echo "✅ 安装完成!"
echo "📋 服务信息:"
echo "   启动服务: systemctl start citedb"
echo "   状态检查: systemctl status citedb"
echo "   查看日志: journalctl -u citedb -f"
echo ""
echo "🌐 访问地址:"
echo "   前端: http://localhost"
echo "   后端API: http://localhost/api"
echo ""
echo "📝 重启Apache: systemctl restart apache2"