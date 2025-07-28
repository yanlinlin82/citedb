<!--
 * @page: 页面-图表
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: Dragon
 * @LastEditTime: 2022-04-06 09:12:49
-->
<template>
  <div class="wrap-statistics">
    <NavBar current="statistics" />
    <div class="content">
      <el-alert
        style="width: 105%"
        title="Please select"
        type="warning"
        effect="dark"
        :closable="false">
      </el-alert>
      <div class="statistics-box">
        <el-radio-group v-model="target" size="medium" class="radio-box" @change="changeTarget">
          <el-radio class="redio-item" label="first" border>Number of cell-cell interactions reported each year</el-radio>
          <el-radio class="redio-item" label="second" border>Number of cell-cell interactions in the top 10 physiological contexts</el-radio>
          <el-radio class="redio-item" label="third" border>Number of cell-cell interactions in the top 10 source cell types</el-radio>
          <el-radio class="redio-item" label="fourth" border>Number of cell-cell interactions in the top 10 target cell types</el-radio>
          <el-radio class="redio-item" label="five" border>Number of cell-cell interactions in the top 10 pairs of cell types</el-radio>
          <el-radio class="redio-item" label="six" border>Number of top ligand-receptor pairs</el-radio>
        </el-radio-group>
        <div class="echarts-box">
          <el-card class="box-card" style="width: 750px">
            <div v-show="target == 'first'" ref="chart1" style="height:500px;" />
            <div v-show="target == 'second'" ref="chart2" style="height:500px;" />
            <div v-show="target == 'third'" ref="chart3" style="height:500px;" />
            <div v-show="target == 'fourth'" ref="chart4" style="height:500px;" />
            <div v-show="target == 'five'" ref="chart5" style="height:500px;" />
            <div v-show="target == 'six'" ref="chart6" style="height:500px;" />
          </el-card>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import NavBar from '@components/NavBar'
import Footer from '@components/Footer'
export default {
  components: {
    NavBar,
    Footer
  },
  data () {
    return {
      target: 'first'
    }
  },
  mounted () {
    this.init1()
  },
  methods: {
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
          text: 'Interactions of each year'
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
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', 'prior to 2013'].reverse()
        },
        series: [
          {
            type: 'bar',
            data: [113, 134, 98, 76, 46, 33, 39, 26, 25, 138].reverse()
          }
        ]
      }

      option && cakeChart.setOption(option)
    },
    init2 () {
      const chart = this.$refs.chart2
      const cakeChart = echarts.init(chart)
      const option = {
        title: {
          text: 'Interactions of top 10 contexts'
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
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['immune response', 'bone microenvironment', 'carcinogenesis', 'breast cancer', 'atherosclerotic plaque', 'angiogenesis', 'asthma', 'atherosclerosis', 'metastatic melanoma', 'inflammation'].reverse()
        },
        series: [
          {
            type: 'bar',
            data: [37, 24, 23, 22, 19, 18, 15, 13, 13, 12].reverse()
          }
        ]
      }
      option && cakeChart.setOption(option)
    },
    init3 () {
      const chart = this.$refs.chart3
      const cakeChart = echarts.init(chart)
      const option = {
        title: {
          text: 'Top 10 source cell types at the class level'
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
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['endothelial cell', 'cancer cell', 'macrophage', 'epithelial cell', 'T cell', 'fibroblast', 'stem cell', 'myeloid cell', 'stromal cell', 'dendritic cell'].reverse()
        },
        series: [
          {
            type: 'bar',
            data: [83, 69, 66, 50, 47, 46, 32, 18, 18, 17].reverse(),
            itemStyle: {
              color: '#29cead'
            }
          }
        ]
      }
      option && cakeChart.setOption(option)
    },
    init4 () {
      const chart = this.$refs.chart4
      const cakeChart = echarts.init(chart)
      const option = {
        title: {
          text: 'Top 10 target cell types at the class level'
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
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['endothelial cell', 'T cell', 'fibroblast', 'cancer cell', 'stem cell', 'epithelial cell', 'macrophage', 'bone cell', 'smooth muscle cell', 'stromal cell'].reverse()
        },
        series: [
          {
            type: 'bar',
            data: [93, 81, 61, 37, 37, 35, 32, 30, 20, 20].reverse(),
            itemStyle: {
              color: '#29cead'
            }
          }
        ]
      }
      option && cakeChart.setOption(option)
    },
    init5 () {
      const chart = this.$refs.chart5
      const cakeChart = echarts.init(chart)
      const option = {
        title: {
          text: 'Top 10 source : target cell types at the class level'
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
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['cancer cell : fibroblast', 'cancer cell : endothelial cell', 'fibroblast : cancer cell', 'T cell : T cell', 'bone cell : bone cell', 'macrophage : T cell', 'dendritic cell : T cell', 'myeloid cell : endothelial cell', 'endothelial cell : stem cell', 'stem cell : stem cell'].reverse()
        },
        series: [
          {
            type: 'bar',
            data: [17, 15, 12, 12, 11, 11, 10, 9, 8, 8].reverse()
          }
        ]
      }
      option && cakeChart.setOption(option)
    },
    init6 () {
      const chart = this.$refs.chart6
      const cakeChart = echarts.init(chart)
      const option = {
        title: {
          text: 'Top ligand-receptor pairs'
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
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['CXCL12:CXCR4', 'PGF:FLT1', 'CCL27:CCR10', 'CSF1:CSF1R', 'TIGIT:NECTIN2'].reverse()
        },
        series: [
          {
            type: 'bar',
            data: [8, 6, 4, 4, 3].reverse()
          }
        ]
      }
      option && cakeChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap-statistics{
  background: #FFF;
}
.content{
  padding-bottom: 50px;
  height: 95vh;
}
.flex{
  display: flex;
  width: 100%;
}
.radio-box{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 50px;
}
.redio-item{
  margin-bottom: 20px;
}
.el-radio.is-bordered+.el-radio.is-bordered{
  margin-left: 0;
}
.echarts-box{
  margin-top: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 40px;
}
.statistics-box{
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
