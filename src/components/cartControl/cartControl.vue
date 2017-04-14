<template>
  <div class="cart-control">
    <transition name="decrease-fade">
      <div class="cart-control-decrease" v-show="food.count > 0" @click.stop="removeCount($event)">
        <i class="inner icon-remove_circle_outline"></i>
      </div>
    </transition>
    <div class="cart-control-count" v-show="food.count > 0">{{ food.count }}</div>
    <div class="cart-control-increase" @click.stop="addCount($event)">
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'cartControl',
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      removeCount (event) {
        // 过滤掉原生事件，使用 better-scroll 的派发事件
        if (!event._constructed) {
          return
        }
        if (this.food.count && this.food.count > 0) {
          this.food.count--
        }
      },
      addCount (event) {
        // 过滤掉原生事件，使用 better-scroll 的派发事件
        if (!event._constructed) {
          return
        }
        // 选中某个菜品的时候如果其对象里没有 count 属性，调用 Vue.set 进行设置
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        this.$root.eventHub.$emit('cartAdd', event.target)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cart-control
    font-size 0
    .cart-control-decrease
      display inline-block
      padding 6px
      .icon-remove_circle_outline
        font-size 24px
        line-height 24px
        color rgb(0, 160, 220)
      &.decrease-fade-enter-active
        transform translate3d(0, 0, 0)
        transition all .3s linear
        .inner
          display inline-block
          transform rotate(0)
          transition all .3s linear
      &.decrease-fade-enter
        opacity 0
        transform translate3d(24px, 0, 0)
        .inner
          display inline-block
          transform rotate(180deg)
      &.decrease-fade-leave-active
        opacity 0
        transform translate3d(24px, 0, 0)
        transition all .3s linear
        .inner
          display inline-block
          transform rotate(180deg)
          transition all .3s linear
    .cart-control-count
      display inline-block
      vertical-align top
      width 12px
      font-size 10px
      line-height 24px
      color rgb(147, 153, 159)
      padding-top 6px
      text-align center
    .cart-control-increase
      display inline-block
      padding 6px
      .icon-add_circle
        font-size 24px
        line-height 24px
        color rgb(0, 160, 220)
</style>
