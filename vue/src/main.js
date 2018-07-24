// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './axios'

// 全局公共组件
import './components/block/elemeui'
import './components/block/common'
// 列表拖动组件
import VueDND from 'awe-dnd'
Vue.use(VueDND)

import App from './App'
import router from './router'
import Storage from 'vue-local-storage';
Vue.use(Storage)
import VueLazyLoad from 'vue-lazyload';
import VCharts from 'v-charts'
Vue.use(VCharts)
Vue.use(VueLazyLoad, {
    preLoad: 1.3,
    error: './static/blank.gif',
    loading: './static/blank.gif',
    attempt: 1
})
let Base64 = require('js-base64').Base64;
Vue.filter('countDownFn', function (value) {
    var value = value;
    var fmt = '';
    var days = parseInt(value / (1000 * 60 * 60 * 24));
    var hours = parseInt((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((value % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (value % (1000 * 60)) / 1000;
    var fmt = days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 "
    return fmt;
})
Vue.config.productionTip = false
new Vue({
    el: '#app',
    router,
    data: {
        date: new Date(),
        test: 'test===========',
    },
    methods: {
        a() {
            alert(this.test);
        }
    },
    template: '<App/>',
    components: {
        App
    }
})
