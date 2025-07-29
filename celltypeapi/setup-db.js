/*
 * @Author: zhangyu
 * @Date: 2022-04-06 15:00:21
 * @LastEditTime: 2022-04-06 15:00:21
 */

const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const config = require('./config/database.js')

console.log('🚀 Starting CITEdb database setup...')

// Create database connection
const dbPath = path.resolve(__dirname, config.db.database)

// Ensure database directory exists
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
    console.log(`📁 Creating database directory: ${dbDir}`)
    fs.mkdirSync(dbDir, { recursive: true })
}

const db = new Database(dbPath)

console.log('✅ SQLite database connection successful')
setupDatabase()

// Setup database
function setupDatabase() {
    console.log('📋 Starting database table structure initialization...')
    
    // Delete old tables first (if they exist)
    try {
        db.exec('DROP TABLE IF EXISTS mesh_tree')
        console.log('🗑️  mesh_tree old table deleted')
    } catch (err) {
        console.error('❌ Failed to delete mesh_tree old table:', err)
    }
    
    try {
        db.exec('DROP TABLE IF EXISTS source')
        console.log('🗑️  source old table deleted')
    } catch (err) {
        console.error('❌ Failed to delete source old table:', err)
    }
    
    try {
        db.exec('DROP TABLE IF EXISTS download')
        console.log('🗑️  download old table deleted')
    } catch (err) {
        console.error('❌ Failed to delete download old table:', err)
    }
    
    // Create mesh_tree table
    try {
        db.exec(`CREATE TABLE IF NOT EXISTS mesh_tree (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mesh_id TEXT,
            mesh_name TEXT,
            context TEXT,
            create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            update_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )`)
        console.log('✅ mesh_tree table created successfully')
    } catch (err) {
        console.error('❌ Failed to create mesh_tree table:', err)
    }

    // Create source table
    try {
        db.exec(`CREATE TABLE IF NOT EXISTS source (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_cell_type_class TEXT,
            source_cell_type TEXT,
            target_cell_type_class TEXT,
            target_cell_type TEXT,
            interaction_type TEXT,
            organism TEXT DEFAULT 'human',
            method TEXT DEFAULT 'computational',
            context TEXT,
            create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            update_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )`)
        console.log('✅ source table created successfully')
    } catch (err) {
        console.error('❌ Failed to create source table:', err)
    }

    // Create download table
    try {
        db.exec(`CREATE TABLE IF NOT EXISTS download (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            count INTEGER DEFAULT 0,
            create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            update_time DATETIME DEFAULT CURRENT_TIMESTAMP
        )`)
        console.log('✅ download table created successfully')
        
        // Insert initial download record
        const insertDownload = db.prepare('INSERT OR IGNORE INTO download (id, count) VALUES (1, 0)')
        insertDownload.run()
        console.log('✅ Initial download record inserted successfully')
    } catch (err) {
        console.error('❌ Failed to create download table:', err)
    }

    // Wait for table creation to complete before importing data
    setTimeout(() => {
        importData()
    }, 1000)
}

// Data import function
function importData() {
    console.log('📊 Starting CITEdb data import...')
    
    // Read CITEdb.txt file
    const dataPath = path.resolve(__dirname, '../celltypeweb/public/CITEdb.txt')
    
    if (!fs.existsSync(dataPath)) {
        console.error('❌ Data file does not exist:', dataPath)
        console.log('💡 Please ensure celltypeweb/public/CITEdb.txt file exists')
        db.close()
        return
    }
    
    const fileContent = fs.readFileSync(dataPath, 'utf8')
    const lines = fileContent.split('\n')
    
    // Skip header row
    const dataLines = lines.slice(1).filter(line => line.trim() !== '')
    
    console.log(`📈 Total of ${dataLines.length} data lines read`)
    
    // Clear existing data
    try {
        db.exec('DELETE FROM mesh_tree')
        console.log('✅ mesh_tree table cleared')
    } catch (err) {
        console.error('❌ Failed to clear mesh_tree table:', err)
    }
    
    try {
        db.exec('DELETE FROM source')
        console.log('✅ source table cleared')
    } catch (err) {
        console.error('❌ Failed to clear source table:', err)
    }
    
    // Process data
    let meshTreeData = new Map() // For deduplication
    let sourceData = []
    
    dataLines.forEach((line, index) => {
        const columns = line.split('\t')
        
        if (columns.length < 21) {
            console.warn(`⚠️  Line ${index + 1} data format incorrect, skipping`)
            return
        }
        
        const [
            publication_year, organism, context, mesh_id, mesh_term, phase, tissue, function_name,
            source_cell_type_class, source_cell_type, target_cell_type_class, target_cell_type,
            clear_direction, reciprocal_direction, interaction_details, method, method_details,
            reference, information, full_pdf, pmid, title
        ] = columns
        
        // Process mesh_tree data
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
        
        // Process source data
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
    
    // Insert mesh_tree data
    const meshTreeArray = Array.from(meshTreeData.values())
    console.log(`🌳 Preparing to insert ${meshTreeArray.length} mesh_tree records`)
    
    const insertMeshTree = db.prepare('INSERT INTO mesh_tree (mesh_id, mesh_name, context) VALUES (?, ?, ?)')
    
    const insertMeshTreeTransaction = db.transaction(() => {
        meshTreeArray.forEach((item, index) => {
            try {
                insertMeshTree.run(item.mesh_id, item.mesh_name, item.context)
            } catch (err) {
                console.error(`❌ Failed to insert mesh_tree data (${index + 1}):`, err)
            }
        })
    })
    
    try {
        insertMeshTreeTransaction()
        console.log('✅ mesh_tree data insertion completed')
    } catch (err) {
        console.error('❌ Error completing mesh_tree data insertion:', err)
    }
    
    // Insert source data
    console.log(`🔬 Preparing to insert ${sourceData.length} source records`)
    
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
                console.error(`❌ Failed to insert source data (${index + 1}):`, err)
            }
        })
    })
    
    try {
        insertSourceTransaction()
        console.log('✅ source data insertion completed')
        
        // Query statistics
        const meshTreeCount = db.prepare('SELECT COUNT(*) as count FROM mesh_tree').get()
        console.log(`📊 mesh_tree table has ${meshTreeCount.count} records`)
        
        const sourceCount = db.prepare('SELECT COUNT(*) as count FROM source').get()
        console.log(`📊 source table has ${sourceCount.count} records`)
        
        // Close database connection
        db.close()
        console.log('🎉 Database setup completed!')
        console.log('💡 You can now start the backend service: node simple-index.js')
        
    } catch (err) {
        console.error('❌ Error completing source data insertion:', err)
        db.close()
    }
}

// Error handling
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught exception:', err)
    if (db && !db.closed) {
        db.close()
    }
    process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Promise rejection:', reason)
    if (db && !db.closed) {
        db.close()
    }
    process.exit(1)
})