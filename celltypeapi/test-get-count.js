// Test get_count API fix
const axios = require('axios')

console.log('=== Testing get_count API fix ===')

const testCases = [
    { name: 'T cell', check: false },
    { name: 'T cell', check: true },
    { name: 'B cell', check: false },
    { name: 'B cell', check: true }
]

async function testGetCount() {
    for (const testCase of testCases) {
        try {
            console.log(`\nTest: ${JSON.stringify(testCase)}`)
            
            const response = await axios.post('http://localhost:3000/api/v1/get_count', testCase)
            
            console.log('✅ Success:', response.data)
            if (response.data.code === 200) {
                console.log(`   Count: ${response.data.data}`)
            } else {
                console.log(`   Error: ${response.data.msg}`)
            }
        } catch (error) {
            console.log('❌ Failed:', error.message)
            if (error.response) {
                console.log('   Response:', error.response.data)
            }
        }
    }
    
    console.log('\n=== Test completed ===')
}

// Run test
testGetCount().catch(console.error)