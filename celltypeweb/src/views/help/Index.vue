<!--
 * @Author: zhangyu
 * @Date: 2021-06-29 21:07:12
 * @LastEditTime: 2022-04-06 14:07:21
-->
<template>
  <div class="wrap-team">
    <NavBar current="help" />
    <div class="content">
      <video-player  class="video-player-box"
        ref="videoPlayer"
        :options="playerOptions"
        :playsinline="true"
        customEventName="customstatechangedeventname"

      >
      </video-player>
      <PDF ref="pdf" v-for="i in numPages" :key="i" :page="i" :src="url"></PDF>
    </div>
    <Footer/>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import NavBar from '@components/NavBar'
import Footer from '@components/Footer'
import PDF from 'vue-pdf'
import { videoPlayer } from 'vue-video-player'
export default {
  components: {
    NavBar,
    PDF,
    Footer,
    videoPlayer
  },
  data () {
    return {
      playerOptions: {
        // videojs options
        muted: true,
        language: 'en',
        width: 1130,
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: 'https://citedb.cn/cite.mp4'
        }]
      },
      url: '/help.pdf',
      numPages: null
    }
  },
  mounted () {
    this.getNumPages()
  },
  methods: {
    getNumPages () {
      const loadingTask = PDF.createLoadingTask(this.url)
      loadingTask.promise.then(pdf => {
        this.numPages = pdf.numPages
      }).catch(err => {
        console.log('pdf 加载失败', err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.content{
  padding: 20px;
  padding-top: 100px;
  background: #FFFFFF;
}
.video-player-box{
  width: 100%;
}
</style>
