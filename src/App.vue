<template>
  <div id="app">
    <takeaway-header :seller="seller"></takeaway-header>
    <takeaway-tab></takeaway-tab>
    <router-view></router-view>
  </div>
</template>

<script>
  import takeawayHeader from '@/components/header/header'
  import takeawayTab from '@/components/tab/tab'

  const ERR_OK = 0

  export default {
    name: 'app',
    created () {
      this.$http.get('/api/seller').then(response => {
        response = response.body
        if (response.errorNumber === ERR_OK) {
          this.seller = response.data
        }
      })
    },
    data () {
      return {
        seller: this.seller
      }
    },
    components: {
      takeawayHeader,
      takeawayTab
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>
