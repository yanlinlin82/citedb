<!--
 * @page: 页面-团队
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: Dragon
 * @LastEditTime: 2022-04-07 14:00:32
-->
<template>
  <div class="wrap-team">
    <NavBar current="download" />
    <div class="content">
      <div class="title">Download</div>
      <div style="font-size: 19px;margin-bottom: 20px;line-height: 35px">
        Select the menu 'Download' to obtain the whole information extracted from 509 published papers in CITEdb, including 728 pairs of cell to cell interactions in human.
      </div>
      <el-table
        :data="list"
        border
        stripe
        :header-cell-style="{background:'#EFF0FF', color: '#161616'}"
        style="width: 100%">
        <el-table-column label="FileName">
          <template slot-scope="scope">
            <div class="name" @click="Update_Count"><i class="el-icon-download icon"></i>
            <el-link href="https://citedb.cn/CITEdb.xlsx" @click="download">{{ scope.row.name}}</el-link></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Description"
          width="210">
        </el-table-column>
        <el-table-column
          prop="times"
          label="Download times"
          width="210">
        </el-table-column>
        <el-table-column
          :formatter="dateFormat"
          prop="last"
          label="Latest Download"
          width="210">
        </el-table-column>
        <el-table-column
          prop="size"
          label="Size"
          width="210">
        </el-table-column>
      </el-table>
    </div>
    <Footer/>
  </div>
</template>

<script>
import NavBar from '@components/NavBar'
import Footer from '@components/Footer'
export default {
  components: {
    NavBar,
    Footer
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
    })
  },
  methods: {
    Update_Count () {
      this.$axios.post('update_count', {
        count: this.list[0].times
      }).then(() => {
        location.reload()
      })
    },
    download () {
      const link = document.createElement('a')
      link.setAttribute('download', 'CITEdb.xlsx') // 下载的文件名
      link.href = 'https://citedb.cn/CITEdb.xlsx' // 文件url
      link.click()
    },
    // 时间格式化
    dateFormat (row, column) {
      const daterc = row[column.property]
      if (daterc != null) {
        const dateMat = new Date(daterc)
        const year = dateMat.getFullYear()
        const month = dateMat.getMonth() + 1
        const day = dateMat.getDate()
        const hh = dateMat.getHours()
        const mm = dateMat.getMinutes()
        const ss = dateMat.getSeconds()
        const timeFormat = year + '-' + month + '-' + day + ' ' + hh + ':' + mm + ':' + ss
        return timeFormat
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content{
  padding: 20px;
  padding-top: 100px;
  background: #FFFFFF;
  height: 100vh;
}
.title{
  font-size: 30px;
  margin-bottom: 20px;
}
.name{
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon{
    margin-right: 10px;
    color: #409EFF;
    font-size: 18px;
  }
}
</style>
