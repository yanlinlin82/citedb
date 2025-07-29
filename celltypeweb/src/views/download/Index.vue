<!--
 * @page: 页面-下载
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: Dragon
 * @LastEditTime: 2022-04-07 14:00:32
-->
<template>
  <BaseLayout current="download">
    <!-- 下载页面内容 -->
    <div class="download-section">
      <!-- 页面标题 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="text-center">
            <h1 class="display-5 mb-3">
              <i class="fas fa-download me-3"></i>
              Download Data
            </h1>
            <p class="lead text-muted">
              Select the menu 'Download' to obtain the whole information extracted from 509 published papers in CITEdb, including 728 pairs of cell to cell interactions in human.
            </p>
          </div>
        </div>
      </div>

      <!-- 下载表格 -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-table me-2"></i>
                Available Downloads
              </h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>File Name</th>
                      <th>Description</th>
                      <th>Download Times</th>
                      <th>Latest Download</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in list" :key="item.name">
                      <td>
                        <div class="d-flex align-items-center">
                          <i class="fas fa-file-excel text-success me-2"></i>
                          <a 
                            href="https://citedb.cn/CITEdb.xlsx" 
                            @click="download"
                            class="text-decoration-none fw-bold"
                          >
                            {{ item.name }}
                          </a>
                        </div>
                      </td>
                      <td>{{ item.description }}</td>
                      <td>
                        <span class="badge bg-primary">{{ item.times }}</span>
                      </td>
                      <td>{{ item.last || 'Never' }}</td>
                      <td>{{ item.size }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 下载说明 -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-info-circle me-2"></i>
                Download Information
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h6>Data Format</h6>
                  <p class="text-muted">
                    The data is provided in Excel (.xlsx) format for easy analysis and integration with other tools.
                  </p>
                </div>
                <div class="col-md-6">
                  <h6>Data Content</h6>
                  <p class="text-muted">
                    Contains comprehensive information about cell-cell interactions, including context, cell types, methods, and references.
                  </p>
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
  data () {
    return {
      list: [{
        name: 'CITEdb.xlsx',
        description: 'CITEdb information',
        last: '',
        size: '152KB',
        times: 0
      }]
    }
  },
  created () {
    this.$axios.post('show_count', {}).then((res) => {
      if (res.msg === 'ok') {
        this.list[0].times = res.data.count
        this.list[0].last = res.data.update_time
      }
    }).catch(err => {
      console.log('获取下载次数失败:', err)
    })
  },
  beforeUnmount() {
    // 清理组件状态
    this.list = []
  },
  methods: {
    Update_Count () {
      this.$axios.post('update_count', {
        count: this.list[0].times
      }).then(() => {
        location.reload()
      }).catch(err => {
        console.log('更新下载次数失败:', err)
      })
    },
    download () {
      const link = document.createElement('a')
      link.setAttribute('download', 'CITEdb.xlsx') // 下载的文件名
      link.setAttribute('href', 'https://citedb.cn/CITEdb.xlsx') // 下载链接
      link.click()
      this.Update_Count()
    }
  }
}
</script>

<style lang="scss" scoped>
.download-section {
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
  }
  
  .badge {
    font-size: 0.9rem;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .download-section {
    .table-responsive {
      font-size: 0.9rem;
    }
    
    .badge {
      font-size: 0.8rem;
    }
  }
}
</style>
