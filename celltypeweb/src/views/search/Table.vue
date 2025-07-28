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
      <h2>Result</h2>
      <el-button :disabled="chartList.length === 0" @click="download" type="primary">Download</el-button>
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
        <template slot-scope="scope">
          <div style="display:flex;flex-direction:column;">
            <el-link class="block" v-for="(item, index) in filterId(scope.row)" :key="item" @click="go(scope.row.url[index])" type="primary">{{filterName(scope.row, index, item)}};</el-link>
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
  methods: {
    //
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
      const name = row.mesh_name ? `${row.mesh_name.split('|')[index]} (${row.url[index].split('id=')[1]})` : ''
      return name
    },
    go (url) {
      window.open(url)
    },
    download () {
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
      // 导出
      export_json_to_excel(tHeader, data, 'Result')
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
  }
</style>
