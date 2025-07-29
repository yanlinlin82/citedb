/*
 * @Author: zhangyu
 * @Date: 2021-04-14 21:30:57
 * @LastEditTime: 2022-04-06 15:00:21
 */

const path = require('path')

// Database configuration file - better-sqlite3 version
module.exports = {
    db: {
        type: 'sqlite3',
        database: path.resolve(__dirname, '../database/cell_type_interact.db'), // SQLite database absolute path
        options: {
            // better-sqlite3 connection options
            verbose: null, // Disable verbose logging
            fileMustExist: false,  // Create database file if it doesn't exist
            readonly: false // Read-write mode
        }
    }
}
