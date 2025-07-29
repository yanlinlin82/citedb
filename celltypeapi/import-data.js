/*
 * @Author: zhangyu
 * @Date: 2022-04-06 15:00:21
 * @LastEditTime: 2022-04-06 15:00:21
 */

const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const config = require('./config/database.js')

// 创建数据库连接
const dbPath = path.resolve(__dirname, config.db.database)
const db = new Database(dbPath)

console.log('SQLite数据库连接成功')
importData()

// 数据导入函数
function importData() {
    console.log('开始导入数据...')
    
    // 读取CITEdb.txt文件
    const dataPath = path.resolve(__dirname, '../celltypeweb/public/CITEdb.txt')
    
    if (!fs.existsSync(dataPath)) {
        console.error('数据文件不存在:', dataPath)
        db.close()
        return
    }
    
    const fileContent = fs.readFileSync(dataPath, 'utf8')
    const lines = fileContent.split('\n')
    
    // 跳过标题行
    const dataLines = lines.slice(1).filter(line => line.trim() !== '')
    
    console.log(`总共读取到 ${dataLines.length} 行数据`)
    
    // 清空现有数据
    try {
        db.exec('DELETE FROM mesh_tree')
        console.log('mesh_tree表已清空')
    } catch (err) {
        console.error('清空mesh_tree表失败:', err)
    }
    
    try {
        db.exec('DELETE FROM source')
        console.log('source表已清空')
    } catch (err) {
        console.error('清空source表失败:', err)
    }
    
    // 处理数据
    let meshTreeData = new Map() // 用于去重
    let sourceData = []
    
    dataLines.forEach((line, index) => {
        const columns = line.split('\t')
        
        if (columns.length < 21) {
            console.warn(`第${index + 1}行数据格式不正确，跳过`)
            return
        }
        
        const [
            publication_year, organism, context, mesh_id, mesh_term, phase, tissue, function_name,
            source_cell_type_class, source_cell_type, target_cell_type_class, target_cell_type,
            clear_direction, reciprocal_direction, interaction_details, method, method_details,
            reference, information, full_pdf, pmid, title
        ] = columns
        
        // 处理mesh_tree数据
        if (mesh_term && mesh_term !== 'NA' && context && context !== 'NA') {
            const key = `${mesh_term}_${context}`
            if (!meshTreeData.has(key)) {
                meshTreeData.set(key, {
                    mesh_id: mesh_id || '',
                    mesh_name: mesh_term,
                    context: context
                })
            }
        }
        
        // 处理source数据
        if (source_cell_type_class && source_cell_type_class !== 'NA' && 
            source_cell_type && source_cell_type !== 'NA') {
            sourceData.push({
                source_cell_type_class: source_cell_type_class,
                source_cell_type: source_cell_type,
                target_cell_type_class: target_cell_type_class || '',
                target_cell_type: target_cell_type || '',
                interaction_type: interaction_details || '',
                organism: organism || 'human',
                method: method || 'computational',
                context: context || ''
            })
        }
    })
    
    // 插入mesh_tree数据
    const meshTreeArray = Array.from(meshTreeData.values())
    console.log(`准备插入 ${meshTreeArray.length} 条mesh_tree数据`)
    
    const insertMeshTree = db.prepare('INSERT INTO mesh_tree (mesh_id, mesh_name, context) VALUES (?, ?, ?)')
    
    const insertMeshTreeTransaction = db.transaction(() => {
        meshTreeArray.forEach((item, index) => {
            try {
                insertMeshTree.run(item.mesh_id, item.mesh_name, item.context)
            } catch (err) {
                console.error(`插入mesh_tree数据失败 (${index + 1}):`, err)
            }
        })
    })
    
    try {
        insertMeshTreeTransaction()
        console.log('mesh_tree数据插入完成')
    } catch (err) {
        console.error('完成mesh_tree数据插入时出错:', err)
    }
    
    // 插入source数据
    console.log(`准备插入 ${sourceData.length} 条source数据`)
    
    const insertSource = db.prepare('INSERT INTO source (source_cell_type_class, source_cell_type, target_cell_type_class, target_cell_type, interaction_type, organism, method, context) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    
    const insertSourceTransaction = db.transaction(() => {
        sourceData.forEach((item, index) => {
            try {
                insertSource.run(
                    item.source_cell_type_class,
                    item.source_cell_type,
                    item.target_cell_type_class,
                    item.target_cell_type,
                    item.interaction_type,
                    item.organism,
                    item.method,
                    item.context
                )
            } catch (err) {
                console.error(`插入source数据失败 (${index + 1}):`, err)
            }
        })
    })
    
    try {
        insertSourceTransaction()
        console.log('source数据插入完成')
        
        // 查询统计信息
        const meshTreeCount = db.prepare('SELECT COUNT(*) as count FROM mesh_tree').get()
        console.log(`mesh_tree表共有 ${meshTreeCount.count} 条记录`)
        
        const sourceCount = db.prepare('SELECT COUNT(*) as count FROM source').get()
        console.log(`source表共有 ${sourceCount.count} 条记录`)
        
        // 关闭数据库连接
        db.close()
        console.log('数据导入完成！')
        
    } catch (err) {
        console.error('完成source数据插入时出错:', err)
        db.close()
    }
}

// 错误处理
process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err)
    if (db && !db.closed) {
        db.close()
    }
    process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason)
    if (db && !db.closed) {
        db.close()
    }
    process.exit(1)
})