#!/bin/bash

# CITEdb Service Management Script

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
        echo "Usage: $0 {start|stop|restart|status|logs|enable|disable}"
        exit 1
        ;;
esac