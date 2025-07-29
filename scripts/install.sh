#!/bin/bash

# CITEdb Installation Script
# Usage: ./scripts/install.sh [API_PORT] [FRONTEND_PORT]
#
# This is the source code for CITEdb: a manually curated database of cell-cell interactions in human
# Original paper: Shan N, et al. Bioinformatics. 2022;38(22):5144-5148. doi: 10.1093/bioinformatics/btac654

set -e

# Default configuration
API_PORT=${1:-3000}
FRONTEND_PORT=${2:-8080}
PROJECT_PATH="$(realpath $(dirname $0)/..)"
CONFIG_FILE="$PROJECT_PATH/config/local.js"

# Color output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
step() { echo -e "${BLUE}[STEP]${NC} $1"; }

echo "🚀 CITEdb Installation Script"
echo "API Port: $API_PORT, Frontend Port: $FRONTEND_PORT"

# Create config directory
mkdir -p config

# Generate configuration file
log "Generating configuration file..."
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

# Install dependencies
log "Installing dependencies..."
cd "$PROJECT_PATH/celltypeapi" && npm install
cd "$PROJECT_PATH/celltypeweb" && npm install --legacy-peer-deps

# Initialize database
log "Initializing database..."
cd "$PROJECT_PATH/celltypeapi"
if [ ! -f "database/citedb.db" ]; then
    node setup-db.js
fi

# Build frontend
log "Building frontend..."
cd "$PROJECT_PATH/celltypeweb"
npm run build

echo ""
echo "✅ Local installation completed!"
echo ""
echo "📋 Manual system configuration required:"
echo ""

# Generate systemd service file
step "1. Create systemd service file:"
echo "   Please create file with root privileges: /etc/systemd/system/citedb.service"
echo "   Content:"
echo "   ========================================="
cat << EOF
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
echo "   ========================================="
echo ""

# Generate Apache configuration file
step "2. Create Apache configuration file:"
echo "   Please create file with root privileges: /etc/apache2/sites-available/citedb.conf"
echo "   Content:"
echo "   ========================================="
cat << EOF
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
echo "   ========================================="
echo ""

# Display commands to execute
step "3. Execute the following commands to complete configuration:"
echo "   # Set file permissions"
echo "   sudo chown -R www-data:www-data $PROJECT_PATH"
echo "   sudo chmod -R 755 $PROJECT_PATH"
echo "   sudo chmod -R 777 $PROJECT_PATH/celltypeapi/database"
echo "   sudo chmod -R 777 $PROJECT_PATH/celltypeapi/logs"
echo ""
echo "   # Enable systemd service"
echo "   sudo systemctl daemon-reload"
echo "   sudo systemctl enable citedb"
echo ""
echo "   # Enable Apache site"
echo "   sudo a2ensite citedb"
echo "   sudo a2enmod proxy proxy_http rewrite headers"
echo "   sudo systemctl restart apache2"
echo ""
echo "   # Start service"
echo "   sudo systemctl start citedb"
echo ""

echo "🌐 Access URLs after configuration:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost/api"
echo ""
echo "📝 Service management:"
echo "   Check status: sudo systemctl status citedb"
echo "   View logs: sudo journalctl -u citedb -f"
