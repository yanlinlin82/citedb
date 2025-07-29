<!--
 * @page: 页面-搜索
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: Dragon
 * @LastEditTime: 2022-04-06 08:58:17
-->
<template>
  <BaseLayout current="search">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="row">
        <!-- Context树 -->
        <div class="col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="fas fa-sitemap me-2"></i>
                Context
              </h5>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="contextFold" @change="openOrCloseTree1" id="contextFold">
                <label class="form-check-label" for="contextFold">
                  Fold tree
                </label>
              </div>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="context_input" 
                  placeholder="Please input the content"
                >
              </div>
              <div class="tree-container">
                <el-tree
                  ref="tree1"
                  :data="treeList1"
                  show-checkbox
                  node-key="id"
                  empty-text="No Data"
                  :default-expand-all="true"
                  :filter-node-method="filterTree1"
                  @check="handleCheckChange1">
                </el-tree>
              </div>
            </div>
          </div>
        </div>

        <!-- Cell Type树 -->
        <div class="col-lg-6 mb-4">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="fas fa-dna me-2"></i>
                Cell Type
              </h5>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="cellTypeFold" @change="openOrCloseTree2" id="cellTypeFold">
                <label class="form-check-label" for="cellTypeFold">
                  Fold tree
                </label>
              </div>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="cell_type_input" 
                  placeholder="Please input the content"
                >
              </div>
              <div class="tree-container">
                <el-tree
                  ref="tree2"
                  :data="treeList2"
                  show-checkbox
                  node-key="id"
                  empty-text="No Data"
                  :default-expand-all="true"
                  :filter-node-method="filterTree2"
                  @check="handleCheckChange2">
                </el-tree>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 帮助提示区域 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="alert alert-info" role="alert">
            <div class="d-flex align-items-center">
              <i class="fas fa-info-circle fa-lg me-3"></i>
              <div>
                <h6 class="alert-heading mb-2">Network Graph Controls</h6>
                <p class="mb-2">
                  Use the <strong>Zoom In (+)</strong> and <strong>Zoom Out (-)</strong> buttons to control the network graph view. 
                  The buttons appear when search results are displayed.
                </p>
                <div class="d-flex gap-3">
                  <a href="/cite.mp4" download="CITEdb_Tutorial.mp4" class="btn btn-outline-primary btn-sm">
                    <i class="fas fa-play-circle me-1"></i>Watch Tutorial
                  </a>
                  <a href="/help.pdf" download="CITEdb_Help_Manual.pdf" class="btn btn-outline-secondary btn-sm">
                    <i class="fas fa-file-pdf me-1"></i>Download Manual
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选条件 -->
      <div class="row mb-4">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-filter me-2"></i>
                Filter Options
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <label class="form-label">Method</label>
                  <el-select
                    v-model="methodValue"
                    @change="getAllList"
                    placeholder="Please select"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    class="w-100">
                    <el-option
                      v-for="item in method"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-play me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button @click="demo1Click" class="btn btn-success">
                  <i class="fas fa-rocket me-2"></i>Demo1
                </button>
                <button @click="demo2Click" class="btn btn-success">
                  <i class="fas fa-rocket me-2"></i>Demo2
                </button>
                <button @click="resetClick" class="btn btn-danger">
                  <i class="fas fa-undo me-2"></i>Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 选项 -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" @change="getAllList" v-model="form.check1" id="check1">
                <label class="form-check-label" for="check1">
                  Show cell-cell interactions at the class level
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" @change="getAllList" v-model="form.check2" id="check2">
                <label class="form-check-label" for="check2">
                  Show cell-cell interactions at the subclass level
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 结果展示 -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="fas fa-chart-bar me-2"></i>
                Results
              </h5>
            </div>
            <div class="card-body">
              <!-- 图表区域 -->
              <div v-if="chartList && chartList.length > 0" class="mb-4">
                <div class="card">
                  <div class="card-header">
                    <h5 class="mb-0">
                      <i class="fas fa-chart-network me-2"></i>
                      Network Chart
                    </h5>
                  </div>
                  <div class="card-body">
                    <Chart :chartList="chartList" :check="form.check1" ref="chart" />
                  </div>
                </div>
              </div>

              <!-- 结果表格 -->
              <div v-if="tableList && tableList.length > 0" class="mb-4">
                <div class="card">
                  <div class="card-header">
                    <h5 class="mb-0">
                      <i class="fas fa-table me-2"></i>
                      Result Table
                    </h5>
                  </div>
                  <div class="card-body">
                    <Table :tableList="tableList" :total="total" :size="size" :chartList="chartList" />
                  </div>
                </div>
              </div>

              <!-- 无结果提示 -->
              <div v-if="(!chartList || chartList.length === 0) && (!tableList || tableList.length === 0)" class="text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No results found</h5>
                <p class="text-muted">Please select some criteria and try searching again.</p>
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
import Chart from './Chart.vue'
import Table from './Table.vue'

export default {
  components: {
    BaseLayout,
    Chart,
    Table
  },
  data () {
    return {
      // 树数据
      treeList1: [],
      treeList2: [],
      
      // 输入值
      context_input: '',
      cell_type_input: '',
      methodValue: '',
      
      // 折叠状态
      contextFold: false,
      cellTypeFold: false,
      
      // 选中值
      contextVal: '',
      cellTypeVal: '',
      
      // 选项数据
      method: [
        { value: 'Experimental', label: 'Experimental' },
        { value: 'Computational', label: 'Computational' }
      ],
      
      // 表单选项
      form: {
        check1: false,
        check2: false
      },
      
      // 结果数据
      chartList: [],
      tableList: [],
      total: 0,
      current: 1,
      size: 10
    }
  },
  mounted () {
    this.getContextTree()
    this.getCellTypeTree()
  },
  methods: {
    // 过滤树1
    filterTree1 (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 过滤树2
    filterTree2 (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 展开或关闭节点
    openOrCloseTree1 () {
      // 使用异步方式处理树节点展开/折叠
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          if (this.$refs.tree1 && this.$refs.tree1.store && this.$refs.tree1.store.nodesMap) {
            var nodes = this.$refs.tree1.store.nodesMap
            for (var i in nodes) {
              nodes[i].expanded = !this.contextFold
            }
          }
        })
      })
    },
    openOrCloseTree2 () {
      // 使用异步方式处理树节点展开/折叠
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          if (this.$refs.tree2 && this.$refs.tree2.store && this.$refs.tree2.store.nodesMap) {
            var nodes = this.$refs.tree2.store.nodesMap
            for (var i in nodes) {
              nodes[i].expanded = !this.cellTypeFold
            }
          }
        })
      })
    },
    getContextTree () {
      this.$axios.post('get_tree', {
        word: this.context_input
      }).then((res) => {
        if (res.msg === 'ok') {
          this.treeList1 = res.data
          if (this.$refs.tree1) {
            this.$refs.tree1.setCheckedKeys([])
          }
        }
      }).catch(err => {
        console.log('获取Context树失败:', err)
      })
    },
    getCellTypeTree () {
      this.$axios.post('get_cell_type_tree', {
        word: this.cell_type_input
      }).then((res) => {
        if (res.msg === 'ok') {
          this.treeList2 = res.data
          if (this.$refs.tree2) {
            this.$refs.tree2.setCheckedKeys([])
          }
        }
      }).catch(err => {
        console.log('获取Cell Type树失败:', err)
      })
    },
    handleCheckChange1 (data, checked) {
      const arr = []
      checked.checkedNodes.forEach(item => {
        if (!item.isFather) {
          arr.push(item.label)
        }
      })
      this.contextVal = arr.join(',')
      this.getAllList()
    },
    handleCheckChange2 (data, checked) {
      const arr = []
      checked.checkedNodes.forEach(item => {
        if (!item.isFather) {
          arr.push(item.label)
        }
      })
      this.cellTypeVal = arr.join(',')
      this.getAllList()
    },
    getAllList () {
      // 添加加载状态
      this.$loading({
        lock: true,
        text: '正在加载数据...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      
      // 使用异步方式并行加载数据
      Promise.all([
        this.getImgList(),
        this.getTableList()
      ]).finally(() => {
        this.$loading().close()
        // 异步滚动，避免阻塞UI
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: 600,
              behavior: 'smooth'
            })
          })
        })
      })
    },
    getImgList () {
      return this.$axios.post('get_data_img', {
        species: this.speciesValue,
        method: this.methodValue,
        context: this.contextVal,
        cell_type: this.cellTypeVal,
        check1: this.form.check1,
        check2: this.form.check2
      }).then((res) => {
        if (res.msg === 'ok') {
          this.chartList = res.data || []
          if (this.chartList.length > 0) {
            // 使用异步方式初始化图表，避免阻塞UI
            this.$nextTick(() => {
              requestAnimationFrame(() => {
                if (this.$refs.chart) {
                  this.$refs.chart.initData(this.chartList)
                }
              })
            })
          }
        } else {
          this.chartList = []
          console.warn('获取图表数据失败:', res.msg)
        }
      }).catch(err => {
        console.error('获取图表数据失败:', err)
        this.chartList = []
        this.$message.error('获取图表数据失败')
      })
    },
    getTableList () {
      return this.$axios.post('get_data_table', {
        species: this.speciesValue,
        method: this.methodValue,
        context: this.contextVal,
        cell_type: this.cellTypeVal,
        check1: this.form.check1,
        check2: this.form.check2,
        current: this.current,
        size: this.size
      }).then((res) => {
        if (res.msg === 'ok') {
          this.tableList = res.data?.list || []
          this.total = res.data?.totalCount || 0
        } else {
          this.tableList = []
          this.total = 0
          console.warn('获取表格数据失败:', res.msg)
        }
      }).catch(err => {
        console.error('获取表格数据失败:', err)
        this.tableList = []
        this.total = 0
        this.$message.error('获取表格数据失败')
      })
    },
    // 点击每页多少条
    handleSizeChange (val) {
      this.size = val
      // this.getTableList()
    },
    // 点击页数
    handleCurrentChange (val) {
      this.current = val
      // this.getTableList()
    },
    demo1Click () {
      this.contextVal = ['immune response'].join(',')
      // 异步设置树节点选中状态
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          if (this.$refs.tree1) {
            this.$refs.tree1.setCheckedKeys(['CH311'])
          }
        })
      })
      this.cellTypeVal = ''
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          if (this.$refs.tree2) {
            this.$refs.tree2.setCheckedKeys([])
          }
        })
      })
      this.getAllList()
    },
    demo2Click () {
      // 异步设置树节点选中状态
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          if (this.$refs.tree2) {
            this.$refs.tree2.setCheckedKeys(['B cell', 'endothelial cell', 'fibroblast', 'macrophage', 'natural killer cell', 'T cell'])
          }
        })
      })
      this.contextVal = ''
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          if (this.$refs.tree1) {
            this.$refs.tree1.setCheckedKeys([])
          }
        })
      })
      this.getAllList()
    },
    resetClick () {
      this.methodValue = ''
      this.other = ''
      this.form.check1 = false
      this.form.check2 = false
      this.context_input = ''
      this.cell_type_input = ''
      this.chartList = []
      this.tableList = []
      if (this.$refs.chart) {
        this.$refs.chart.initData([])
      }
      this.getContextTree()
      this.getCellTypeTree()
    }
  }
}
</script>

<style lang="scss" scoped>
.search-section {
  .tree-container {
    height: 300px;
    overflow-y: auto;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    padding: 1rem;
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
}

// 响应式调整
@media (max-width: 768px) {
  .search-section {
    .tree-container {
      height: 250px;
    }
  }
}
</style>
