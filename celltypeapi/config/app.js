/*
 * @Author: zhangyu
 * @Date: 2021-04-14 21:28:08
 * @LastEditTime: 2021-06-15 17:21:18
 */

// 项目配置文件
module.exports = {
    // 端口配置 - 支持环境变量覆盖
    port: process.env.API_PORT || process.env.PORT || 3000,
    
    // 环境配置
    env: process.env.NODE_ENV || 'development',
    
    // 数据库配置
    database: {
        // 数据库文件路径
        path: process.env.DB_PATH || './database/cell_type_interact.db',
        
        // 数据库连接选项
        options: {
            verbose: process.env.DB_VERBOSE === 'true' ? console.log : null,
            fileMustExist: false,
            readonly: false
        }
    },
    
    // CORS配置
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        headers: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
    },
    
    // 日志配置
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        enableRequestLog: process.env.ENABLE_REQUEST_LOG !== 'false'
    },
    
    // 缓存配置
    cache: {
        enabled: process.env.ENABLE_CACHE !== 'false',
        duration: parseInt(process.env.CACHE_DURATION) || 5 * 60 * 1000 // 5分钟
    }
}