<template>
  <div class="shopping-cart">
    <div class="shopping-cart-content">
      <div class="shopping-cart-content-left">
        <div class="shopping-cart-content-left-logo-wrapper" @click="toggleListShow">
          <div class="shopping-cart-content-left-logo" :class="{ 'highlight': totalCount > 0 }">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="shopping-cart-content-left-count" v-show="totalCount > 0">{{ totalCount }}</div>
        </div>
        <div class="shopping-cart-content-left-total" :class="{ 'highlight': totalPrice > 0 }">￥{{ totalPrice }}</div>
        <div class="shopping-cart-content-left-description">另需配送费{{ deliveryPrice }}元</div>
      </div>
      <div class="shopping-cart-content-right" @click="pay">
        <div class="shopping-cart-content-right-pay" :class="{ 'highlight': totalPrice >= minPrice }">{{ payDescription }}</div>
      </div>
    </div>
    <transition-group name="ball-fade" tag="div" class="ball-container" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
      <div v-for="ball in balls" v-bind:key="ball" v-show="ball.show" class="ball">
        <div class="ball-inner ball-inner-hook"></div>
      </div>
    </transition-group>
    <transition name="shopping-cart-list-fade">
      <div class="shopping-cart-list" v-show="listShow">
        <div class="shopping-cart-list-header">
          <h1 class="shopping-cart-list-header-title">购物车</h1>
          <span class="shopping-cart-list-header-empty" @click="listEmpty">清空</span>
        </div>
        <div class="shopping-cart-list-container" ref="shopping-cart-list-container">
          <ul>
            <li v-for="foodsItem in selectFoods" class="shopping-cart-list-container-food">
              <span class="shopping-cart-list-container-food-name">{{ foodsItem.name }}</span>
              <div class="shopping-cart-list-container-food-total">
                <span>￥{{ foodsItem.price * foodsItem.count }}</span>
              </div>
              <div class="cart-control-wrapper">
                <cartControl :food="foodsItem"></cartControl>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="shopping-cart-mask-fade">
      <div class="shopping-cart-mask" v-show="listShow" @click="foldList"></div>
    </transition>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import cartControl from '@/components/cartControl/cartControl'

  export default {
    name: 'shoppingCart',
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        isFold: true
      }
    },
    props: {
      selectFoods: {
        type: Array,
        default () {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    computed: {
      totalPrice () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.count
        })
        return total
      },
      payDescription () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`
        }
        if (this.totalPrice < this.minPrice) {
          return '还差￥' + (this.minPrice - this.totalPrice) + '起送'
        } else {
          return '去结算'
        }
      },
      listShow () {
        if (this.totalCount > 0) {
          let show = !this.isFold
          if (show) {
            this.$nextTick(() => {
              if (!this.listScroll) {
                this.listScroll = new BScroll(this.$refs['shopping-cart-list-container'], {
                  click: true
                })
              } else {
                this.listScroll.refresh()
              }
            })
          }
          return show
        }
        this.isFold = true
        return false
      }
    },
    methods: {
      // 找出一个隐藏的小球，让其显示出来并添加到已经落下的小球数组中
      _drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeEnter (el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let offset = ball.el.getBoundingClientRect()
            let offsetX = offset.left - 32
            let offsetY = -(window.innerHeight - offset.top - 22)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0, ${offsetY}px, 0)`
            el.style.transform = `translate3d(0, ${offsetY}px, 0)`
            let ballInner = el.getElementsByClassName('ball-inner-hook')[0]
            ballInner.style.webkitTransform = `translate3d(${offsetX}px, 0, 0)`
            ballInner.style.transform = `translate3d(${offsetX}px, 0, 0)`
          }
        }
      },
      enter (el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight // 手动触发重绘
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)'
          el.style.transform = 'translate3d(0, 0, 0)'
          el.style.webkitTransition = 'all .3s cubic-bezier(.49, -0.29, .75, .41)'
          el.style.transition = 'all .3s cubic-bezier(.49, -0.29, .75, .41)'
          let ballInner = el.getElementsByClassName('ball-inner-hook')[0]
          ballInner.style.webkitTransform = 'translate3d(0, 0, 0)'
          ballInner.style.transform = 'translate3d(0, 0, 0)'
          ballInner.style.webkitTransition = 'all .3s linear'
          ballInner.style.transition = 'all .3s linear'
        })
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          // 提前让到达位置的小球“消失”掉，否则会出现到达位置之后过一会才消失的情况
          el.style.display = 'none'
        }
      },
      toggleListShow () {
        if (this.totalCount > 0) {
          this.isFold = !this.isFold
        }
      },
      foldList () {
        this.isFold = true
      },
      listEmpty () {
        this.selectFoods.forEach((item) => {
          item.count = 0
        })
      },
      pay () {
        if (this.totalPrice < this.minPrice) {
          if (this.totalPrice > 0) {
            alert(`您目前总价为${this.totalPrice}元，满${this.minPrice}元才能给您送餐哦亲！`)
          } else {
            alert(`亲不点几个菜吗？`)
          }
        } else {
          alert(`确定前往支付宝付款${this.totalPrice}元吗亲？`)
        }
      }
    },
    components: {
      cartControl
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .shopping-cart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .shopping-cart-content
      display flex
      background #141d27
      font-size 0
      .shopping-cart-content-left
        flex 1
        .shopping-cart-content-left-logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d27
          .shopping-cart-content-left-logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highlight
              background rgb(0, 160, 220)
              .icon-shopping_cart
                color #fff
            .icon-shopping_cart
              font-size 24px
              color #80858a
              line-height 44px
          .shopping-cart-content-left-count
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            background rgb(240, 20, 20)
            font-size 9px
            font-weight 700
            border-radius 16px
            color #fff
            box-shadow 0 4px 8px 0 rgba(0, 0, 0, .4)
        .shopping-cart-content-left-total
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255, 255, 255, .1)
          font-size 16px
          font-weight 700
          color rgba(255, 255, 255, .4)
          &.highlight
            color #fff
        .shopping-cart-content-left-description
          display inline-block
          vertical-align top
          line-height 24px
          margin 12px 0 0 12px
          font-size 10px
          color rgba(255, 255, 255, .4)
      .shopping-cart-content-right
        flex 0 0 105px
        width 105px
        .shopping-cart-content-right-pay
          height 48px
          line-height 48px
          font-size 12px
          text-align center
          font-weight 700
          color rgba(255, 255, 255, .4)
          background #2b333b
          &.highlight
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        .ball-inner
          width 16px
          height 16px
          background rgb(0, 160, 220)
          border-radius 50%
    .shopping-cart-list
      position absolute
      left 0
      top 0
      z-index -1
      width 100%
      transform translate3d(0, -100%, 0)
      &.shopping-cart-list-fade-enter
        transform translate3d(0, 0, 0)
      &.shopping-cart-list-fade-enter-active
        transition all .2s linear
      &.shopping-cart-list-fade-leave-active
        transform translate3d(0, 0, 0)
        transition all .2s linear
      .shopping-cart-list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, .1)
        .shopping-cart-list-header-title
          float left
          color rgb(7, 17, 27)
          font-size 14px
        .shopping-cart-list-header-empty
          float right
          color rgb(0, 160, 220)
          font-size 12px
      .shopping-cart-list-container
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff
        .shopping-cart-list-container-food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7, 17, 27, .1))
          .shopping-cart-list-container-food-name
            font-size 14px
            color rgb(7, 17, 27)
            line-height 24px
          .shopping-cart-list-container-food-total
            position absolute
            right 90px
            bottom 12px
            font-size 14px
            font-weight 700
            color rgb(240, 20, 20)
            line-height 24px
          .cart-control-wrapper
            position absolute
            right 0
            bottom 6px
    .shopping-cart-mask
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      z-index -2
      background rgba(7, 17, 27, .6)
      backdrop-filter blur(10px)
      &.shopping-cart-mask-fade-enter
        opacity 0
      &.shopping-cart-mask-fade-enter-active
        transition all .2s linear
      &.shopping-cart-mask-fade-leave-active
        opacity 0
        transition all .2s linear
</style>
