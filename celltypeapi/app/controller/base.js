/*
 * @Author: zhangyu
 * @Date: 2021-04-17 18:37:49
 * @LastEditTime: 2022-04-06 15:00:21
 */

const Controller = require('think-js-lib').Controller
const SQLite3Adapter = require('../../lib/sqlite3-adapter.js')

class BaseController extends Controller {
    constructor() {
        super()
        this.sqliteAdapter = new SQLite3Adapter()
    }

    /**
     * 重写Db方法，使用SQLite3适配器
     * @param {string} tableName 表名
     * @param {string} db 数据库实例名（保留参数以兼容原接口）
     * @returns {SQLite3Adapter} SQLite3适配器实例
     */
    Db(tableName, db = 'db') {
        return this.sqliteAdapter.Db(tableName)
    }

    /**
     * 显示成功响应
     * @param {any} data 数据
     * @param {string} msg 消息
     * @param {number} code 状态码
     * @param {number} statusCode HTTP状态码
     * @returns {object} 响应对象
     */
    showSuccess(data = [], msg = 'ok', code = 200, statusCode = 200) {
        return super.showSuccess(data, msg, code, statusCode)
    }

    /**
     * 获取参数
     * @param {object} ctx 上下文
     * @param {boolean} validate 是否验证
     * @returns {object} 参数对象
     */
    getParams(ctx, validate = false) {
        return super.getParams(ctx, validate)
    }

    /**
     * 生成JWT TOKEN
     * @param {object} obj 对象
     * @param {string} jwt_key JWT密钥
     * @param {string} expiresIn 过期时间
     * @returns {string} JWT token
     */
    getToken(obj, jwt_key, expiresIn) {
        return super.getToken(obj, jwt_key, expiresIn)
    }

    /**
     * 验证TOKEN
     * @param {string} token JWT token
     * @returns {object} 解析后的对象
     */
    validateToken(token) {
        return super.validateToken(token)
    }
}

module.exports = BaseController 