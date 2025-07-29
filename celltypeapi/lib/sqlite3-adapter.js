/*
 * @Author: zhangyu
 * @Date: 2021-04-25 20:21:15
 * @LastEditTime: 2022-04-06 15:00:21
 */

const Database = require('better-sqlite3')
const appConfig = require('../config/database.js')
// These modules are temporarily not needed in SQLite3 adapter, can be added later
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

    // Initialize database connection
    async initConnection() {
        if (!this.connection) {
            try {
                const dbConfig = appConfig.db
                this.connection = new Database(dbConfig.database, dbConfig.options)
                console.log('SQLite3 connection successful')
                return this.connection
            } catch (err) {
                console.error('SQLite3 connection failed:', err)
                throw err
            }
        }
        return this.connection
    }

    // Execute SQL query
    async query(sql, params = []) {
        await this.initConnection()
        try {
            const stmt = this.connection.prepare(sql)
            return stmt.all(params)
        } catch (err) {
            console.error('SQLite3 query error:', err)
            throw err
        }
    }

    // Execute SQL statement (no data returned)
    async run(sql, params = []) {
        await this.initConnection()
        try {
            const stmt = this.connection.prepare(sql)
            return stmt.run(params)
        } catch (err) {
            console.error('SQLite3 execution error:', err)
            throw err
        }
    }

    // Set table name
    Db(tableName) {
        this.tableName = tableName
        return this
    }

    // WHERE condition
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

    // WHERE OR condition
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
            // If no LIMIT, set a large LIMIT first then set OFFSET
            this.limitStr = `LIMIT 999999 OFFSET ${number}`
        }
        return this
    }

    // Field selection
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

    // Count query
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

    // Find single record
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

    // Query multiple records
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

    // Update records
    async update(obj, isAutoTime = false) {
        try {
            let updateFields = []
            let updateValues = []
            
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    updateFields.push(`${key} = ?`)
                    updateValues.push(obj[key])
                }
            }
            
            if (isAutoTime) {
                updateFields.push('update_time = ?')
                updateValues.push(dayjs().format('YYYY-MM-DD HH:mm:ss'))
            }
            
            let sql = `UPDATE ${this.tableName} SET ${updateFields.join(', ')}`
            if (this.whereStr) {
                sql += ` WHERE ${this.whereStr}`
                updateValues = updateValues.concat(this.whereParams || [])
            }
            
            const result = await this.run(sql, updateValues)
            this.reset()
            return result
        } catch (error) {
            this.reset()
            throw error
        }
    }

    // Insert record
    async insert(obj, isAutoTime = false) {
        try {
            let keys = []
            let values = []
            let placeholders = []
            
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    keys.push(key)
                    values.push(obj[key])
                    placeholders.push('?')
                }
            }
            
            if (isAutoTime) {
                keys.push('create_time', 'update_time')
                values.push(dayjs().format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss'))
                placeholders.push('?', '?')
            }
            
            const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders.join(', ')})`
            const result = await this.run(sql, values)
            this.reset()
            return result
        } catch (error) {
            this.reset()
            throw error
        }
    }

    // Delete records
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

    // Debug mode
    debug(val = true) {
        this.isDeBug = val
        return this
    }

    // Close database connection
    close() {
        if (this.connection) {
            this.connection.close()
            this.connection = null
        }
    }

    // Reset query builder state
    reset() {
        this.tableName = ''
        this.aliasStr = ''
        this.joinStr = ''
        this.fieldStr = '*'
        this.whereStr = ''
        this.whereParams = []
        this.limitStr = ''
        this.keyStr = ''
        this.valueStr = ''
        this.updateStr = ''
        this.orderStr = ''
        this.groupStr = ''
        this.isDistinct = ''
        this.sql = ''
        this.isDeBug = false
    }
}

module.exports = SQLite3Adapter 