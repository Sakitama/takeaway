<template>
  <div class="ratingsSelect">
    <div class="ratingsSelect-tab border-1px">
      <span class="ratingsSelect-tab-all" :class="{'active': currentRateList === 2}" @click="showRateList(2, $event)">{{ buttonName.all }}<span class="rate-count">{{ ratings.length }}</span></span><span class="ratingsSelect-tab-positive" :class="{'active': currentRateList === 0}" @click="showRateList(0, $event)">{{ buttonName.positive }}<span class="rate-count">{{ positiveRatingsCount }}</span></span><span class="ratingsSelect-tab-negative" :class="{'active': currentRateList === 1}" @click="showRateList(1, $event)">{{ buttonName.negative }}<span class="rate-count">{{ negativeRatingsCount }}</span></span>
    </div>
    <div class="ratingsSelect-switch" @click="showRateWithContent($event)">
      <i class="icon-check_circle" :class="{'active': rateWithContentFlag === true}"></i><span class="ratingsSelect-switch-text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const ALL = 2
  const POSITIVE = 0
  const NEGATIVE = 1

  export default {
    name: 'ratingsSelect',
    props: {
      ratings: {
        type: Array,
        default () {
          return []
        }
      },
      buttonName: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
          }
        }
      },
      rateType: {
        type: Number,
        default: 0
      },
      rateWithContent: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        currentRateList: this.rateType,
        rateWithContentFlag: this.rateWithContent
      }
    },
    computed: {
      positiveRatingsCount () {
        let count = 0
        this.ratings.forEach((rate) => {
          if (rate.rateType === 0) {
            count++
          }
        })
        return count
      },
      negativeRatingsCount () {
        let count = 0
        this.ratings.forEach((rate) => {
          if (rate.rateType === 1) {
            count++
          }
        })
        return count
      }
    },
    methods: {
      showRateList (rateType, event) {
        // 过滤掉原生事件，使用 better-scroll 的派发事件
        if (!event._constructed) {
          return
        }
        if (rateType === ALL) {
          this.currentRateList = ALL
        }
        if (rateType === POSITIVE) {
          this.currentRateList = POSITIVE
        }
        if (rateType === NEGATIVE) {
          this.currentRateList = NEGATIVE
        }
        this.$root.eventHub.$emit('ratingsSelect', this.currentRateList)
      },
      showRateWithContent (event) {
        // 过滤掉原生事件，使用 better-scroll 的派发事件
        if (!event._constructed) {
          return
        }
        this.rateWithContentFlag = !this.rateWithContentFlag
        this.$root.eventHub.$emit('rateWithContent', this.rateWithContentFlag)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratingsSelect
    .ratingsSelect-tab
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7, 17, 27, .1))
      .ratingsSelect-tab-all, .ratingsSelect-tab-positive, .ratingsSelect-tab-negative
        padding 8px 12px
        display inline-block
        margin-right 8px
        border-radius 1px
        font-size 12px
        line-height 16px
        color rgb(77, 85, 93)
        .rate-count
          font-size 8px
          margin-left 2px
        &.active
          color #fff
      .ratingsSelect-tab-all
        background rgba(0, 179, 140, .2)
        &.active
          background rgb(0, 179, 140)
      .ratingsSelect-tab-positive
        background rgba(0, 176, 240, .2)
        &.active
          background rgb(0, 176, 240)
      .ratingsSelect-tab-negative
        background rgba(77, 85, 93, .2)
        margin-right 0
        &.active
          background rgb(77, 85, 93)
    .ratingsSelect-switch
      padding 12px 18px
      line-height 24px
      font-size 12px
      color rgb(147, 153, 159)
      border-bottom 1px solid rgba(7, 17, 27, .1)
      .icon-check_circle, .ratingsSelect-switch-text
        display inline-block
        vertical-align top
      .icon-check_circle
        font-size 24px
        margin-right 4px
        &.active
          color #00c850
</style>
