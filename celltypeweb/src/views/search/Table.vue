<!--
 * @page: 组件-table
 * @Author: Dragon
 * @Date: 2021-06-25 13:38:48
 * @LastEditors: Dragon
 * @LastEditTime: 2022-04-07 13:45:17
-->
<template>
  <div>
    <div class="downloadBox">
      <div class="download-info">
        <h2>Result</h2>
        <div class="download-stats">
          <span class="download-count">Downloads: {{ downloadCount }}</span>
          <span class="last-download" v-if="lastDownloadTime">
            Last: {{ formatTime(lastDownloadTime) }}
          </span>
        </div>
      </div>
      <el-button 
        :disabled="!chartList || chartList.length === 0" 
        @click="download" 
        type="primary"
        :loading="downloading"
      >
        {{ downloading ? 'Downloading...' : 'Download Excel' }}
      </el-button>
    </div>
    <el-table
      :data="tableList"
      border
      empty-text="No Data"
      style="width: 100%;">
      <el-table-column
        width="130"
        align="center"
        prop="publication_year"
        label="Publication year">
      </el-table-column>
      <el-table-column
        width="90"
        align="center"
        prop="organism"
        label="Organism">
      </el-table-column>
      <el-table-column
        width="200"
        align="center"
        prop="mesh_name"
        :show-overflow-tooltip="true"
        label="Mesh Term">
        <template #default="scope">
          <div style="display:flex;flex-direction:column;">
            <el-link class="block" v-for="(item, index) in filterId(scope.row)" :key="item" @click="go(scope.row.url && scope.row.url[index] ? scope.row.url[index] : '#')" type="primary">{{filterName(scope.row, index, item)}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="context"
        label="Context">
      </el-table-column>
      <el-table-column
        width="80"
        align="center"
        prop="phase"
        label="Phase">
      </el-table-column>
      <el-table-column
        width="80"
        align="center"
        prop="tissue"
        label="Tissue">
      </el-table-column>
      <el-table-column
        width="150"
        align="center"
        prop="function"
        :show-overflow-tooltip="true"
        label="Function">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="source_cell_type_class"
        label="Source cell type class">
      </el-table-column>
      <el-table-column
        width="140"
        align="center"
        prop="source_cell_type"
        label="Source cell type">
      </el-table-column>
      <el-table-column
        width="180"
        align="center"
        prop="target_cell_type_class"
        label="Target cell type class">
      </el-table-column>
      <el-table-column
        width="130"
        align="center"
        prop="target_cell_type"
        label="Target cell type">
      </el-table-column>
      <el-table-column
        width="130"
        align="center"
        prop="clear_direction"
        label="Clear direction">
      </el-table-column>
      <el-table-column
        width="170"
        align="center"
        prop="reciprocal_direction"
        label="Reciprocal direction">
      </el-table-column>
      <el-table-column
        width="100"
        align="center"
        prop="interaction"
        label="Interaction details">
      </el-table-column>
      <el-table-column
        width="150"
        align="center"
        prop="method"
        label="Method">
      </el-table-column>
      <el-table-column
        width="160"
        align="center"
        prop="method_details"
        label="Method details">
      </el-table-column>
      <el-table-column
      :show-overflow-tooltip="true"
        width="150"
        align="center"
        prop="reference"
        label="Reference">
      </el-table-column>
      <el-table-column
        width="100"
        align="center"
        prop="information"
        label="Information">
      </el-table-column>
      <el-table-column
        width="100"
        align="center"
        prop="full_pdf"
        label="Full PDF">
      </el-table-column>
      <el-table-column
        width="100"
        align="center"
        prop="pmid"
        label="PMID">
      </el-table-column>
      <el-table-column
      :show-overflow-tooltip="true"
        width="150"
        align="center"
        prop="title"
        label="Title">
      </el-table-column>
      <!-- <el-table-column
      :show-overflow-tooltip="true"
        width="150"
        align="center"
        prop="version"
        label="Version">
      </el-table-column> -->
    </el-table>
    <el-pagination
      style="margin: 30px 0"
      class="table_pagination"
      background
      :page-size="size"
      layout="total,sizes,prev,pager,next,jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
// eslint-disable-next-line camelcase
import { export_json_to_excel } from '@/utils/Export2Excel'
export default {
  props: ['total', 'size', 'tableList', 'chartList'],
  data() {
    return {
      downloadCount: 0,
      lastDownloadTime: null,
      downloading: false
    }
  },
  async mounted() {
    // 获取当前下载次数
    await this.getDownloadCount()
  },
  methods: {
    // 获取下载次数
    async getDownloadCount() {
      try {
        const response = await this.$axios.get('/api/v1/download/count')
        if (response.msg === 'ok' && response.data) {
          this.downloadCount = response.data.count || 0
        } else {
          console.warn('Download count API returned unexpected response:', response)
          this.downloadCount = 0
        }
      } catch (error) {
        console.error('Failed to get download count:', error)
        // 如果API失败，设置默认值，不影响用户体验
        this.downloadCount = 0
      }
    },
    
    // 更新下载次数
    async updateDownloadCount() {
      try {
        const response = await this.$axios.post('/api/v1/download/update', {
          count: this.downloadCount
        })
        if (response.msg === 'ok') {
          this.downloadCount++
          console.log('Download count updated successfully:', this.downloadCount)
        } else {
          console.warn('Download count update returned unexpected response:', response)
          // 即使API返回错误，也增加本地计数
          this.downloadCount++
        }
      } catch (error) {
        console.error('Failed to update download count:', error)
        // 即使API失败，也增加本地计数，确保用户体验不受影响
        this.downloadCount++
      }
    },
    
    // 点击每页多少条
    handleSizeChange (val) {
      this.$emit('handleSizeChange', val)
    },
    // 点击页数
    handleCurrentChange (val) {
      this.$emit('handleCurrentChange', val)
    },
    filterId (row) {
      const list = row.mesh_name ? row.mesh_name.split('|') : []
      return list
    },
    filterName (row, index, item) {
      if (!row.mesh_name || !row.url || !row.url[index]) {
        return item || ''
      }
      const name = `${row.mesh_name.split('|')[index]} (${row.url[index].split('id=')[1]})`
      return name
    },
    go (url) {
      window.open(url)
    },
    download () {
      // 检查chartList是否存在
      if (!this.chartList || this.chartList.length === 0) {
        this.$message.warning('No data available for download')
        return
      }
      
      // 显示下载开始提示
      this.$message.info(`Preparing ${this.chartList.length} records for download...`)
      
      // 列表标题
      const tHeader = [
        'Publication year',
        'Organism',
        'Mesh ID',
        'Mesh Term',
        'Context',
        'Phase',
        'Tissue',
        'Function',
        'Source cell type class',
        'Source cell type',
        'Target cell type class',
        'Target cell type',
        'Clear direction',
        'Reciprocal direction',
        'Interaction details',
        'Method',
        'Method details',
        'Reference',
        'Information',
        'Full PDF',
        'PMID',
        'Title'
      ]
      // 标题对应的对象属性
      const filterVal = [
        'publication_year',
        'organism',
        'mesh_id',
        'mesh_name',
        'context',
        'phase',
        'tissue',
        'function',
        'source_cell_type_class',
        'source_cell_type',
        'target_cell_type_class',
        'target_cell_type',
        'clear_direction',
        'reciprocal_direction',
        'interaction',
        'method',
        'method_details',
        'reference',
        'information',
        'full_pdf',
        'pmid',
        'title'
      ]
      // 数据整理
      const data = this.chartList.map(v => filterVal.map(j => v[j]))
      
      // 开始下载
      this.downloading = true;
      
      // 导出Excel文件
      export_json_to_excel(tHeader, data, 'CITEdb_Result')
        .then(async () => {
          // 更新服务器数据库中的下载次数
          await this.updateDownloadCount();
          this.lastDownloadTime = new Date();
          this.downloading = false;
          
          this.$message.success(`Download completed! File contains ${this.chartList.length} records.`);
        })
        .catch(error => {
          console.error('Download failed:', error);
          this.downloading = false;
          this.$message.error('Download failed. Please try again.');
        });
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      let date;
      if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else {
        date = new Date(timestamp);
      }
      
      if (isNaN(date.getTime())) return '';
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  }
}
</script>

<style lang="scss" scoped>
  .downloadBox{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 20px;
  }
  .download-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    h2 {
      margin: 0 0 8px 0;
      color: #303133;
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
  .download-stats {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 5px;
    font-size: 0.875rem;
    color: #606266;
    
    .download-count {
      margin-right: 15px;
      padding: 4px 8px;
      background-color: #f0f9ff;
      border: 1px solid #b3d8ff;
      border-radius: 4px;
      color: #409eff;
      font-weight: 500;
    }
    
    .last-download {
      font-style: italic;
      color: #909399;
    }
  }
  .download-history {
    margin-top: 15px;
    padding: 10px;
    background-color: #f5f7fa;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    width: 100%;

    .history-title {
      font-size: 0.9rem;
      color: #303133;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .history-list {
      font-size: 0.8rem;
      color: #606266;
      line-height: 1.5;

      .history-item {
        padding: 4px 0;
      }
    }
  }
</style>
