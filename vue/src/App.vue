<template>
    <div id="app">
        <div style="width:80%;margin:10px auto 0;" v-if="tipBrowser">
            <el-alert title="浏览器不兼容" show-icon type="warning" :closable="false">
                <p class="el-alert__description">您当前的浏览器性能低下，推荐使用 <a href="https://pc.qq.com/detail/1/detail_2661.html" target="_blank" style="color:#409EFF;text-decoration: underline;">chrome浏览器</a> 或使用360浏览器的极速模式访问</p>
            </el-alert>
        </div>
        <router-view v-if='start && !tipBrowser'></router-view>
    </div>
</template>
<script>
var _self;
export default {
  name: "app",
  data() {
    return {
      tipBrowser:false,
      start: false //确保checklogin检查完成之后再去渲染页面
    };
  },
  created() {
    _self = this;
    _self.checkBrowser();
    var w = window.location.href;
    if (w.indexOf("/login") == -1 && w.indexOf("/fastLogin") == -1) {
      var userInfo = this.$localStorage.get("userInfoM");
      if (userInfo) {
        var data = JSON.parse(userInfo);
        _self.$.userInfo = data;
        this.$http.post("account/checklogin").then(res => {
          if (res.codeFlag) {
            _self.$localStorage.set(
              "userInfoM",
              JSON.stringify(res.data.data),
              24 * 60 * 60 * 1000
            ); // 1天后过期
            _self.$.userInfo = res.data.data;
            _self.start = true;
          }
        });
      } else {
        _self.start = true;
        this.$router.replace({
          path: "/login"
        });
      }
    } else {
      _self.start = true;
    }
    _self.$router.beforeEach((to, from, next) => {
      _self.start = true;
      next();
    });
  },
  methods: {
    checkBrowser() {
      function myBrowser() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
          return "Opera";
        } //判断是否Opera浏览器
        if (userAgent.indexOf("Firefox") > -1) {
          return "FF";
        } //判断是否Firefox浏览器
        if (userAgent.indexOf("Chrome") > -1) {
          return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
          return "Safari";
        } //判断是否Safari浏览器
        if (
          userAgent.indexOf("compatible") > -1 &&
          userAgent.indexOf("MSIE") > -1 &&
          !isOpera
        ) {
          return "IE";
        } //判断是否IE浏览器
      }
      //以下是调用上面的函数
      var mb = myBrowser();
      if(typeof mb === 'undefined'){
          _self.tipBrowser = true;
      }
    }
  }
};
</script>
<style lang="scss">
@import "~sass/app.scss";
</style>
