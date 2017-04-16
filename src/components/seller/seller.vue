<template>
  <div class="seller" v-if="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <p class="name">{{ seller.name }}</p>
        <div class="star-wrapper border-1px">
          <star :size="36" :score="seller.score"></star><span class="rating-count">排名{{ seller.ratingCount }}</span><span class="sell-count">月售{{ seller.sellCount }}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <p>起送价</p>
            <p><span class="strong">{{ seller.minPrice }}</span>元</p>
          </li>
          <li class="block">
            <p>商家配送</p>
            <p><span class="strong">{{ seller.deliveryPrice }}</span>元</p>
          </li>
          <li class="block">
            <p>平均配送时间</p>
            <p><span class="strong">{{ seller.deliveryTime }}</span>分钟</p>
          </li>
        </ul>
        <div class="favorite" @click="collect($event)">
          <i class="icon-favorite" :class="{'active': isCollect}"></i><span class="text">{{ collectText }}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <p class="content">{{ seller.bulletin }}</p>
      </div>
      <ul class="detail-supports">
        <li v-for="supportsItem in seller.supports" class="detail-supports-item border-1px-top">
          <span class="detail-supports-icon" :class="classMap[supportsItem.type]"></span>
          <span class="detail-supports-text">{{ supportsItem.description }}</span>
        </li>
      </ul>
      <split></split>
      <div class="seller-image">
        <h1 class="title">商家实景</h1>
        <div class="image-wrapper" ref="image-wrapper">
          <ul class="pics-list" ref="pics-list">
            <li v-for="pic in seller.pics" class="pics">
              <img width="120" height="90" :src="pic">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="seller-info">
        <h1 class="title">商家信息</h1>
        <ul class="info-list">
          <li v-for="info in seller.infos" class="info border-1px-top">{{ info }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import split from '@/components/split/split'
  import star from '@/components/star/star'
  import BScroll from 'better-scroll'
  import { saveToLocal, loadFromLocal } from '@/common/js/store'

  export default {
    name: 'seller',
    data () {
      return {
        isCollect: false
      }
    },
    computed: {
      collectText () {
        if (this.isCollect) {
          return '已收藏'
        } else {
          return '收藏'
        }
      }
    },
    watch: {
      seller () {
        this.$nextTick(() => {
          this._initScroll()
        })
        this.isCollect = loadFromLocal(this.seller.id, 'favorite', false)
      }
    },
    mounted () {
      // 假如在商品页刷新，再切到商家详情页，此时会先触发 mounted，且 this.seller 和 DOM 已经准备好
      // 如果在商家详情页刷新，也会先触发 mounted，但是此时 this.seller 和 DOM 没有准备好
      // 当 this.seller 准备好的时候会触发 watch，此时DOM也已经准备好了
      if (this.seller && this.seller !== undefined && this.$refs['image-wrapper'] && this.$refs['seller']) {
        this.$nextTick(function () {
          this._initScroll()
        })
        this.isCollect = loadFromLocal(this.seller.id, 'favorite', false)
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    methods: {
      _initScroll () {
        let picWidth = 120
        let margin = 6
        let ulWidth = (picWidth + margin) * (this.seller.pics.length - 1) + picWidth
        this.$refs['pics-list'].style.width = ulWidth + 'px'
        this.sellerScroll = new BScroll(this.$refs['seller'], {
          click: true
        })
        this.imageWrapperScroll = new BScroll(this.$refs['image-wrapper'], {
          scrollX: true,
          eventPassthrough: 'vertical'
        })
      },
      collect (event) {
        // 过滤掉原生事件，使用 better-scroll 的派发事件
        if (!event._constructed) {
          return
        }
        this.isCollect = !this.isCollect
        saveToLocal(this.seller.id, 'favorite', this.isCollect)
      }
    },
    components: {
      split,
      star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .seller
    position fixed
    top 174px
    bottom 0
    left 0
    overflow hidden
    width 100%
    .overview
      padding 18px
      position relative
      .name
        font-size 14px
        color rgb(7, 17, 27)
        line-height 14px
        margin-bottom 8px
      .star-wrapper
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, .1))
        .star
          margin-right 8px
          display inline-block
          vertical-align top
        .rating-count, .sell-count
          display inline-block
          vertical-align top
          line-height 18px
          font-size 10px
          color rgb(77, 85, 93)
        .rating-count
          margin-right 12px
      .remark
        display flex
        .block
          flex 1
          margin-top 18px
          text-align center
          border-right 1px solid rgba(7, 17, 27, .1)
          &:last-child
            border none
          p
            font-size 10px
            color rgb(147, 153, 159)
            lone-height 10px
            &:first-child
              margin-bottom 4px
          .strong
            font-size 24px
            color rgb(7, 17, 27)
            line-height 24px
      .favorite
        position absolute
        width 50px
        right 11px
        top 18px
        text-align center
        .icon-favorite
          display block
          font-size 24px
          color #d4d6d9
          line-height 24px
          margin-bottom 4px
          &.active
            color rgb(240, 20, 20)
        .text
          font-size 10px
          color rgb(77, 85, 93)
          line-height 10px
    .bulletin
      padding 18px 18px 16px
      .title
        font-size 14px
        color rgb(7, 17, 27)
        line-height 14px
        margin-bottom 8px
      .content
        padding 0 12px
        font-size 12px
        color rgb(240, 20, 20)
        line-height 24px
    .detail-supports
      padding 0 18px
      .detail-supports-item
        padding 16px 12px
        font-size 0
        border-1px-top(rgba(7, 17, 27, .1))
        .detail-supports-icon
          display inline-block
          width 16px
          height 16px
          vertical-align top
          margin-right 6px
          background-size 16px 16px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .detail-supports-text
          line-height 16px
          font-size 12px
          color rgb(7, 17, 27)
    .seller-image
      padding 18px
      .title
        font-size 14px
        color rgb(7, 17, 27)
        line-height 14px
        margin-bottom 12px
      .image-wrapper
        overflow hidden
        white-space nowrap
        .pics-list
          font-size 0
          .pics
            display inline-block
            margin-right 6px
            width 120px
            height 90px
            &:last-child
              margin-right 0
    .seller-info
      padding 18px 18px 0 18px
      .title
        font-size 14px
        color rgb(7, 17, 27)
        line-height 14px
        margin-bottom 12px
      .info
        padding 16px 12px
        font-size 12px
        color rgb(7, 17, 27)
        line-height 16px
        border-1px-top(rgba(7, 17, 27, .1))
</style>
