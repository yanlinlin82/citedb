#!/bin/bash

# CITEdb 服务管理脚本

SERVICE="citedb"

case "${1:-}" in
    start)
        systemctl start $SERVICE
        ;;
    stop)
        systemctl stop $SERVICE
        ;;
    restart)
        systemctl restart $SERVICE
        ;;
    status)
        systemctl status $SERVICE
        ;;
    logs)
        journalctl -u $SERVICE -f
        ;;
    enable)
        systemctl enable $SERVICE
        ;;
    disable)
        systemctl disable $SERVICE
        ;;
    *)
        echo "用法: $0 {start|stop|restart|status|logs|enable|disable}"
        exit 1
        ;;
esac