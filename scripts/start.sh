#!/bin/bash

# CITEdb 启动脚本

# 加载配置
if [ -f "config/local.js" ]; then
    API_PORT=$(node -e "console.log(require('./config/local.js').api.port)")
    FRONTEND_PORT=$(node -e "console.log(require('./config/local.js').frontend.port)")
else
    API_PORT=3000
    FRONTEND_PORT=8080
fi

echo "🚀 启动 CITEdb (API: $API_PORT, 前端: $FRONTEND_PORT)"

# 启动后端
echo "启动后端服务..."
cd celltypeapi
PORT=$API_PORT node simple-index.js &
BACKEND_PID=$!

# 启动前端
echo "启动前端服务..."
cd ../celltypeweb
npm run serve &
FRONTEND_PID=$!

echo "✅ 服务已启动"
echo "前端: http://localhost:$FRONTEND_PORT"
echo "后端: http://localhost:$API_PORT"
echo "按 Ctrl+C 停止"

# 等待中断信号
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait