<!--
 * @page: 页面-团队
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: zhangyu
 * @LastEditTime: 2021-07-06 14:08:01
-->
<template>
  <BaseLayout current="team">
    <!-- 团队页面内容 -->
    <div class="team-section">
      <!-- 页面标题 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="text-center">
            <h1 class="display-5 mb-3">
              <i class="fas fa-users me-3"></i>
              Our Team
            </h1>
            <p class="lead text-muted">
              If you have any questions or concerns about CITEdb, contact us!
            </p>
          </div>
        </div>
      </div>

      <!-- 通讯作者 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-star me-2"></i>
                Corresponding Author
              </h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Institution</th>
                      <th>Contribution</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in correspondingAuthors" :key="item.name">
                      <td class="fw-bold">{{ item.name }}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="fas fa-university text-primary me-2"></i>
                          {{ item.institution }}
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="fas fa-tasks text-primary me-2"></i>
                          {{ item.contribution }}
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="fas fa-envelope text-success me-2"></i>
                          <a :href="`mailto:${item.email}`" class="text-decoration-none">
                            {{ item.email }}
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 贡献者列表 -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-user-friends me-2"></i>
                Contributor Lists
              </h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Institution</th>
                      <th>Contribution</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in list" :key="item.name">
                      <td class="fw-bold">{{ item.name }}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="fas fa-university text-primary me-2"></i>
                          {{ item.institution }}
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="fas fa-tasks text-primary me-2"></i>
                          {{ item.contribution }}
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="fas fa-envelope text-success me-2"></i>
                          <a :href="`mailto:${item.contact}`" class="text-decoration-none">
                            {{ item.contact }}
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
      list: [{
        name: 'Nayang Shan',
        institution: 'Tsinghua University',
        contribution: 'Data collection',
        contact: 'shanny01@foxmail.com',
        type: 'data'
      }, {
        name: 'Dongyu Li',
        institution: 'Tsinghua University',
        contribution: 'Data collection',
        contact: 'lidongyu16@mails.tsinghua.edu.cn',
        type: 'data'
      }, {
        name: 'Yao Lu',
        institution: 'Tsinghua University',
        contribution: 'Data collection',
        contact: 'luytsinghua@126.com',
        type: 'data'
      }, {
        name: 'Linlin Yan',
        institution: 'Simcere Diagnostics Inc.',
        contribution: 'Data collection',
        contact: 'linlin.yan@bioinfo.app',
        type: 'data'
      }, {
        name: 'Hailong Shen',
        institution: 'Simcere Diagnostics Inc.',
        contribution: 'Website developer',
        contact: 'hailong.shen@simceredx.com',
        type: 'developer'
      }, {
        name: 'Jiudong Gao',
        institution: 'Simcere Diagnostics Inc.',
        contribution: 'Website developer',
        contact: 'jiudong.gao@simceredx.com',
        type: 'developer'
      }, {
        name: 'Yu Zhang',
        institution: 'Simcere Diagnostics Inc.',
        contribution: 'Website developer',
        contact: 'yu.zhang@simceredx.com',
        type: 'developer'
      }],
      correspondingAuthors: [{
        name: 'Lin Hou',
        institution: 'Tsinghua University',
        contribution: 'Data collection',
        email: 'houl@tsinghua.edu.cn'
      }, {
        name: 'Hao Guo',
        institution: 'Simcere Diagnostics Inc.',
        contribution: 'Website developer',
        email: 'hao.guo@simceredx.com'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.team-section {
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
  
  .table {
    th {
      font-weight: 600;
      color: $text-primary;
    }
    
    td {
      vertical-align: middle;
    }
    
    // 确保两个表格列宽完全一致
    th:nth-child(1), td:nth-child(1) {
      width: 20%; // Name column
    }
    
    th:nth-child(2), td:nth-child(2) {
      width: 30%; // Institution column
    }
    
    th:nth-child(3), td:nth-child(3) {
      width: 25%; // Contribution column
    }
    
    th:nth-child(4), td:nth-child(4) {
      width: 25%; // Contact column
    }
  }
  
  a {
    color: $primary;
    
    &:hover {
      color: $primary-dark;
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .team-section {
    .table-responsive {
      font-size: 0.9rem;
    }
    
    .table {
      th:nth-child(1), td:nth-child(1) {
        width: 25%;
      }
      
      th:nth-child(2), td:nth-child(2) {
        width: 25%;
      }
      
      th:nth-child(3), td:nth-child(3) {
        width: 25%;
      }
      
      th:nth-child(4), td:nth-child(4) {
        width: 25%;
      }
    }
  }
}
</style>
