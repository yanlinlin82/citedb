#!/bin/bash

# CITEdb Auto Update Script
# Usage: ./scripts/update.sh [-q]
# -q: Quiet mode, no output when no updates

set -e

# Parse arguments
QUIET=false
while getopts "q" opt; do
    case $opt in
        q) QUIET=true ;;
        *) echo "Usage: $0 [-q]"; exit 1 ;;
    esac
done

# Color output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    if [ "$QUIET" = false ]; then
        echo -e "${GREEN}[INFO]${NC} $1"
    fi
}

warn() {
    if [ "$QUIET" = false ]; then
        echo -e "${YELLOW}[WARN]${NC} $1"
    fi
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

step() {
    if [ "$QUIET" = false ]; then
        echo -e "${BLUE}[STEP]${NC} $1"
    fi
}

# Get project root directory
PROJECT_PATH="$(realpath $(dirname $0)/..)"
cd "$PROJECT_PATH"

# Check if it's a git repository
if [ ! -d ".git" ]; then
    error "Current directory is not a git repository"
    exit 1
fi

# Check if remote repository exists
if ! git remote -v | grep -q origin; then
    error "Remote repository 'origin' not found"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Fetch remote updates
step "Checking for remote updates..."
git fetch origin

# Check if there are updates
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/$CURRENT_BRANCH)

if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
    if [ "$QUIET" = false ]; then
        log "Already up to date, no updates needed"
    fi
    exit 0
fi

# Display update information
log "New version found, starting update..."
log "Current version: $(git log -1 --format='%h %s')"
log "Latest version: $(git log origin/$CURRENT_BRANCH -1 --format='%h %s')"

# Backup current state
step "Backing up current state..."
BACKUP_DIR="/tmp/citedb_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r . "$BACKUP_DIR/" 2>/dev/null || true

# Pull latest code
step "Pulling latest code..."
git pull origin $CURRENT_BRANCH

# Check configuration file
if [ -f "config/local.js" ]; then
    log "Configuration file exists, keeping current config"
else
    warn "Configuration file not found, using default config"
    mkdir -p config
    cat > "config/local.js" << EOF
module.exports = {
    api: {
        port: 3000
    },
    frontend: {
        port: 8080
    },
    project: {
        path: '$PROJECT_PATH'
    }
}
EOF
fi

# Install dependencies
step "Updating dependencies..."
cd celltypeapi && npm install
cd ../celltypeweb && npm install --legacy-peer-deps

# Build frontend
step "Rebuilding frontend..."
npm run build

# Restart service
step "Restarting service..."
if systemctl is-active --quiet citedb; then
    sudo systemctl restart citedb
    log "Service restarted"
else
    warn "Service not running, skipping restart"
fi

# Clean up backup
rm -rf "$BACKUP_DIR"

# Display update results
log "✅ Update completed!"
log "Current version: $(git log -1 --format='%h %s')"

# Check service status
if systemctl is-active --quiet citedb; then
    log "✅ Service running normally"
else
    error "❌ Service not running, please check: sudo systemctl status citedb"
fi

# Test API
if curl -s http://localhost/api/download/count > /dev/null 2>&1; then
    log "✅ API responding normally"
else
    warn "⚠️  API not responding, please check service status"
fi
