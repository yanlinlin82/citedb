<!--
 * @page: 页面-首页
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: Dragon
 * @LastEditTime: 2022-04-06 08:58:17
-->
<template>
  <div class="wrap-index">
    <NavBar current="index" />
    <div class="content">
      <div class="title">Welcome to CITEdb!</div>
      <div class="subtitle">
        <i class="el-icon-d-arrow-right icon"></i>
        About CITEdb
        </div>
      <div class="text">
        <span class="name">CITEdb</span>
        <span style="font-size: 18px"> (Cell-cell InTEraction database) is a manually curated database of cell-cell interactions at cell type level, which was derived from 509 published papers in PubMed before January 17, 2022 by 3 reviewers. 728 pairs of cell-cell interactions in human were collected and deposited in current version.</span>
      </div>

      <div class="subtitle">
        <i class="el-icon-d-arrow-right icon"></i>
        What can users do in <span class="name">CITEdb</span>
      </div>
      <div class="text" style="font-size: 18px">
        1. Search for all cell-cell interactions in any context of interest
      </div>
      <div class="text" style="font-size: 18px">
        2. Explore cell-cell interactions involving specific cell types of interest
      </div>
      <div class="text" style="font-size: 18px">
        3. Navigate to cell-cell interactions of interest with selection of methods
      </div>
      <div class="text" style="font-size: 18px">
        4. Obtain the statistics of <span class="name">CITEdb</span> through a vivid statistical graph
      </div>
      <div class="text" style="font-size: 18px">
        5. Download all cell-cell interactions of different contexts
      </div>
      <div class="subtitle">
        <i class="el-icon-d-arrow-right icon"></i>
        Citation
      </div>
      <div class="text">
        If you use <span class="name">CITEdb</span>, please cite:
      </div>

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

    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.wrap-index{
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}
.content{
  background: #FFFFFF;
  flex: 1;
  padding: 90px 30px 0 30px;
}
.title{
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 40px;
  margin-top: 30px;
}
.subtitle{
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #CCC;
}
.text{
  font-size: 16px;
  margin-bottom: 30px;
  line-height: 28px;
  padding: 0 30px;
}

.name{
  font-size: 20px;
  font-weight: 600;
}
</style>
