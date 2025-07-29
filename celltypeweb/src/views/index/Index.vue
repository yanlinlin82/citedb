<!--
 * @page: 页面-首页
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: Dragon
 * @LastEditTime: 2022-04-06 08:58:17
-->
<template>
  <div class="wrap-index">
    <div class="debug-info">Index组件已加载 - {{ currentTime }}</div>
    <NavBar current="index" />
    <div class="content">
      <div class="title">Welcome to CITEdb!</div>
      <div class="subtitle">
        <el-icon class="icon"><ArrowRight /></el-icon>
        About CITEdb
        </div>
      <div class="text">
        <span class="name">CITEdb</span>
        <span style="font-size: 18px"> (Cell-cell InTEraction database) is a manually curated database of cell-cell interactions at cell type level, which was derived from 509 published papers in PubMed before January 17, 2022 by 3 reviewers. 728 pairs of cell-cell interactions in human were collected and deposited in current version.</span>
      </div>

      <div class="subtitle">
        <el-icon class="icon"><ArrowRight /></el-icon>
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
        <el-icon class="icon"><ArrowRight /></el-icon>
        Citation
      </div>
      <div class="text">
        If you use <span class="name">CITEdb</span>, please cite:
      </div>
      <div class="text" style="font-size: 16px; padding: 0 30px; margin-bottom: 20px;">
        <strong>CITEdb: a manually curated database of cell-cell interactions in human</strong><br>
        <em>Nayang Shan, Yao Lu, Hao Guo, Dongyu Li, Jitong Jiang, Linlin Yan, Jiudong Gao, Yong Ren, Xingming Zhao, Lin Hou</em><br>
        Bioinformatics, 2022 Nov 15;38(22):5144-5148.<br>
        DOI: <a href="https://doi.org/10.1093/bioinformatics/btac654" target="_blank" style="color: #007bff; text-decoration: none;">10.1093/bioinformatics/btac654</a><br>
        PMID: <a href="https://pubmed.ncbi.nlm.nih.gov/36179089/" target="_blank" style="color: #007bff; text-decoration: none;">36179089</a>
      </div>
      <div class="text" style="font-size: 14px; padding: 0 30px; margin-bottom: 30px; background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
        <strong>BibTeX:</strong><br>
        <code style="font-size: 12px; line-height: 1.4;">
@article{shan2022citedb,<br>
&nbsp;&nbsp;title={CITEdb: a manually curated database of cell-cell interactions in human},<br>
&nbsp;&nbsp;author={Shan, Nayang and Lu, Yao and Guo, Hao and Li, Dongyu and Jiang, Jitong and Yan, Linlin and Gao, Jiudong and Ren, Yong and Zhao, Xingming and Hou, Lin},<br>
&nbsp;&nbsp;journal={Bioinformatics},<br>
&nbsp;&nbsp;volume={38},<br>
&nbsp;&nbsp;number={22},<br>
&nbsp;&nbsp;pages={5144--5148},<br>
&nbsp;&nbsp;year={2022},<br>
&nbsp;&nbsp;publisher={Oxford University Press},<br>
&nbsp;&nbsp;doi={10.1093/bioinformatics/btac654}<br>
}
        </code>
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
      currentTime: new Date().toLocaleString()
    }
  },
  mounted () {
    console.log('Index组件已挂载')
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
.debug-info {
  position: fixed;
  top: 10px;
  right: 10px;
  background: #ff6b6b;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 9999;
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
