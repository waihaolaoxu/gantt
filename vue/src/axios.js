import Vue from 'vue'
import router from './router';
import axios from 'axios'
import {
    Loading,
    Message
} from 'element-ui';
import bus from './state'

// import $localStorage from 'vue-local-storage';
import $ from './util';
var instance = axios.create({
    baseURL: '/api/company/',
    timeout: 10000
});
//缓存本页面数据参数
var urlCache = {};
var routerFlag = true; //路由变化是否是其他页面，默认path变化
router.beforeEach((to, from, next) => { //路由监听
    if (to.path != from.path) {
        urlCache = {};
    }
    next();
})

function clearCache() {
    setTimeout(() => {
        urlCache = {};
        clearCache();
    }, 1000 * 60 * 60 * 12);
}; //12小时缓存失效
var loading;
var set; //settimeout loading
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // var userInfo = JSON.parse($localStorage.get('userInfo') || '{}');
    // if (config.method == 'get') {
    //     if (!config.params) {
    //         config.params = {};
    //     }
    //     var opt = config.params;
    //     if (opt.token !== false) {
    //         config.params.token = userInfo.token;

    //     } else {
    //         delete config.params.token;
    //     }
    //     config.params.user_id = userInfo.user_id;
    // } else if (config.method == 'post') {
    //     if (!config.data) {
    //         config.data = {};
    //     }
    //     var opt = config.data;
    //     if (opt.token !== false) {
    //         config.data.token = userInfo.token;
    //     } else {
    //         delete config.data.token;
    //     }
    //     config.data.user_id = userInfo.user_id;
    // }
    // 在发送请求之前做些什么
    if (set) {
        clearTimeout(set);
    }
    loading = Loading.service({
        background: 'rgba(255,255,255,0.05)',
        spinner:' ',
        // text: '加载中...'
    });
    return config;
}, function (error) {
    // 对请求错误做些什么
    Message({
        message: '接口异常',
        type: 'error'
    });
    set = setTimeout(function () {
        loading.close();
    }, 100)
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (res) {

    set = setTimeout(function () {
        loading.close();
    }, 100)
    var config = res.config;
    if (config.cache && res.data.code == 1000) {
        var p = config.url.replace(config.baseURL, '') + JSON.stringify(config.params);
        // console.log(2, p)
        urlCache[p] = res;
    }
    // 对响应数据做点什么
    if (res.data.code != 1000) { //错误提示
        Message({
            message: res.data.description,
            type: 'warning'
        });
    }
    if (res.data.code == 1004) { // 未登录
        router.replace({
            path: '/login'
        })
    } else if (res.data.code == 1005) { // 没权限
        if (config.method == 'get'&&!config.rule) {
            bus.$emit("rule",true);
        }
    }
    if (res.data.code == 1000) { //正确返回
        res.codeFlag = true;
        res.d = res.data.data;
    }
    return res;
}, function (error) {
    // 对响应错误做点什么
    Message({
        message: '接口异常',
        type: 'error'
    });
    set = setTimeout(function () {
        loading.close();
    }, 100)
    return Promise.reject(error);
});

//缓存数据方法

var $cache = (url, params) => {
    if (!params) {
        params = {
            params: {}
        };
    };
    params.cache = true;
    var p = url + (params ? JSON.stringify(params.params) : '');
    // console.log(1, p)
    if (urlCache[p]) {
        return new Promise((resolve, reject) => {
            resolve(urlCache[p]);
        })
    }
    return instance.get(url, params);
}
Vue.prototype.$cache = $cache;
var $http = instance;
Vue.prototype.$http = instance
export {
    $http,
    $cache
}
