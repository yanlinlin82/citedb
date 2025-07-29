/*
 * @Author: zhangyu
 * @Date: 2022-04-06 15:00:21
 * @LastEditTime: 2022-04-06 15:00:21
 */

const sqlite3 = require('sqlite3')
const path = require('path')
const config = require('./config/database.js')

// 创建数据库连接
const dbPath = path.resolve(__dirname, config.db.database)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('创建数据库失败:', err)
        return
    }
    console.log('SQLite数据库连接成功')
    initTables()
})

// 初始化表结构
function initTables() {
    // 创建mesh_tree表
    db.run(`CREATE TABLE IF NOT EXISTS mesh_tree (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mesh_id TEXT,
        mesh_name TEXT,
        context TEXT,
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('创建mesh_tree表失败:', err)
        } else {
            console.log('mesh_tree表创建成功')
        }
    })

    // 创建source表
    db.run(`CREATE TABLE IF NOT EXISTS source (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_cell_type_class TEXT,
        source_cell_type TEXT,
        target_cell_type_class TEXT,
        target_cell_type TEXT,
        interaction_type TEXT,
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('创建source表失败:', err)
        } else {
            console.log('source表创建成功')
        }
    })

    // 创建download表
    db.run(`CREATE TABLE IF NOT EXISTS download (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        count INTEGER DEFAULT 0,
        create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        update_time DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('创建download表失败:', err)
        } else {
            console.log('download表创建成功')
            
            // 插入初始下载记录
            db.run(`INSERT OR IGNORE INTO download (id, count) VALUES (1, 0)`, (err) => {
                if (err) {
                    console.error('插入初始下载记录失败:', err)
                } else {
                    console.log('初始下载记录插入成功')
                }
            })
        }
    })

    // 关闭数据库连接
    setTimeout(() => {
        db.close((err) => {
            if (err) {
                console.error('关闭数据库连接失败:', err)
            } else {
                console.log('数据库初始化完成')
            }
        })
    }, 1000)
} 