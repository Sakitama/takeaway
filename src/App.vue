<template>
  <div id="app">
    <takeaway-header :seller="seller"></takeaway-header>
    <takeaway-tab></takeaway-tab>
    <keep-alive>
      <router-view :seller="seller" :goods="goods" :ratings="ratings"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import { urlParse } from '@/common/js/util'
  import takeawayHeader from '@/components/header/header'
  import takeawayTab from '@/components/tab/tab'

  const ERR_OK = 0

  export default {
    name: 'app',
    created () {
      // 模拟请求某一个商家，id 代表商家的 id
      this.$http.get('/api/seller?id=' + this.id).then(response => {
        response = response.body
        if (response.errorNumber === ERR_OK) {
          this.seller = response.data
          this.seller.id = this.id
        }
      })
      this.$http.get('/api/goods').then(response => {
        response = response.body
        if (response.errorNumber === ERR_OK) {
          this.goods = response.data
        }
      })
      this.$http.get('/api/ratings').then(response => {
        response = response.body
        if (response.errorNumber === ERR_OK) {
          this.ratings = response.data
        }
      })
    },
    data () {
      return {
        id: (() => {
          let queryParam = urlParse()
          return queryParam.id
        })(),
        seller: this.seller,
        goods: this.goods,
        ratings: this.ratings
      }
    },
    components: {
      takeawayHeader,
      takeawayTab
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>
