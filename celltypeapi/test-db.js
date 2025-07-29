/*
 * 数据库连接测试脚本
 */

const SQLite3Adapter = require('./lib/sqlite3-adapter.js')

async function testDatabase() {
    console.log('🧪 开始测试数据库连接...')
    
    try {
        const db = new SQLite3Adapter()
        
        // 测试连接
        await db.initConnection()
        console.log('✅ 数据库连接成功')
        
        // 测试查询
        const tables = await db.query("SELECT name FROM sqlite_master WHERE type='table'")
        console.log('📋 数据库表列表:', tables.map(t => t.name))
        
        // 测试基本查询
        if (tables.length > 0) {
            const firstTable = tables[0].name
            const count = await db.Db(firstTable).count()
            console.log(`📊 表 ${firstTable} 记录数: ${count}`)
        }
        
        db.close()
        console.log('✅ 数据库测试完成')
        
    } catch (error) {
        console.error('❌ 数据库测试失败:', error)
    }
}

testDatabase()