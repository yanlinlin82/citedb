#!/bin/bash

# CITEdb 测试脚本

echo "🧪 CITEdb 测试"

# 检查配置文件
if [ -f "config/local.js" ]; then
    echo "✅ 配置文件存在"
    node -e "console.log('配置:', JSON.stringify(require('./config/local.js'), null, 2))"
else
    echo "❌ 配置文件不存在"
fi

# 检查服务状态
if systemctl is-active --quiet citedb; then
    echo "✅ 服务正在运行"
else
    echo "❌ 服务未运行"
fi

# 检查端口
API_PORT=$(node -e "console.log(require('./config/local.js').api.port)" 2>/dev/null || echo "3000")
if netstat -tuln | grep -q ":$API_PORT "; then
    echo "✅ API端口 $API_PORT 正在监听"
else
    echo "❌ API端口 $API_PORT 未监听"
fi

# 测试API
if curl -s http://localhost/api/download/count > /dev/null 2>&1; then
    echo "✅ API响应正常"
else
    echo "❌ API无响应"
fi

echo "🎉 测试完成"