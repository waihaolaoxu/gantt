import Vue from 'vue'
// import bus from '../../state'
import Here from './here';
import Evaluation from './evaluation';
// import extend from 'extend';
import $ from '@/util.js';
// 面包屑导航
Vue.component('my-here', Here)
Vue.component('my-evaluation', Evaluation)
Vue.filter('time', function(value,fmt){
    return $.time(value,fmt)
})
