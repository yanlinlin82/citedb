/*
 * @Author: zhangyu
 * @Date: 2021-04-25 20:21:15
 * @LastEditTime: 2022-04-06 15:00:21
 */

const Database = require('better-sqlite3')
const appConfig = require('../config/database.js')
// 这些模块在SQLite3适配器中暂时不需要，可以后续添加
// const HttpException = require('./exception.js')
// const ErrorCode = require('./errorcode')
const dayjs = require('dayjs')

class SQLite3Adapter {
    constructor() {
        this.db = null
        this.tableName = ''
        this.aliasStr = ''
        this.joinStr = ''
        this.fieldStr = '*'
        this.whereStr = ''
        this.limitStr = ''
        this.keyStr = ''
        this.valueStr = ''
        this.updateStr = ''
        this.orderStr = ''
        this.groupStr = ''
        this.isDistinct = ''
        this.sql = ''
        this.isDeBug = false
        this.connection = null
    }

    // 初始化数据库连接
    async initConnection() {
        if (!this.connection) {
            try {
                const dbConfig = appConfig.db
                this.connection = new Database(dbConfig.database, dbConfig.options)
                console.log('SQLite3连接成功')
                return this.connection
            } catch (err) {
                console.error('SQLite3连接失败:', err)
                throw err
            }
        }
        return this.connection
    }

    // 执行SQL查询
    async query(sql, params = []) {
        await this.initConnection()
        try {
            const stmt = this.connection.prepare(sql)
            return stmt.all(params)
        } catch (err) {
            console.error('SQLite3查询错误:', err)
            throw err
        }
    }

    // 执行SQL语句（不返回数据）
    async run(sql, params = []) {
        await this.initConnection()
        try {
            const stmt = this.connection.prepare(sql)
            return stmt.run(params)
        } catch (err) {
            console.error('SQLite3执行错误:', err)
            throw err
        }
    }

    // 设置表名
    Db(tableName) {
        this.tableName = tableName
        return this
    }

    // WHERE条件
    where(param, condition, value) {
        if (this.whereStr) {
            this.whereStr += ` AND ${param} ${condition} ?`
        } else {
            this.whereStr = `${param} ${condition} ?`
        }
        this.whereParams = this.whereParams || []
        this.whereParams.push(value)
        return this
    }

    // WHERE OR条件
    whereOr(param, condition, value) {
        if (this.whereStr) {
            this.whereStr += ` OR ${param} ${condition} ?`
        } else {
            this.whereStr = `${param} ${condition} ?`
        }
        this.whereParams = this.whereParams || []
        this.whereParams.push(value)
        return this
    }

    // ORDER BY
    order(field, sort = 'DESC') {
        this.orderStr = `ORDER BY ${field} ${sort}`
        return this
    }

    // LIMIT
    limit(number) {
        this.limitStr = `LIMIT ${number}`
        return this
    }

    // OFFSET
    offset(number) {
        if (this.limitStr) {
            this.limitStr += ` OFFSET ${number}`
        } else {
            // 如果没有LIMIT，先设置一个大的LIMIT再设置OFFSET
            this.limitStr = `LIMIT 999999 OFFSET ${number}`
        }
        return this
    }

    // 字段选择
    field(str) {
        this.fieldStr = str
        return this
    }

    // GROUP BY
    group(str) {
        this.groupStr = `GROUP BY ${str}`
        return this
    }

    // DISTINCT
    distinct(isDistinct = true) {
        this.isDistinct = isDistinct ? 'DISTINCT' : ''
        return this
    }

    // 计数查询
    async count(field = '*') {
        try {
            let sql
            if (this.isDistinct && this.fieldStr !== '*') {
                sql = `SELECT COUNT(DISTINCT ${this.fieldStr}) as count FROM ${this.tableName}`
            } else {
                sql = `SELECT COUNT(${field}) as count FROM ${this.tableName}`
            }
            if (this.whereStr) {
                sql += ` WHERE ${this.whereStr}`
            }
            if (this.groupStr) {
                sql += ` ${this.groupStr}`
            }
            
            const result = await this.query(sql, this.whereParams || [])
            this.reset()
            return result
        } catch (error) {
            this.reset()
            throw error
        }
    }

    // 查找单条记录
    async find() {
        try {
            let sql = `SELECT ${this.isDistinct ? 'DISTINCT ' : ''}${this.fieldStr} FROM ${this.tableName}`
            if (this.whereStr) {
                sql += ` WHERE ${this.whereStr}`
            }
            if (this.groupStr) {
                sql += ` ${this.groupStr}`
            }
            if (this.orderStr) {
                sql += ` ${this.orderStr}`
            }
            sql += ' LIMIT 1'
            
            const result = await this.query(sql, this.whereParams || [])
            this.reset()
            return result[0] || null
        } catch (error) {
            this.reset()
            throw error
        }
    }

    // 查询多条记录
    async select() {
        try {
            let sql = `SELECT ${this.isDistinct ? 'DISTINCT ' : ''}${this.fieldStr} FROM ${this.tableName}`
            if (this.whereStr) {
                sql += ` WHERE ${this.whereStr}`
            }
            if (this.groupStr) {
                sql += ` ${this.groupStr}`
            }
            if (this.orderStr) {
                sql += ` ${this.orderStr}`
            }
            if (this.limitStr) {
                sql += ` ${this.limitStr}`
            }
            
            const result = await this.query(sql, this.whereParams || [])
            this.reset()
            return result
        } catch (error) {
            this.reset()
            throw error
        }
    }

    // 更新记录
    async update(obj, isAutoTime = false) {
        try {
            if (isAutoTime) {
                obj.update_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
            
            const keys = Object.keys(obj)
            const values = Object.values(obj)
            const setStr = keys.map(key => `${key} = ?`).join(', ')
            
            let sql = `UPDATE ${this.tableName} SET ${setStr}`
            if (this.whereStr) {
                sql += ` WHERE ${this.whereStr}`
                values.push(...(this.whereParams || []))
            }
            
            const result = await this.run(sql, values)
            this.reset()
            return result
        } catch (error) {
            this.reset()
            throw error
        }
    }

    // 插入记录
    async insert(obj, isAutoTime = false) {
        try {
            if (isAutoTime) {
                obj.create_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
                obj.update_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
            
            const keys = Object.keys(obj)
            const values = Object.values(obj)
            const placeholders = keys.map(() => '?').join(', ')
            
            const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`
            
            const result = await this.run(sql, values)
            this.reset()
            return result
        } catch (error) {
            this.reset()
            throw error
        }
    }

    // 删除记录
    async delete() {
        try {
            let sql = `DELETE FROM ${this.tableName}`
            if (this.whereStr) {
                sql += ` WHERE ${this.whereStr}`
            }
            
            const result = await this.run(sql, this.whereParams || [])
            this.reset()
            return result
        } catch (error) {
            this.reset()
            throw error
        }
    }

    // 调试模式
    debug(val = true) {
        this.isDeBug = val
        return this
    }

    // 关闭连接
    close() {
        if (this.connection) {
            this.connection.close()
            this.connection = null
        }
    }

    // 重置查询状态
    reset() {
        this.tableName = ''
        this.aliasStr = ''
        this.joinStr = ''
        this.fieldStr = '*'
        this.whereStr = ''
        this.limitStr = ''
        this.keyStr = ''
        this.valueStr = ''
        this.updateStr = ''
        this.orderStr = ''
        this.groupStr = ''
        this.isDistinct = ''
        this.sql = ''
        this.whereParams = []
    }
}

module.exports = SQLite3Adapter 