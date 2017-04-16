<template>
  <div class="sellerRatings" v-if="seller" ref="seller-ratings">
    <div class="sellerRatings-content">
      <div class="sellerRatings-content-overview">
        <div class="sellerRatings-content-overview-left">
          <p class="sellerRatings-content-overview-left-score">{{ seller.score }}</p>
          <p class="sellerRatings-content-overview-left-text">综合评分</p>
          <p class="sellerRatings-content-overview-left-rank-rate">高于周边商家{{ seller.rankRate }}%</p>
        </div>
        <div class="sellerRatings-content-overview-right">
          <div class="sellerRatings-content-overview-right-service-score">
            <span class="title">服务态度</span><star :size="36" :score="seller.serviceScore"></star><span class="score">{{ seller.serviceScore }}</span>
          </div>
          <div class="sellerRatings-content-overview-right-food-score">
            <span class="title">商品得分</span><star :size="36" :score="seller.foodScore"></star><span class="score">{{ seller.foodScore }}</span>
          </div>
          <div class="sellerRatings-content-overview-right-delivery-time">
            <span class="title">送达时间</span><span class="delivery-time">{{ seller.deliveryTime }}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <div class="sellerRatings-content-ratings">
        <ratingsSelect :buttonName="{ all: '全部', positive: '满意', negative: '不满意' }" :rateType="rateType" :rateWithContent="rateWithContent" :ratings="ratings"></ratingsSelect>
        <div class="sellerRatings-content-ratings-list">
          <ul v-show="ratings && ratings.length > 0">
            <li class="sellerRatings-content-ratings-list-rate-item border-1px" v-for="rate in ratings" v-show="contentFilter(rate.rateType, rate.text)">
              <div class="sellerRatings-content-ratings-list-rate-item-avatar">
                <img width="28" height="28" :src="rate.avatar">
              </div>
              <div class="sellerRatings-content-ratings-list-rate-item-content">
                <p class="name">{{ rate.username }}</p>
                <div class="star-wrapper">
                  <star :size="24" :score="rate.score"></star><span class="delivery-time" v-show="rate.deliveryTime">{{ rate.deliveryTime }}分钟送达</span>
                </div>
                <p class="rate-text">{{ rate.text }}</p>
                <div class="recommend" v-show="rate.recommend && rate.recommend.length > 0">
                  <i :class="{'icon-thumb_up': rate.rateType === 0, 'icon-thumb_down': rate.rateType === 1}"></i>
                  <span class="recommend-item" v-for="item in rate.recommend">{{ item }}</span>
                </div>
                <div class="time">{{ rate.rateTime | timeFormat }}</div>
              </div>
            </li>
          </ul>
          <div class="no-ratings" v-show="!ratings || ratings.length === 0">快来抢沙发！</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import split from '@/components/split/split'
  import star from '@/components/star/star'
  import ratingsSelect from '@/components/ratingsSelect/ratingsSelect'
  import {formatDate} from '@/common/js/date'
  import BScroll from 'better-scroll'

  const ALL = 2

  export default {
    name: 'ratings',
    watch: {
      ratings () {
        this.$nextTick(() => {
          this._initScroll()
        })
      }
    },
    mounted () {
      if (this.$refs['seller-ratings']) {
        this.$nextTick(function () {
          this._initScroll()
        })
      }
    },
    created () {
      // 监听来自 ratingsSelect 组件派发的事件 ratingsSelect
      this.$root.eventHub.$on('ratingsSelect', (rateType) => {
        this.rateType = rateType
        // 仅仅改变数据的时候 DOM 还没更新。将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
        // 不使用的话会因为评论过滤导致 better-scroll 高度计算不正确。
        this.$nextTick(() => {
          if (this.sellerRatingsScroll) {
            this.sellerRatingsScroll.refresh()
          }
        })
      })
      // 监听来自 ratingsSelect 组件派发的事件 rateWithContent
      this.$root.eventHub.$on('rateWithContent', (flag) => {
        this.rateWithContent = flag
        // 仅仅改变数据的时候 DOM 还没更新。将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
        // 不使用的话会因为评论过滤导致 better-scroll 高度计算不正确。
        this.$nextTick(() => {
          if (this.sellerRatingsScroll) {
            this.sellerRatingsScroll.refresh()
          }
        })
      })
    },
    props: {
      seller: {
        type: Object
      },
      ratings: {
        type: Array
      }
    },
    filters: {
      timeFormat (time) {
        return formatDate(new Date(time), 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      split,
      star,
      ratingsSelect
    },
    data () {
      return {
        rateType: ALL,
        rateWithContent: false
      }
    },
    methods: {
      _initScroll () {
        this.sellerRatingsScroll = new BScroll(this.$refs['seller-ratings'], {
          click: true
        })
      },
      contentFilter (rateType, rateText) {
        if (this.rateWithContent && !rateText) {
          return false
        }
        if (this.rateType === ALL) {
          return true
        } else {
          return this.rateType === rateType
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .sellerRatings
    position fixed
    top 174px
    bottom 0
    left 0
    overflow hidden
    width 100%
    .sellerRatings-content
      .sellerRatings-content-overview
        display flex
        padding 18px 0
        .sellerRatings-content-overview-left
          flex 0 0 137px
          width 137px
          border-right 1px solid rgba(7, 17, 27, .1)
          text-align center
          padding 6px 0
          @media only screen and (max-width: 320px)
            flex 0 0 120px
            width 120px
          .sellerRatings-content-overview-left-score
            font-size 24px
            color rgb(255, 153, 0)
            line-height 28px
            margin-bottom 6px
          .sellerRatings-content-overview-left-text
            font-size 12px
            color rgb(7, 17, 27)
            line-height 12px
            margin-bottom 8px
          .sellerRatings-content-overview-left-rank-rate
            font-size 10px
            color rgb(147, 153, 159)
            line-height 10px
        .sellerRatings-content-overview-right
          flex 1
          padding 6px 0 6px 24px
          @media only screen and (max-width: 320px)
            padding-left 6px
          .sellerRatings-content-overview-right-service-score, .sellerRatings-content-overview-right-food-score
            margin-bottom 8px
            .star, .title, .score
              display inline-block
              vertical-align top
            .star
              margin 0 12px
            .title
              font-size 12px
              color rgb(7, 17, 27)
              line-height 18px
            .score
              font-size 12px
              color rgb(255, 163, 0)
              line-height 18px
          .sellerRatings-content-overview-right-delivery-time
            margin-bottom 0
            .title
              font-size 12px
              color rgb(7, 17, 27)
              line-height 18px
            .delivery-time
              font-size 12px
              color rgb(147, 153, 159)
              line-height 18px
              margin-left 12px
      .sellerRatings-content-ratings-list
        padding 0 18px
        .no-ratings
          padding 16px
          font-size 12px
          color rgb(147, 153, 159)
          text-align center
        .sellerRatings-content-ratings-list-rate-item
          display flex
          padding 18px 0
          border-1px(rgba(7, 17, 27, .1))
          &:last-child
            border-none()
          .sellerRatings-content-ratings-list-rate-item-avatar
            flex 0 0 28px
            width 28px
            margin-right 12px
            img
              border-radius 50%
          .sellerRatings-content-ratings-list-rate-item-content
            flex 1
            position relative
            .name
              font-size 10px
              color rgb(7, 17, 27)
              line-height 12px
              margin-bottom 4px
            .star-wrapper
              margin-bottom 6px
              .star
                margin-right 6px
                display inline-block
                vertical-align top
              .delivery-time
                display inline-block
                vertical-align top
                font-size 10px
                color rgb(147, 153, 159)
                line-height 12px
            .rate-text
              font-size 12px
              color rgb(7, 17, 27)
              line-height 18px
              margin-bottom 8px
            .time
              position absolute
              right 0
              top 0
              font-size 10px
              color rgb(147, 153, 159)
              line-height 12px
            .recommend
              font-size 0
              .icon-thumb_up, .icon-thumb_down
                font-size 12px
                line-height 16px
                display inline-block
                vertical-align middle
                margin 0 8px 4px 0
              .icon-thumb_up
                color rgb(0, 160, 220)
              .icon-thumb_down
                color rgb(147, 153, 159)
              .recommend-item
                display inline-block
                vertical-align middle
                font-size 9px
                line-height 16px
                color rgb(147, 153, 159)
                border 1px solid rgba(7, 17, 27, .1)
                border-radius 1px
                padding 0 6px
                margin 0 8px 4px 0
</style>
