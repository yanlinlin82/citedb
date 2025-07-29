#!/bin/bash

# CITEdb Test Script

echo "🧪 CITEdb Test"

# Check configuration file
if [ -f "config/local.js" ]; then
    echo "✅ Configuration file exists"
    node -e "console.log('Config:', JSON.stringify(require('./config/local.js'), null, 2))"
else
    echo "❌ Configuration file not found"
fi

# Check service status
if systemctl is-active --quiet citedb; then
    echo "✅ Service is running"
else
    echo "❌ Service is not running"
fi

# Check ports
API_PORT=$(node -e "console.log(require('./config/local.js').api.port)" 2>/dev/null || echo "3000")
if netstat -tuln | grep -q ":$API_PORT "; then
    echo "✅ API port $API_PORT is listening"
else
    echo "❌ API port $API_PORT is not listening"
fi

# Test API
if curl -s http://localhost/api/download/count > /dev/null 2>&1; then
    echo "✅ API responding normally"
else
    echo "❌ API not responding"
fi

echo "🎉 Test completed"
