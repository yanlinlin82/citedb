const SQLite3Adapter = require('./lib/sqlite3-adapter.js')

// 数据库实例
const db = new SQLite3Adapter()

// 检查数据库表结构
async function checkDatabaseStructure() {
    try {
        console.log('检查数据库表结构...')
        
        // 检查source表结构
        const sourceColumns = await db.query("PRAGMA table_info(source)")
        console.log('✅ source表列信息:')
        sourceColumns.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`)
        })
        
        // 检查mesh_tree表结构
        const meshTreeColumns = await db.query("PRAGMA table_info(mesh_tree)")
        console.log('✅ mesh_tree表列信息:')
        meshTreeColumns.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`)
        })
        
        // 检查表数据量
        const sourceCount = await db.query("SELECT COUNT(*) as count FROM source")
        console.log(`✅ source表数据量: ${sourceCount[0].count}`)
        
        const meshTreeCount = await db.query("SELECT COUNT(*) as count FROM mesh_tree")
        console.log(`✅ mesh_tree表数据量: ${meshTreeCount[0].count}`)
        
        // 查看source表的前几条数据
        const sampleData = await db.query("SELECT * FROM source LIMIT 3")
        console.log('✅ source表样本数据:')
        sampleData.forEach((row, index) => {
            console.log(`  记录 ${index + 1}:`, Object.keys(row))
        })
        
    } catch (error) {
        console.error('❌ 检查失败:', error)
    }
}

// 启动检查
checkDatabaseStructure().then(() => {
    console.log('检查完成')
    process.exit(0)
}).catch(error => {
    console.error('检查出错:', error)
    process.exit(1)
})