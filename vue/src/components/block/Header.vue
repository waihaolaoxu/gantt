<template>
    <div class="header">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" menu-trigger="click">
            <li class="el-menu-item" @click="asideToggle">
                <i class="iconfont" :class="{'icon-dedent':!asideFolded,'icon-indent':asideFolded}"></i>
            </li>
            <!-- <el-menu-item index="1">处理中心</el-menu-item>
            <el-submenu index="2">
              <template slot="title">我的工作台</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-submenu> -->

            <el-submenu index="4" class="login-info">
                <template slot="title">{{nickname}}</template>
                <el-menu-item index="4-2" @click="editPassword">修改密码</el-menu-item>
                <el-menu-item index="4-1" @click="loginoutFn">退出登录</el-menu-item>
            </el-submenu>
            <div class="fr" v-if='false'>
                <el-tooltip placement="top" effect="light">
                    <div slot="content" class="text-center">
                        <div class="mb5">
                            扫描二维码安装
                            <br/>装修宝APP
                        </div>
                        <img src="//icon.jiajuol.com/companyCrm/zhuangxiubao.png!c" alt="" style='width:110px;'>
                    </div>
                    <img src="//icon.jiajuol.com/companyCrm/zhuangxiubao_logo.jpg!c" alt="" style='height:50px;'>
                </el-tooltip>
            </div>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../../state'
    var _self;
    export default {
        data() {
            return {
                activeIndex: '1',
                asideFolded: true,
                nickname: ''
            };
        },
        created() {
            _self = this;
            this.checkWidth();
            window.onresize = this.checkWidth;
            var that = this;
            bus.$on('nickname', function (nickname) {
                console.log("12313123", nickname)
                that.nickname = nickname
            });
        },
        methods: {
            editPassword() {
                this.editShow = true;
                bus.$emit('editShow', this.editShow);
            },
            checkWidth: function () {
                if (window.innerWidth > 500) {
                    this.asideFolded = false;
                    bus.$emit('asideToggle', false);
                } else {
                    this.asideFolded = true;
                    bus.$emit('asideToggle', true);
                }
            },
            asideToggle() {
                this.asideFolded = !this.asideFolded;
                bus.$emit('asideToggle', this.asideFolded);
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            // 退出登录
            loginoutFn() {
                _self.$http.post('account/loginout')
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.$localStorage.remove('userInfoM');
                            _self.$.userInfo = {};
                            _self.$router.push({
                                path: '/login'
                            });

                        }
                    })
            }
        }
    }

</script>
