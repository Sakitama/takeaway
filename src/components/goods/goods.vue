<template>
  <div class="goods" v-if="goods">
    <div class="menu-wrapper" ref="menu-wrapper">
      <ul>
        <li v-for="(menuItem, index) in goods" class="menu-item" :class="{ 'current': currentIndex === index }" @click="selectMenu(index, $event)">
          <span class="menu-item-name border-1px"><span v-show="menuItem.type > 0" class="icon" :class="classMap[menuItem.type]"></span>{{ menuItem.name }}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foods-wrapper">
      <ul>
        <li v-for="menuItem in goods" class="foods-list foods-list-hook">
          <h1 class="foods-menu">{{ menuItem.name }}</h1>
          <ul>
            <li @click="selectFood(foodsItem, $event)" v-for="foodsItem in menuItem.foods" class="foods-item border-1px">
              <div class="foods-item-image">
                <img width="57" height="57" :src="foodsItem.icon">
              </div>
              <div class="foods-item-content">
                <h2 class="foods-item-content-name">{{ foodsItem.name }}</h2>
                <p class="foods-item-content-description">{{ foodsItem.description }}</h2>
                <div class="foods-item-content-extra">
                  <span class="foods-item-content-extra-sell-count">月售{{ foodsItem.sellCount }}</span><span>好评率{{ foodsItem.rating }}%</span>
                </div>
                <div class="foods-item-content-price">
                  <span class="foods-item-content-price-new">￥{{ foodsItem.price }}</span><span v-show="foodsItem.oldPrice" class="foods-item-content-price-old">￥{{ foodsItem.oldPrice }}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cartControl :food="foodsItem"></cartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shoppingCart ref="shoppingCart" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods"></shoppingCart>
    <foodDetail ref="foodDetail" :selectedFood="selectedFood"></foodDetail>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import shoppingCart from '@/components/shoppingCart/shoppingCart'
  import cartControl from '@/components/cartControl/cartControl'
  import foodDetail from '@/components/foodDetail/foodDetail'

  const ERR_OK = 0

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      this.$http.get('/api/goods').then(response => {
        response = response.body
        if (response.errorNumber === ERR_OK) {
          this.goods = response.data
          this.$nextTick(() => {
            this.initScroll()
            this.calculateHeight()
          })
        }
      })
      // 监听来自 cartControl 组件派发的事件 cartAdd
      this.$root.eventHub.$on('cartAdd', (target) => {
        this.drop(target)
      })
    },
    data () {
      return {
        goods: this.goods,
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    // 判断滚动偏移量在哪个区块范围内去高亮对应的菜单项，返回菜单项的索引
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let start = this.listHeight[i]
          let end = this.listHeight[i + 1]
          if (!end || (this.scrollY >= start && this.scrollY < end)) {
            return i
          }
        }
        return 0
      },
      // 获取选择的商品对象，返回一个数组
      selectFoods () {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((item) => {
            if (item.count) {
              foods.push(item)
            }
          })
        })
        return foods
      }
    },
    methods: {
      initScroll () {
        this.menuScroll = new BScroll(this.$refs['menu-wrapper'], {
          click: true
        })
        this.foodsScroll = new BScroll(this.$refs['foods-wrapper'], {
          click: true,
          probeType: 3
        })
        // 获取滚动偏移
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      // 计算所有区块的纵坐标
      calculateHeight () {
        let height = 0
        let foodsList = this.$refs['foods-wrapper'].getElementsByClassName('foods-list-hook')
        this.listHeight.push(height)
        for (let i = 0; i < foodsList.length; i++) {
          height += foodsList[i].clientHeight
          this.listHeight.push(height)
        }
      },
      selectMenu (index, event) {
        // 过滤掉原生事件，使用 better-scroll 的派发事件
        if (!event._constructed) {
          return
        }
        let foodsList = this.$refs['foods-wrapper'].getElementsByClassName('foods-list-hook')
        let el = foodsList[index]
        // 在300ms内滚动到指定元素
        this.foodsScroll.scrollToElement(el, 300)
      },
      drop (target) {
        // 体验优化，异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shoppingCart._drop(target)
        })
      },
      selectFood (food, event) {
        // 过滤掉原生事件，使用 better-scroll 的派发事件
        if (!event._constructed) {
          return
        }
        this.selectedFood = food
        this.$refs.foodDetail.showFoodDetail()
      }
    },
    name: 'goods',
    components: {
      shoppingCart,
      cartControl,
      foodDetail
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        padding 0 12px
        line-height 14px
        &.current
          font-weight 700
          position relative
          margin-top -1px
          z-index 10
          background #fff
          .menu-item-name
            border-none()
        .menu-item-name
          display table-cell
          width 56px
          vertical-align middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size 12px
          .icon
            display inline-block
            vertical-align top
            width 12px
            height 12px
            margin-right 2px
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
    .foods-wrapper
      flex 1
      .foods-menu
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7
      .foods-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom 0
        .foods-item-image
          flex 0 0 57px
          margin-right 10px
        .foods-item-content
          flex 1
          .foods-item-content-name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgb(7, 17, 27)
          .foods-item-content-description
            line-height 14px
            font-size 10px
            color rgb(147, 153, 159)
            margin-bottom 8px
          .foods-item-content-extra
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
            .foods-item-content-extra-sell-count
              margin-right 12px
          .foods-item-content-price
            font-weight 700
            line-height 24px
            .foods-item-content-price-new
              margin-right 8px
              font-size 14px
              color rgb(240, 20, 20)
            .foods-item-content-price-old
              text-decoration line-through
              font-weight normal
              font-size 10px
              color rgb(147, 153, 159)
          .cart-control-wrapper
            position absolute
            right 0
            bottom 12px
</style>

