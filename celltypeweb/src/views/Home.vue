<template>
  <BaseLayout current="home">
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section py-5 bg-gradient-primary text-white">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-8 mx-auto text-center">
              <h1 class="display-4 fw-bold mb-4">
                <i class="fas fa-rocket me-3"></i>
                Bootstrap Integration Test
              </h1>
              <p class="lead mb-5">
                This page demonstrates the successful integration of Bootstrap and FontAwesome in CITEdb.
              </p>
              <div class="hero-buttons">
                <button class="btn btn-light btn-lg me-3 mb-2" @click="testAPI">
                  <i class="fas fa-plug me-2"></i>
                  Test API Connection
                </button>
                <button class="btn btn-outline-light btn-lg mb-2">
                  <i class="fas fa-info-circle me-2"></i>
                  Learn More
                </button>
              </div>
              <!-- API Test Result -->
              <div v-if="apiTestResult" class="mt-4">
                <div :class="['alert', apiTestResult.success ? 'alert-success' : 'alert-danger']" role="alert">
                  <i :class="apiTestResult.success ? 'fas fa-check-circle' : 'fas fa-times-circle'" class="me-2"></i>
                  {{ apiTestResult.message }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Components Demo Section -->
      <section class="components-section py-5">
        <div class="container">
          <h2 class="text-center text-primary mb-5">
            <i class="fas fa-cogs me-2"></i>
            Bootstrap Components Demo
          </h2>
          
          <!-- Alerts -->
          <div class="row mb-5">
            <div class="col-12">
              <h3 class="mb-3">Alerts</h3>
              <div class="alert alert-primary" role="alert">
                <i class="fas fa-info-circle me-2"></i>
                This is a primary alert—check it out!
              </div>
              <div class="alert alert-success" role="alert">
                <i class="fas fa-check-circle me-2"></i>
                This is a success alert—check it out!
              </div>
              <div class="alert alert-warning" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                This is a warning alert—check it out!
              </div>
              <div class="alert alert-danger" role="alert">
                <i class="fas fa-times-circle me-2"></i>
                This is a danger alert—check it out!
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="row mb-5">
            <div class="col-12">
              <h3 class="mb-3">Buttons</h3>
              <button class="btn btn-primary me-2 mb-2">
                <i class="fas fa-save me-1"></i>Primary
              </button>
              <button class="btn btn-secondary me-2 mb-2">
                <i class="fas fa-cog me-1"></i>Secondary
              </button>
              <button class="btn btn-success me-2 mb-2">
                <i class="fas fa-check me-1"></i>Success
              </button>
              <button class="btn btn-danger me-2 mb-2">
                <i class="fas fa-trash me-1"></i>Danger
              </button>
              <button class="btn btn-warning me-2 mb-2">
                <i class="fas fa-exclamation me-1"></i>Warning
              </button>
              <button class="btn btn-info me-2 mb-2">
                <i class="fas fa-info me-1"></i>Info
              </button>
            </div>
          </div>

          <!-- Cards -->
          <div class="row mb-5">
            <div class="col-12">
              <h3 class="mb-3">Cards</h3>
            </div>
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body text-center">
                  <i class="fas fa-chart-line fa-3x text-primary mb-3"></i>
                  <h5 class="card-title">Analytics</h5>
                  <p class="card-text">Track your data with powerful analytics tools.</p>
                  <button class="btn btn-primary">Learn More</button>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body text-center">
                  <i class="fas fa-shield-alt fa-3x text-success mb-3"></i>
                  <h5 class="card-title">Security</h5>
                  <p class="card-text">Enterprise-grade security for your data.</p>
                  <button class="btn btn-success">Learn More</button>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <div class="card h-100">
                <div class="card-body text-center">
                  <i class="fas fa-rocket fa-3x text-warning mb-3"></i>
                  <h5 class="card-title">Performance</h5>
                  <p class="card-text">Lightning-fast performance and reliability.</p>
                  <button class="btn btn-warning">Learn More</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Forms -->
          <div class="row mb-5">
            <div class="col-md-6 mx-auto">
              <h3 class="mb-3">Forms</h3>
              <div class="card">
                <div class="card-body">
                  <form>
                    <div class="mb-3">
                      <label for="email" class="form-label">Email address</label>
                      <input type="email" class="form-control" id="email" placeholder="name@example.com">
                    </div>
                    <div class="mb-3">
                      <label for="password" class="form-label">Password</label>
                      <input type="password" class="form-control" id="password">
                    </div>
                    <div class="mb-3 form-check">
                      <input type="checkbox" class="form-check-input" id="remember">
                      <label class="form-check-label" for="remember">Remember me</label>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Bars -->
          <div class="row mb-5">
            <div class="col-12">
              <h3 class="mb-3">Progress Bars</h3>
              <div class="progress mb-3">
                <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">25%</div>
              </div>
              <div class="progress mb-3">
                <div class="progress-bar bg-success" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>
              </div>
              <div class="progress mb-3">
                <div class="progress-bar bg-warning" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">75%</div>
              </div>
              <div class="progress">
                <div class="progress-bar bg-danger" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">100%</div>
              </div>
            </div>
          </div>

          <!-- Badges -->
          <div class="row mb-5">
            <div class="col-12">
              <h3 class="mb-3">Badges</h3>
              <span class="badge bg-primary me-2">Primary</span>
              <span class="badge bg-secondary me-2">Secondary</span>
              <span class="badge bg-success me-2">Success</span>
              <span class="badge bg-danger me-2">Danger</span>
              <span class="badge bg-warning me-2">Warning</span>
              <span class="badge bg-info me-2">Info</span>
              <span class="badge bg-light text-dark me-2">Light</span>
              <span class="badge bg-dark">Dark</span>
            </div>
          </div>

          <!-- Tables -->
          <div class="row mb-5">
            <div class="col-12">
              <h3 class="mb-3">Tables</h3>
              <div class="table-responsive">
                <table class="table table-striped table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Office</th>
                      <th>Age</th>
                      <th>Start date</th>
                      <th>Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Doe</td>
                      <td>Developer</td>
                      <td>New York</td>
                      <td>30</td>
                      <td>2020/01/01</td>
                      <td>$120,000</td>
                    </tr>
                    <tr>
                      <td>Jane Smith</td>
                      <td>Designer</td>
                      <td>London</td>
                      <td>28</td>
                      <td>2020/02/01</td>
                      <td>$95,000</td>
                    </tr>
                    <tr>
                      <td>Bob Johnson</td>
                      <td>Manager</td>
                      <td>Paris</td>
                      <td>35</td>
                      <td>2020/03/01</td>
                      <td>$150,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Modal Trigger -->
          <div class="row mb-5">
            <div class="col-12 text-center">
              <h3 class="mb-3">Modal</h3>
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#demoModal">
                <i class="fas fa-external-link-alt me-2"></i>
                Launch Demo Modal
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Demo Modal -->
    <div class="modal fade" id="demoModal" tabindex="-1" aria-labelledby="demoModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="demoModalLabel">
              <i class="fas fa-info-circle me-2"></i>
              Demo Modal
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>This is a demo modal showing Bootstrap modal functionality.</p>
            <p>You can close this modal by clicking the X button, clicking outside the modal, or pressing the Escape key.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
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
      apiTestResult: null
    }
  },
  methods: {
    async testAPI() {
      try {
        const response = await this.$axios.get('/api/v1/health')
        this.apiTestResult = {
          success: true,
          message: `API connection successful! Response: ${JSON.stringify(response.data)}`
        }
      } catch (error) {
        this.apiTestResult = {
          success: false,
          message: `API connection failed: ${error.message}`
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  .hero-section {
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    min-height: 60vh;
    display: flex;
    align-items: center;
  }
  
  .components-section {
    background-color: $bg-light;
  }
  
  .card {
    transition: $transition-base;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: $box-shadow-lg;
    }
  }
  
  .progress {
    height: 25px;
  }
  
  .table {
    th {
      font-weight: 600;
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .home-page {
    .hero-section {
      min-height: 50vh;
      
      .display-4 {
        font-size: 2rem;
      }
      
      .lead {
        font-size: 1rem;
      }
    }
    
    .hero-buttons {
      .btn {
        display: block;
        width: 100%;
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
