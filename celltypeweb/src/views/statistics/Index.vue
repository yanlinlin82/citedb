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
                <div v-show="target === 'first'" ref="chart1" class="chart-item"></div>
                <div v-show="target === 'second'" ref="chart2" class="chart-item"></div>
                <div v-show="target === 'third'" ref="chart3" class="chart-item"></div>
                <div v-show="target === 'fourth'" ref="chart4" class="chart-item"></div>
                <div v-show="target === 'five'" ref="chart5" class="chart-item"></div>
                <div v-show="target === 'six'" ref="chart6" class="chart-item"></div>
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
      ]
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
    changeTarget (event) {
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
    },
    init1 () {
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
          data: ['2015', '2016', '2017', '2018', '2019', '2020', '2021'],
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
          data: [10, 15, 25, 35, 45, 55, 65],
          type: 'bar',
          itemStyle: {
            color: '#007bff'
          }
        }]
      }
      cakeChart.setOption(option)
    },
    init2 () {
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
          data: [
            { value: 35, name: 'Immune response' },
            { value: 25, name: 'Development' },
            { value: 20, name: 'Inflammation' },
            { value: 15, name: 'Cancer' },
            { value: 10, name: 'Metabolism' }
          ],
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
    },
    init3 () {
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
          data: ['T cell', 'B cell', 'Macrophage', 'Endothelial', 'Fibroblast'],
          axisLabel: {
            fontSize: 12
          }
        },
        series: [{
          data: [45, 35, 30, 25, 20],
          type: 'bar',
          itemStyle: {
            color: '#28a745'
          }
        }]
      }
      cakeChart.setOption(option)
    },
    init4 () {
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
          data: ['B cell', 'T cell', 'Macrophage', 'Endothelial', 'Fibroblast'],
          axisLabel: {
            fontSize: 12
          }
        },
        series: [{
          data: [40, 35, 30, 25, 20],
          type: 'bar',
          itemStyle: {
            color: '#ffc107'
          }
        }]
      }
      cakeChart.setOption(option)
    },
    init5 () {
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
          data: [
            { value: 30, name: 'T cell - B cell' },
            { value: 25, name: 'Macrophage - T cell' },
            { value: 20, name: 'Endothelial - T cell' },
            { value: 15, name: 'Fibroblast - Macrophage' },
            { value: 10, name: 'B cell - Macrophage' }
          ],
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
    },
    init6 () {
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
          data: ['IL-2/IL-2R', 'TNF/TNFR', 'IFN-γ/IFN-γR', 'IL-4/IL-4R', 'IL-6/IL-6R'],
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
          data: [50, 40, 35, 30, 25],
          type: 'bar',
          itemStyle: {
            color: '#dc3545'
          }
        }]
      }
      cakeChart.setOption(option)
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
