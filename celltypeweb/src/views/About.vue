<template>
  <BaseLayout current="about">
    <div class="debug-page">
      <div class="row">
        <div class="col-lg-10 mx-auto">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">
                <i class="fas fa-bug me-2"></i>
                API Debug & Diagnostics
              </h3>
            </div>
            <div class="card-body">
              <!-- Connection Status -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <h5>Connection Status</h5>
                  <div class="d-flex align-items-center mb-2">
                    <div :class="['status-indicator', connectionStatus ? 'connected' : 'disconnected']"></div>
                    <span class="ms-2">{{ connectionStatus ? 'Connected' : 'Disconnected' }}</span>
                  </div>
                  <p class="text-muted small">
                    Backend: http://localhost:3000<br>
                    Frontend: http://localhost:8080
                  </p>
                </div>
                <div class="col-md-6">
                  <h5>Quick Actions</h5>
                  <button class="btn btn-primary btn-sm me-2" @click="testConnection">
                    <i class="fas fa-plug me-1"></i>Test Connection
                  </button>
                  <button class="btn btn-secondary btn-sm" @click="clearLogs">
                    <i class="fas fa-trash me-1"></i>Clear Logs
                  </button>
                </div>
              </div>

              <!-- API Tests -->
              <div class="row mb-4">
                <div class="col-12">
                  <h5>API Endpoint Tests</h5>
                  <div class="row g-2">
                    <div class="col-md-4">
                      <button class="btn btn-outline-primary w-100" @click="testEndpoint('get_tree')">
                        Test get_tree
                      </button>
                    </div>
                    <div class="col-md-4">
                      <button class="btn btn-outline-primary w-100" @click="testEndpoint('get_cell_type_tree')">
                        Test get_cell_type_tree
                      </button>
                    </div>
                    <div class="col-md-4">
                      <button class="btn btn-outline-primary w-100" @click="testEndpoint('show_count')">
                        Test show_count
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Test Results -->
              <div v-if="testResults.length > 0" class="mb-4">
                <h5>Test Results</h5>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Endpoint</th>
                        <th>Status</th>
                        <th>Response Time</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="result in testResults" :key="result.id">
                        <td>{{ result.endpoint }}</td>
                        <td>
                          <span :class="['badge', result.success ? 'bg-success' : 'bg-danger']">
                            {{ result.success ? 'Success' : 'Failed' }}
                          </span>
                        </td>
                        <td>{{ result.responseTime }}ms</td>
                        <td>
                          <small class="text-muted">{{ result.message }}</small>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Console Logs -->
              <div class="mb-4">
                <h5>Console Logs</h5>
                <div class="bg-dark text-light p-3 rounded" style="max-height: 300px; overflow-y: auto;">
                  <pre class="mb-0"><code>{{ consoleLogs.join('\n') }}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout.vue'

export default {
  components: {
    BaseLayout
  },
  data() {
    return {
      connectionStatus: false,
      testResults: [],
      consoleLogs: [],
      testId: 0
    }
  },
  mounted() {
    this.log('Debug page loaded')
    this.testConnection()
  },
  methods: {
    log(message) {
      const timestamp = new Date().toLocaleTimeString()
      this.consoleLogs.push(`[${timestamp}] ${message}`)
      console.log(message)
    },
    async testConnection() {
      this.log('Testing API connection...')
      try {
        const startTime = Date.now()
        const response = await this.$axios.get('health')
        const responseTime = Date.now() - startTime
        
        this.connectionStatus = true
        this.log(`Connection successful (${responseTime}ms)`)
        
        this.addTestResult('Connection Test', true, responseTime, 'API is responding')
      } catch (error) {
        this.connectionStatus = false
        this.log(`Connection failed: ${error.message}`)
        
        this.addTestResult('Connection Test', false, 0, error.message)
      }
    },
    async testEndpoint(endpoint) {
      this.log(`Testing endpoint: ${endpoint}`)
      try {
        const startTime = Date.now()
        const response = await this.$axios.post(endpoint, {})
        const responseTime = Date.now() - startTime
        
        this.log(`${endpoint} successful (${responseTime}ms)`)
        this.addTestResult(endpoint, true, responseTime, 'Endpoint responded successfully')
      } catch (error) {
        this.log(`${endpoint} failed: ${error.message}`)
        this.addTestResult(endpoint, false, 0, error.message)
      }
    },
    addTestResult(endpoint, success, responseTime, message) {
      this.testResults.unshift({
        id: ++this.testId,
        endpoint,
        success,
        responseTime,
        message
      })
      
      // Keep only last 10 results
      if (this.testResults.length > 10) {
        this.testResults = this.testResults.slice(0, 10)
      }
    },
    clearLogs() {
      this.consoleLogs = []
      this.testResults = []
      this.log('Logs cleared')
    }
  }
}
</script>

<style lang="scss" scoped>
.debug-page {
  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
    
    &.connected {
      background-color: #28a745;
      box-shadow: 0 0 8px rgba(40, 167, 69, 0.5);
    }
    
    &.disconnected {
      background-color: #dc3545;
      box-shadow: 0 0 8px rgba(220, 53, 69, 0.5);
    }
  }
  
  .card {
    box-shadow: $box-shadow-lg;
  }
  
  pre {
    font-size: 0.85rem;
    line-height: 1.4;
  }
  
  .table {
    font-size: 0.9rem;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .debug-page {
    pre {
      font-size: 0.8rem;
    }
    
    .table {
      font-size: 0.85rem;
    }
  }
}
</style>
