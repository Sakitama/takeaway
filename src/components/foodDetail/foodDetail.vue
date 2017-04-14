<template>
  <transition name="food-detail-show-fade">
    <div class="food-detail" v-show="foodDetailShowFlag" ref="food-detail">
      <div class="food-detail-content">
        <div class="food-detail-content-image">
          <img :src="selectedFood.image">
          <div class="food-detail-content-back" @click="showFoodDetail">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="food-detail-content-msg">
          <h1 class="food-detail-content-msg-name">{{ selectedFood.name }}</h1>
          <div class="food-detail-content-msg-extra">
            <span class="food-detail-content-msg-extra-sell-count">月销售{{ selectedFood.sellCount }}份</span><span class="food-detail-content-msg-extra-rating">好评率{{ selectedFood.rating }}%</span>
          </div>
          <div class="food-detail-content-msg-price">
            <span class="food-detail-content-msg-price-new">￥{{ selectedFood.price }}</span><span v-show="selectedFood.oldPrice" class="food-detail-content-msg-price-old">￥{{ selectedFood.oldPrice }}</span>
          </div>
          <div class="food-detail-content-cart-control-wrapper">
            <cartControl :food="selectedFood" ref="cartControl"></cartControl>
          </div>
          <transition name="food-detail-content-no-selected-food-fade">
            <div class="food-detail-content-no-selected-food" v-show="!selectedFood.count" @click="addFoodToCart($event)">加入购物车</div>
          </transition>
        </div>
        <split v-show="selectedFood.info"></split>
        <div class="food-detail-content-introduction" v-show="selectedFood.info">
          <h1 class="food-detail-content-introduction-title">商品介绍</h1>
          <p class="food-detail-content-introduction-info">{{ selectedFood.info }}</p>
        </div>
        <split></split>
        <div class="food-detail-content-ratings">
          <h1 class="food-detail-content-ratings-title">商品评价</h1>
          <ratingsSelect :rateType="rateType" :rateWithContent="rateWithContent" :ratings="selectedFood.ratings"></ratingsSelect>
          <div class="food-detail-content-ratings-list">
            <ul v-show="selectedFood.ratings && selectedFood.ratings.length > 0">
              <li class="food-detail-content-ratings-list-rate-item border-1px" v-for="rate in selectedFood.ratings" v-show="contentFilter(rate.rateType, rate.text)">
                <div class="food-detail-content-ratings-list-rate-item-user">
                  <span class="food-detail-content-ratings-list-rate-item-user-name">{{ rate.username }}</span><img width="12" height="12" :src="rate.avatar">
                </div>
                <div class="food-detail-content-ratings-list-rate-item-time">{{ rate.rateTime | timeFormat }}</div>
                <p class="food-detail-content-ratings-list-rate-item-description">
                  <i :class="{'icon-thumb_up': rate.rateType === 0, 'icon-thumb_down': rate.rateType === 1}"></i>{{ rate.text }}
                </p>
              </li>
            </ul>
            <div class="no-ratings" v-show="!selectedFood.ratings || selectedFood.ratings.length === 0">快来抢沙发！</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll'
  import cartControl from '@/components/cartControl/cartControl'
  import split from '@/components/split/split'
  import ratingsSelect from '@/components/ratingsSelect/ratingsSelect'
  import {formatDate} from '@/common/js/date'

  const ALL = 2

  export default {
    name: 'foodDetail',
    created () {
      // 监听来自 ratingsSelect 组件派发的事件 ratingsSelect
      this.$root.eventHub.$on('ratingsSelect', (rateType) => {
        this.rateType = rateType
        // 仅仅改变数据的时候 DOM 还没更新。将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
        // 不使用的话会因为评论过滤导致 better-scroll 高度计算不正确。
        this.$nextTick(() => {
          this.foodDetailScroll.refresh()
        })
      })
      // 监听来自 ratingsSelect 组件派发的事件 rateWithContent
      this.$root.eventHub.$on('rateWithContent', (flag) => {
        this.rateWithContent = flag
        // 仅仅改变数据的时候 DOM 还没更新。将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
        // 不使用的话会因为评论过滤导致 better-scroll 高度计算不正确。
        this.$nextTick(() => {
          this.foodDetailScroll.refresh()
        })
      })
    },
    props: {
      selectedFood: {
        type: Object
      }
    },
    data () {
      return {
        foodDetailShowFlag: false,
        rateType: ALL,
        rateWithContent: false
      }
    },
    filters: {
      timeFormat (time) {
        return formatDate(new Date(time), 'yyyy-MM-dd hh:mm')
      }
    },
    methods: {
      showFoodDetail () {
        if (!this.foodDetailShowFlag) {
          this.$nextTick(() => {
            if (!this.foodDetailScroll) {
              this.foodDetailScroll = new BScroll(this.$refs['food-detail'], {
                click: true
              })
            } else {
              this.foodDetailScroll.refresh()
            }
          })
        }
        this.foodDetailShowFlag = !this.foodDetailShowFlag
      },
      addFoodToCart (event) {
        // 因为“加入购物车”按钮一点击立即消失导致下一次DOM渲染的时候 getBoundingClientRect 方法获取不到其位置，所以给这个按钮加个过渡
        this.$refs.cartControl.addCount(event)
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
    },
    components: {
      cartControl,
      split,
      ratingsSelect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .food-detail
    position fixed
    top: 0
    bottom: 48px
    z-index 30
    width 100%
    background #fff
    &.food-detail-show-fade-enter
      transform translate3d(100%, 0, 0)
    &.food-detail-show-fade-enter-active
      transition all .2s linear
    &.food-detail-show-fade-leave-active
      transition all .2s linear
      transform translate3d(100%, 0, 0)
    .food-detail-content
      .food-detail-content-image
        position relative
        width 100%
        height 0
        padding-top 100%
        img
          position absolute
          top 0
          left 0
          width 100%
          height 100%
        .food-detail-content-back
          position absolute
          top 10px
          left 0
          .icon-arrow_lift
            display block
            padding 10px
            font-size 20px
            color #fff
      .food-detail-content-msg
        padding 18px
        position relative
        .food-detail-content-msg-name
          line-height 14px
          font-size 14px
          font-weight 700
          color rgb(7, 17, 27)
          margin-bottom 8px
        .food-detail-content-msg-extra
          font-size 10px
          color rgb(147, 153, 159)
          line-height 10px
          height 10px
          margin-bottom 18px
          .food-detail-content-msg-extra-sell-count
            margin-right 12px
        .food-detail-content-msg-price
          font-weight 700
          line-height 24px
          .food-detail-content-msg-price-new
            margin-right 8px
            font-size 14px
            color rgb(240, 20, 20)
          .food-detail-content-msg-price-old
            text-decoration line-through
            font-weight normal
            font-size 10px
            color rgb(147, 153, 159)
        .food-detail-content-cart-control-wrapper
          position absolute
          right 12px
          bottom 12px
        .food-detail-content-no-selected-food
          position absolute
          right 18px
          bottom 18px
          z-index 10px
          line-height 24px
          height 24px
          font-size 10px
          border-radius 12px
          padding 0 12px
          box-sizing border-box
          background rgb(0, 160, 220)
          color #fff
          text-align center
          &.food-detail-content-no-selected-food-fade-leave-active
            transition all .2s linear
            opacity 0
      .food-detail-content-introduction
        padding 18px
        background #fff
        .food-detail-content-introduction-title
          font-size 14px
          color rgb(7, 17, 27)
          line-height 14px
          margin-bottom 6px
        .food-detail-content-introduction-info
          padding 0 6px
          font-size 12px
          color rgb(77, 85, 90)
          line-height 24px
      .food-detail-content-ratings
        background #fff
        padding-top 18px
        .food-detail-content-ratings-title
          margin-left 18px
          font-size 14px
          color rgb(7, 17, 27)
          line-height 14px
        .food-detail-content-ratings-list
          padding 0 18px
          .food-detail-content-ratings-list-rate-item
            position relative
            padding 16px 0
            border-1px(rgba(7, 17, 27, .1))
            .food-detail-content-ratings-list-rate-item-user
              position absolute
              right 0
              top 16px
              line-height 12px
              .food-detail-content-ratings-list-rate-item-user-name
                display inline-block
                vertical-align top
                margin-right 6px
                font-size 10px
                color rgb(147, 153, 159)
              img
                border-radius 50%
            .food-detail-content-ratings-list-rate-item-time
              font-size 10px
              line-height 12px
              color rgb(147, 153, 159)
              margin-bottom 6px
            .food-detail-content-ratings-list-rate-item-description
              line-height 16px
              font-size 12px
              color rgb(7, 17, 27)
              .icon-thumb_up, .icon-thumb_down
                margin-right 4px
                line-height 16px
                display inline-block
                vertical-align top
              .icon-thumb_up
                color rgb(0, 160, 220)
              .icon-thumb_down
                color rgb(147, 153, 159)
          .no-ratings
            padding 16px
            font-size 12px
            color rgb(147, 153, 159)
            text-align center
</style>
