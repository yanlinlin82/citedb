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

      <!-- 选择器和图表展示 -->
      <div class="row">
        <!-- 左侧选择器 -->
        <div class="col-md-3">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-filter me-2"></i>
                Analysis Type
              </h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button 
                  v-for="option in chartOptions" 
                  :key="option.value"
                  class="btn btn-outline-primary text-start"
                  :class="{ 'active': target === option.value }"
                  @click="changeTarget(option.value)"
                >
                  <i class="fas fa-chart-bar me-2"></i>
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧图表展示 -->
        <div class="col-md-9">
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
import statisticsData from '@/assets/data/statistics.json'

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
      loading: false,
      statisticsData: statisticsData,
      chartInstances: {}, // 存储图表实例
      resizeTimer: null // 防抖定时器
    }
  },
  mounted () {
    // 延迟初始化第一个图表，确保DOM完全加载
    this.$nextTick(() => {
      setTimeout(() => {
        this.init1()
      }, 200) // 增加延迟时间确保DOM完全渲染
    })
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy () {
    // 清理所有图表实例
    this.disposeAllCharts()
    // 移除窗口大小变化监听
    window.removeEventListener('resize', this.handleResize)
    // 清理定时器
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer)
    }
  },
  methods: {
    getCurrentChartTitle() {
      const option = this.chartOptions.find(opt => opt.value === this.target)
      return option ? option.label : 'Chart'
    },
    
    async changeTarget (event) {
      console.log('Changing target to:', event)
      
      // 先清理所有图表实例
      this.disposeAllCharts()
      
      // 更新选中的目标
      this.target = event
      this.loading = true
      
      try {
        // 等待DOM更新
        await this.$nextTick()
        
        // 额外等待确保DOM完全更新
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // 根据选择初始化对应图表
        switch (event) {
          case 'first':
            this.init1()
            break
          case 'second':
            this.init2()
            break
          case 'third':
            this.init3()
            break
          case 'fourth':
            this.init4()
            break
          case 'five':
            this.init5()
            break
          case 'six':
            this.init6()
            break
          default:
            break
        }
        
        // 延迟调整大小
        setTimeout(() => {
          this.refreshCurrentChart()
        }, 300) // 增加延迟时间
      } catch (error) {
        console.error('Failed to load chart data:', error)
      } finally {
        this.loading = false
      }
    },
    
    // 清理所有图表实例
    disposeAllCharts() {
      for (const key in this.chartInstances) {
        if (this.chartInstances.hasOwnProperty(key) && this.chartInstances[key]) {
          try {
            this.chartInstances[key].dispose()
          } catch (error) {
            console.warn(`Error disposing chart ${key}:`, error)
          }
        }
      }
      this.chartInstances = {}
    },
    
    async init1 () {
      const chartData = this.statisticsData.yearly_interactions
      
      // 验证数据
      if (!this.validateChartData(chartData, 'chart1')) {
        return
      }
      
      const years = chartData.data.map(item => item.year)
      const counts = chartData.data.map(item => item.count)
      
      const option = {
        title: {
          text: chartData.title,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            return `${params[0].name}<br/>Count: ${params[0].value}`
          }
        },
        grid: {
          left: '3%',
          right: '8%',
          bottom: '3%',
          top: '15%',
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
          data: years,
          axisLabel: {
            fontSize: 12,
            width: 80,
            overflow: 'truncate'
          }
        },
        series: [{
          name: 'Count',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: '#007bff'
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}'
          },
          emphasis: {
            itemStyle: {
              color: '#0056b3'
            }
          }
        }]
      }
      
      this.initializeChart('chart1', chartData, option)
    },
    async init2 () {
      const chartData = this.statisticsData.context_interactions
      
      // 验证数据
      if (!this.validateChartData(chartData, 'chart2')) {
        return
      }
      
      // 按count升序排序（除第一幅图外，其他图都按柱子高度升序排序）
      const sortedData = [...chartData.data].sort((a, b) => a.count - b.count)
      
      const contexts = sortedData.map(item => item.context)
      const counts = sortedData.map(item => item.count)
      
      const option = {
        title: {
          text: chartData.title,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            return `${params[0].name}<br/>Count: ${params[0].value}`
          }
        },
        grid: {
          left: '3%',
          right: '8%',
          bottom: '3%',
          top: '15%',
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
          data: contexts,
          axisLabel: {
            fontSize: 12,
            width: 120,
            overflow: 'truncate'
          }
        },
        series: [{
          name: 'Count',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: '#28a745'
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}'
          },
          emphasis: {
            itemStyle: {
              color: '#1e7e34'
            }
          }
        }]
      }
      
      this.initializeChart('chart2', chartData, option)
    },
    async init3 () {
      const chartData = this.statisticsData.source_cell_types
      
      // 验证数据
      if (!this.validateChartData(chartData, 'chart3')) {
        return
      }
      
      // 按count升序排序
      const sortedData = [...chartData.data].sort((a, b) => a.count - b.count)
      
      const cellTypes = sortedData.map(item => item.cell_type)
      const counts = sortedData.map(item => item.count)
      
      const option = {
        title: {
          text: chartData.title,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            return `${params[0].name}<br/>Count: ${params[0].value}`
          }
        },
        grid: {
          left: '3%',
          right: '8%',
          bottom: '3%',
          top: '15%',
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
            fontSize: 12,
            width: 100,
            overflow: 'truncate'
          }
        },
        series: [{
          name: 'Count',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: '#29cead'
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}'
          },
          emphasis: {
            itemStyle: {
              color: '#1fa085'
            }
          }
        }]
      }
      
      this.initializeChart('chart3', chartData, option)
    },
    async init4 () {
      const chartData = this.statisticsData.target_cell_types
      
      // 验证数据
      if (!this.validateChartData(chartData, 'chart4')) {
        return
      }
      
      // 按count升序排序
      const sortedData = [...chartData.data].sort((a, b) => a.count - b.count)
      
      const cellTypes = sortedData.map(item => item.cell_type)
      const counts = sortedData.map(item => item.count)
      
      const option = {
        title: {
          text: chartData.title,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            return `${params[0].name}<br/>Count: ${params[0].value}`
          }
        },
        grid: {
          left: '3%',
          right: '8%',
          bottom: '3%',
          top: '15%',
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
            fontSize: 12,
            width: 100,
            overflow: 'truncate'
          }
        },
        series: [{
          name: 'Count',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: '#29cead'
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}'
          },
          emphasis: {
            itemStyle: {
              color: '#1fa085'
            }
          }
        }]
      }
      
      this.initializeChart('chart4', chartData, option)
    },
    async init5 () {
      const chartData = this.statisticsData.cell_type_pairs
      
      // 验证数据
      if (!this.validateChartData(chartData, 'chart5')) {
        return
      }
      
      // 按count降序排序
      const sortedData = [...chartData.data].sort((a, b) => a.count - b.count)
      
      const pairs = sortedData.map(item => `${item.source} : ${item.target}`)
      const counts = sortedData.map(item => item.count)
      
      const option = {
        title: {
          text: chartData.title,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            return `${params[0].name}<br/>Count: ${params[0].value}`
          }
        },
        grid: {
          left: '3%',
          right: '8%',
          bottom: '3%',
          top: '15%',
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
          data: pairs,
          axisLabel: {
            fontSize: 12,
            width: 150,
            overflow: 'truncate'
          }
        },
        series: [{
          name: 'Count',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: '#ffc107'
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}'
          },
          emphasis: {
            itemStyle: {
              color: '#e0a800'
            }
          }
        }]
      }
      
      this.initializeChart('chart5', chartData, option)
    },
    async init6 () {
      const chartData = this.statisticsData.ligand_receptor_pairs
      
      // 验证数据
      if (!this.validateChartData(chartData, 'chart6')) {
        return
      }
      
      // 按count升序排序
      const sortedData = [...chartData.data].sort((a, b) => a.count - b.count)
      
      const pairs = sortedData.map(item => item.pair)
      const counts = sortedData.map(item => item.count)
      
      const option = {
        title: {
          text: chartData.title,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            return `${params[0].name}<br/>Count: ${params[0].value}`
          }
        },
        grid: {
          left: '3%',
          right: '8%',
          bottom: '3%',
          top: '15%',
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
          data: pairs,
          axisLabel: {
            fontSize: 12,
            width: 150,
            overflow: 'truncate'
          }
        },
        series: [{
          name: 'Count',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: '#dc3545'
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}'
          },
          emphasis: {
            itemStyle: {
              color: '#c82333'
            }
          }
        }]
      }
      
      this.initializeChart('chart6', chartData, option)
    },
    // 处理窗口大小变化
    handleResize () {
      // 清除之前的定时器
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer)
      }
      
      // 设置新的定时器，防抖处理
      this.resizeTimer = setTimeout(() => {
        console.log('Window resized, refreshing charts...')
        // 刷新当前显示的图表
        this.refreshCurrentChart()
      }, 300)
    },
    
    // 刷新当前图表
    refreshCurrentChart() {
      const chartNumber = this.getChartNumber(this.target)
      const chartKey = `chart${chartNumber}`
      const chartInstance = this.chartInstances[chartKey]
      
      if (chartInstance && typeof chartInstance.resize === 'function') {
        chartInstance.resize()
        console.log(`Resized chart: ${chartKey}`)
      }
    },
    
    // 获取图表编号
    getChartNumber(target) {
      const chartMap = {
        'first': 1,
        'second': 2,
        'third': 3,
        'fourth': 4,
        'five': 5,
        'six': 6
      }
      return chartMap[target] || 1
    },
    
    // 图表初始化完成后的处理
    onChartInitialized(chartKey) {
      this.$nextTick(() => {
        const chartInstance = this.chartInstances[chartKey]
        if (chartInstance && typeof chartInstance.resize === 'function') {
          chartInstance.resize()
        }
      })
    },
    
    // 验证图表数据
    validateChartData(chartData, chartKey) {
      if (!chartData) {
        console.error(`Chart data is null for ${chartKey}`)
        return false
      }
      
      if (!chartData.title) {
        console.error(`Chart title is missing for ${chartKey}`)
        return false
      }
      
      if (!chartData.data || !Array.isArray(chartData.data)) {
        console.error(`Chart data is not an array for ${chartKey}`)
        return false
      }
      
      if (chartData.data.length === 0) {
        console.error(`Chart data is empty for ${chartKey}`)
        return false
      }
      
      // 验证每个数据项
      for (let i = 0; i < chartData.data.length; i++) {
        const item = chartData.data[i]
        if (!item || typeof item.count !== 'number') {
          console.error(`Invalid data item at index ${i} for ${chartKey}:`, item)
          return false
        }
      }
      
      return true
    },
    
    // 通用的图表初始化方法
    initializeChart(chartKey, chartData, option) {
      try {
        // 如果图表已经初始化，先清理
        if (this.chartInstances[chartKey]) {
          try {
            this.chartInstances[chartKey].dispose()
          } catch (error) {
            console.warn(`Error disposing existing chart ${chartKey}:`, error)
          }
          delete this.chartInstances[chartKey]
        }
        
        // 获取容器
        const chart = this.$refs[chartKey]
        if (!chart) {
          console.error(`Chart container ${chartKey} not found`)
          return
        }
        
        // 确保容器有尺寸
        if (chart.offsetWidth === 0 || chart.offsetHeight === 0) {
          console.warn(`Container ${chartKey} has no size, waiting...`)
          setTimeout(() => {
            this.initializeChart(chartKey, chartData, option)
          }, 200) // 增加等待时间
          return
        }
        
        // 验证配置项
        if (!option || !option.series || !Array.isArray(option.series)) {
          console.error(`Invalid chart option for ${chartKey}`)
          return
        }
        
        // 初始化图表
        const chartInstance = echarts.init(chart, null, {
          renderer: 'canvas',
          useDirtyRect: false // 禁用脏矩形优化以避免某些渲染问题
        })
        this.chartInstances[chartKey] = chartInstance
        
        // 设置配置项
        chartInstance.setOption(option, true) // 使用true参数强制重新渲染
        
        console.log(`Chart ${chartKey} initialized successfully`)
        
        // 监听图表事件
        chartInstance.on('finished', () => {
          console.log(`Chart ${chartKey} rendering finished`)
        })
        
        // 监听错误事件
        chartInstance.on('error', (error) => {
          console.error(`Chart ${chartKey} error:`, error)
        })
        
      } catch (error) {
        console.error(`Error initializing chart ${chartKey}:`, error)
        // 如果初始化失败，尝试重新初始化
        setTimeout(() => {
          console.log(`Retrying initialization for ${chartKey}`)
          this.initializeChart(chartKey, chartData, option)
        }, 500)
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
      min-height: 400px; // 确保最小高度
      
      // 响应式高度调整
      @media (max-width: 768px) {
        height: 400px;
        min-height: 350px;
      }
      
      @media (max-width: 576px) {
        height: 350px;
        min-height: 300px;
      }
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
  
  // 按钮样式优化
  .btn-outline-primary {
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 0.9rem;
    line-height: 1.4;
    transition: all 0.3s ease;
    border-width: 2px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
    }
    
    &.active {
      background-color: #007bff;
      border-color: #007bff;
      color: white;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
    }
    
    i {
      width: 16px;
      text-align: center;
    }
  }
  
  // 左侧选择器卡片样式
  .col-md-3 .card {
    position: sticky;
    top: 20px;
    height: fit-content;
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
    
    // 移动端按钮样式
    .btn-outline-primary {
      font-size: 0.85rem;
      padding: 10px 12px;
    }
    
    // 移动端布局调整
    .col-md-3 .card {
      position: static;
      margin-bottom: 20px;
    }
  }
}

// 小屏幕设备优化
@media (max-width: 576px) {
  .statistics-section {
    .btn-outline-primary {
      font-size: 0.8rem;
      padding: 8px 10px;
      
      i {
        display: none; // 隐藏图标以节省空间
      }
    }
  }
}
</style>
