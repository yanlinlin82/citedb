<!--
 * @Author: zhangyu
 * @Date: 2021-06-29 21:07:12
 * @LastEditTime: 2022-04-06 14:07:21
-->
<template>
  <BaseLayout current="help">
    <!-- 帮助页面内容 -->
    <div class="help-section">
      <!-- 页面标题 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="text-center">
            <h1 class="display-5 mb-3">
              <i class="fas fa-question-circle me-3"></i>
              Help & Documentation
            </h1>
            <p class="lead text-muted">
              Learn how to use CITEdb effectively
            </p>
          </div>
        </div>
      </div>

      <!-- 帮助内容 -->
      <div class="row">
        <div class="col-12">
          <div class="help-content">
            <!-- 关于CITEdb -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-info-circle me-2"></i>
                  About CITEdb
                </h5>
              </div>
              <div class="card-body">
                <p class="mb-0">
                  CITEdb (Cell-cell InTEraction database) is a manually curated database of cell-cell interactions at cell type level, which was derived from 509 published papers in PubMed before January 17, 2022 by 3 reviewers. 728 pairs of cell-cell interactions in human were collected and deposited in current version.
                </p>
              </div>
            </div>

            <!-- 如何使用 -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-play-circle me-2"></i>
                  How to Use
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <div class="feature-item">
                      <h6 class="text-primary">
                        <i class="fas fa-search me-2"></i>
                        Search Functionality
                      </h6>
                      <ul class="list-unstyled">
                        <li><i class="fas fa-check text-success me-2"></i><strong>Context Search:</strong> Use the left tree to search for interactions in specific biological contexts</li>
                        <li><i class="fas fa-check text-success me-2"></i><strong>Cell Type Search:</strong> Use the right tree to search for interactions involving specific cell types</li>
                        <li><i class="fas fa-check text-success me-2"></i><strong>Method Filter:</strong> Filter results by experimental or computational methods</li>
                        <li><i class="fas fa-check text-success me-2"></i><strong>Demo Buttons:</strong> Try the Demo1 and Demo2 buttons for quick examples</li>
                      </ul>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="feature-item">
                      <h6 class="text-primary">
                        <i class="fas fa-download me-2"></i>
                        Download Data
                      </h6>
                      <p class="mb-2">
                        You can download the complete CITEdb dataset in Excel format from the Download page.
                      </p>
                    </div>
                    <div class="feature-item">
                      <h6 class="text-primary">
                        <i class="fas fa-chart-bar me-2"></i>
                        Statistics
                      </h6>
                      <p class="mb-0">
                        View comprehensive statistics and visualizations of the database on the Statistics page.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 联系信息 -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-envelope me-2"></i>
                  Contact
                </h5>
              </div>
              <div class="card-body">
                <p class="mb-0">
                  For questions or suggestions, please contact our team through the Team page.
                </p>
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
  data () {
    return {
      // 移除有问题的组件相关数据
    }
  },
  mounted () {
    console.log('Help page loaded successfully')
  },
  methods: {
    // 移除有问题的组件方法
  }
}
</script>

<style lang="scss" scoped>
.help-section {
  .help-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .card {
    box-shadow: $box-shadow;
    transition: $transition-base;
    
    &:hover {
      box-shadow: $box-shadow-lg;
    }
  }
  
  .card-header {
    background-color: $bg-secondary;
    border-bottom: 1px solid $border-color;
  }
  
  .feature-item {
    h6 {
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    ul {
      li {
        margin-bottom: 0.5rem;
        font-size: 0.95rem;
      }
    }
    
    p {
      font-size: 0.95rem;
      color: $text-secondary;
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .help-section {
    .feature-item {
      h6 {
        font-size: 1rem;
      }
      
      ul {
        li {
          font-size: 0.9rem;
        }
      }
      
      p {
        font-size: 0.9rem;
      }
    }
  }
}
</style>
