// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import '@/common/stylus/index.styl'
import Resource from 'vue-resource'

Vue.use(Resource)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#takeaway',
  router,
  components: {
    App
  },
  // 中央事件总线用于事件派发与接收
  data: {
    eventHub: new Vue()
  }
})
