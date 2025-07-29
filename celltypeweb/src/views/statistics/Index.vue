<!--
 * @page: 页面-图表
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: Dragon
 * @LastEditTime: 2022-04-06 09:12:49
-->
<template>
  <BaseLayout current="statistics">
    <!-- 统计页面内容 -->
    <div class="statistics-section">
      <!-- 页面标题 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="text-center">
            <h1 class="display-5 mb-3">
              <i class="fas fa-chart-line me-3"></i>
              Database Statistics
            </h1>
            <p class="lead text-muted">
              Comprehensive analysis and visualization of CITEdb data
            </p>
          </div>
        </div>
      </div>

      <!-- 选择器 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-filter me-2"></i>
                Select Analysis Type
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4 mb-3" v-for="option in chartOptions" :key="option.value">
                  <div class="form-check">
                    <input 
                      class="form-check-input" 
                      type="radio" 
                      :id="option.value"
                      :value="option.value"
                      v-model="target"
                      @change="changeTarget"
                    >
                    <label class="form-check-label" :for="option.value">
                      {{ option.label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表展示 -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-chart-bar me-2"></i>
                {{ getCurrentChartTitle() }}
              </h5>
            </div>
            <div class="card-body">
              <div class="chart-container">
                <div v-if="loading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-3 text-muted">Loading chart data...</p>
                </div>
                <div v-show="target === 'first' && !loading" ref="chart1" class="chart-item"></div>
                <div v-show="target === 'second' && !loading" ref="chart2" class="chart-item"></div>
                <div v-show="target === 'third' && !loading" ref="chart3" class="chart-item"></div>
                <div v-show="target === 'fourth' && !loading" ref="chart4" class="chart-item"></div>
                <div v-show="target === 'five' && !loading" ref="chart5" class="chart-item"></div>
                <div v-show="target === 'six' && !loading" ref="chart6" class="chart-item"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script>
import * as echarts from 'echarts'
import BaseLayout from '@/components/BaseLayout.vue'

export default {
  components: {
    BaseLayout
  },
  data () {
    return {
      target: 'first',
      chartOptions: [
        { value: 'first', label: 'Number of cell-cell interactions reported each year' },
        { value: 'second', label: 'Number of cell-cell interactions in the top 10 physiological contexts' },
        { value: 'third', label: 'Number of cell-cell interactions in the top 10 source cell types' },
        { value: 'fourth', label: 'Number of cell-cell interactions in the top 10 target cell types' },
        { value: 'five', label: 'Number of cell-cell interactions in the top 10 pairs of cell types' },
        { value: 'six', label: 'Number of top ligand-receptor pairs' }
      ],
      loading: false
    }
  },
  mounted () {
    this.init1()
  },
  methods: {
    getCurrentChartTitle() {
      const option = this.chartOptions.find(opt => opt.value === this.target)
      return option ? option.label : 'Chart'
    },
    async changeTarget (event) {
      this.loading = true
      try {
        switch (event) {
          case 'first':
            await this.init1()
            break
          case 'second':
            await this.init2()
            break
          case 'third':
            await this.init3()
            break
          case 'fourth':
            await this.init4()
            break
          case 'five':
            await this.init5()
            break
          case 'six':
            await this.init6()
            break
          default:
            break
        }
      } catch (error) {
        console.error('Failed to load chart data:', error)
      } finally {
        this.loading = false
      }
    },
    async init1 () {
      try {
        const response = await this.$axios.get('/api/v1/statistics?type=yearly_interactions')
        if (response.data.msg === 'ok' && response.data.data) {
          const chartData = response.data.data
          const years = chartData.map(item => item.publication_year || 'Unknown')
          const counts = chartData.map(item => item.count || 0)
          
          const chart = this.$refs.chart1
          const cakeChart = echarts.init(chart)
          const option = {
            title: {
              text: 'Interactions of each year',
              textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: years,
              axisLabel: {
                fontSize: 12
              }
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                fontSize: 12
              }
            },
            series: [{
              data: counts,
              type: 'bar',
              itemStyle: {
                color: '#007bff'
              }
            }]
          }
          cakeChart.setOption(option)
        } else {
          console.error('Failed to get yearly interactions data:', response.data)
        }
      } catch (error) {
        console.error('Error loading yearly interactions chart:', error)
      }
    },
    async init2 () {
      try {
        const response = await this.$axios.get('/api/v1/statistics?type=context_interactions')
        if (response.data.msg === 'ok' && response.data.data) {
          const chartData = response.data.data
          const pieData = chartData.map(item => ({
            value: item.count || 0,
            name: item.context || 'Unknown'
          }))
          
          const chart = this.$refs.chart2
          const cakeChart = echarts.init(chart)
          const option = {
            title: {
              text: 'Top 10 physiological contexts',
              textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            tooltip: {
              trigger: 'item'
            },
            series: [{
              type: 'pie',
              radius: '50%',
              data: pieData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          }
          cakeChart.setOption(option)
        } else {
          console.error('Failed to get context interactions data:', response.data)
        }
      } catch (error) {
        console.error('Error loading context interactions chart:', error)
      }
    },
    async init3 () {
      try {
        const response = await this.$axios.get('/api/v1/statistics?type=source_cell_types')
        if (response.data.msg === 'ok' && response.data.data) {
          const chartData = response.data.data
          const cellTypes = chartData.map(item => item.source_cell_type || 'Unknown')
          const counts = chartData.map(item => item.count || 0)
          
          const chart = this.$refs.chart3
          const cakeChart = echarts.init(chart)
          const option = {
            title: {
              text: 'Top 10 source cell types',
              textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              axisLabel: {
                fontSize: 12
              }
            },
            yAxis: {
              type: 'category',
              data: cellTypes,
              axisLabel: {
                fontSize: 12
              }
            },
            series: [{
              data: counts,
              type: 'bar',
              itemStyle: {
                color: '#28a745'
              }
            }]
          }
          cakeChart.setOption(option)
        } else {
          console.error('Failed to get source cell types data:', response.data)
        }
      } catch (error) {
        console.error('Error loading source cell types chart:', error)
      }
    },
    async init4 () {
      try {
        const response = await this.$axios.get('/api/v1/statistics?type=target_cell_types')
        if (response.data.msg === 'ok' && response.data.data) {
          const chartData = response.data.data
          const cellTypes = chartData.map(item => item.target_cell_type || 'Unknown')
          const counts = chartData.map(item => item.count || 0)
          
          const chart = this.$refs.chart4
          const cakeChart = echarts.init(chart)
          const option = {
            title: {
              text: 'Top 10 target cell types',
              textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              axisLabel: {
                fontSize: 12
              }
            },
            yAxis: {
              type: 'category',
              data: cellTypes,
              axisLabel: {
                fontSize: 12
              }
            },
            series: [{
              data: counts,
              type: 'bar',
              itemStyle: {
                color: '#ffc107'
              }
            }]
          }
          cakeChart.setOption(option)
        } else {
          console.error('Failed to get target cell types data:', response.data)
        }
      } catch (error) {
        console.error('Error loading target cell types chart:', error)
      }
    },
    async init5 () {
      try {
        const response = await this.$axios.get('/api/v1/statistics?type=cell_type_pairs')
        if (response.data.msg === 'ok' && response.data.data) {
          const chartData = response.data.data
          const pieData = chartData.map(item => ({
            value: item.count || 0,
            name: `${item.source_cell_type || 'Unknown'} - ${item.target_cell_type || 'Unknown'}`
          }))
          
          const chart = this.$refs.chart5
          const cakeChart = echarts.init(chart)
          const option = {
            title: {
              text: 'Top 10 pairs of cell types',
              textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            tooltip: {
              trigger: 'item'
            },
            series: [{
              type: 'pie',
              radius: '50%',
              data: pieData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          }
          cakeChart.setOption(option)
        } else {
          console.error('Failed to get cell type pairs data:', response.data)
        }
      } catch (error) {
        console.error('Error loading cell type pairs chart:', error)
      }
    },
    async init6 () {
      try {
        const response = await this.$axios.get('/api/v1/statistics?type=interaction_details')
        if (response.data.msg === 'ok' && response.data.data) {
          const chartData = response.data.data
          const interactions = chartData.map(item => item.interaction_type || 'Unknown')
          const counts = chartData.map(item => item.count || 0)
          
          const chart = this.$refs.chart6
          const cakeChart = echarts.init(chart)
          const option = {
            title: {
              text: 'Top ligand-receptor pairs',
              textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: interactions,
              axisLabel: {
                fontSize: 12,
                rotate: 45
              }
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                fontSize: 12
              }
            },
            series: [{
              data: counts,
              type: 'bar',
              itemStyle: {
                color: '#dc3545'
              }
            }]
          }
          cakeChart.setOption(option)
        } else {
          console.error('Failed to get interaction details data:', response.data)
        }
      } catch (error) {
        console.error('Error loading interaction details chart:', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.statistics-section {
  .chart-container {
    .chart-item {
      height: 500px;
      width: 100%;
    }
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
  
  .form-check {
    margin-bottom: 0.5rem;
    
    .form-check-label {
      font-size: 1rem;
      cursor: pointer;
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .statistics-section {
    .chart-container {
      .chart-item {
        height: 400px;
      }
    }
    
    .form-check {
      .form-check-label {
        font-size: 0.9rem;
      }
    }
  }
}
</style>
