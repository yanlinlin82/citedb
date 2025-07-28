<!--
 * @page: 页面-
 * @Author: Dragon
 * @Date: 2021-03-16 10:21:14
 * @LastEditors: zhangyu
 * @LastEditTime: 2021-06-29 18:46:30
-->
<template>
  <div class="wrap-header">
    <header class="main-header">
      <div class="container">
        <div @click="goIndex" class="logo">
          <img src="../assets/logo.png" />
        </div>
        <ul class="bar">
          <li v-for="(items, index) in list" :key="index" @click="changePage(items)" :class="{active: current === items.value }" class="item">
            {{items.name}}
            <div v-if="items.children" class="child">
              <div v-for="(item, index) in items.children" :key="index" @click.stop="childChangePage(item)" :class="{active: current === item.value && item.query && ($route.query.type === item.query.type)}" class="child-item">
                {{item.name}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  props: {
    current: {
      type: String,
      default: 'index'
    }
  },
  data () {
    return {
      list: [
        {
          url: '/',
          name: 'Home',
          value: 'index'
        },
        {
          url: '/search',
          name: 'Search',
          value: 'search'
        },
        {
          url: '/statistics',
          name: 'Statistics',
          value: 'statistics'
        },
        {
          url: '/download',
          name: 'Download',
          value: 'download'
        },
        {
          url: '/team',
          name: 'Team',
          value: 'team'
        },
        {
          url: '/help',
          name: 'Help',
          value: 'help'
        }
      ]
    }
  },
  mounted () {},
  methods: {
    childChangePage (item) {
      if ((this.$route.path === item.url && item.query && this.$route.query.type === item.query.type) || item.children) {
        return
      }
      this.$router.push({
        path: item.url,
        query: {
          ...item.query
        }
      })
    },
    changePage (item) {
      if ((this.$route.path === item.url) || item.children) {
        return
      }
      this.$router.push({
        path: item.url
      })
    },
    goIndex () {
      if (this.$route.path === '/index') {
        return
      }
      this.$router.push({
        path: 'index'
      })
    }
  }
}
</script>
