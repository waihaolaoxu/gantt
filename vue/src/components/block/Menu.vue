<template>
    <div class="asideContant">
        <div class="aside-wrap no-select">
        <div class="asideBox">
            <div class="logo">
                <router-link to="/" id="companyStyle">{{companyName}}</router-link>
                <!-- {{companyName}} -->
            </div>
            <div class="logoSub f10">
                <span class="lineL"></span>By 网家装企云管理平台<span class="lineR"></span>
            </div>
            <div class="menu-wrap">
                <el-menu :default-active="activePath" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse"
                    unique-opened background-color="#324157" text-color="#B4BCCC" active-text-color="#fff" style="border-right:0"
                    router>
                    <el-submenu :index="String(key)" v-for="(value, key) in navData" :key="key" v-if="d.info.has_site == 0 && value.includes != 'independentsite' || d.info.has_site == 1" :includes='value.includes'>

                        <template slot="title" class="sss">
                            <div class="pa full zero" style='z-index:1;' @click.prevent.stop='imLogin(value.item[0])' v-if="value.includes=='im'"></div>
                            <i :class="value.icon"></i>
                            <span slot="title">
                                {{value.name}}
                                <div class="point" v-if="value.includes == 'clue' && value.item[0].num > 0 && pointFlag"></div>
                            </span>
                        </template>
                        <!---->
                        <el-menu-item :index="value.href"  v-for="(value, key) in value.item" :key="key" :route="{path:value.href}" v-if="d.info.has_site == 0 && value.href != '/column/list' || d.info.has_site == 1">{{value.name}}
                            &nbsp;<small  v-if='value.num'  class="bg-red" style="border-radius: 16px;padding:0px 6px 0 5px;height: 16px;line-height: 16px;text-align: center;top: 15px;display:inline-block;color:#fff">{{value.num}}</small>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
            </div>
        </div>
    </div>
    </div>
    
</template>
<style>
.point{
    width: 8px;
    height: 8px;
    background-color: #dd4b39;
    border-radius: 50%;
    top: 15px;
    left: 106px;
    display: inline-block;
}
.asideContant{
    width: 200px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    background: #324157;
    overflow-y: hidden;
}
.asideBox{
    width:200px;
    overflow-y: hidden;
}
.aside-wrap{
    width:220px;
}
[includes=im] .el-submenu__icon-arrow{
    display: none;
}
</style>
<script>
    import bus from '../../state'
    var _self;
    export default {
        data() {
            return {
                isCollapse: false,
                d: JSON.parse(this.$localStorage.get('userInfoM')),
                pointFlag: true,
                companyName:''
            }
        },
        created() {
            _self = this;
            
            if (_self.d.info) {
                bus.$emit('nickname', _self.d.info.nickname);
                // console.log(_self.d.info.nickname)
            }
            bus.$on('reloadMeun',function(){
                _self.checklogin()
            })
             this.companyName = this.d.info.company_name;
        },
        mounted(){
            if(this.companyName.length>=8 && this.companyName.length<9){
                document.getElementById("companyStyle").className='f17';
            }else if(this.companyName.length>9){
                document.getElementById("companyStyle").className='f15';
            }
        },
        methods: {
            checklogin(){
                this.$http.post('account/checklogin').then(res => {
                    if (res.codeFlag) {
                        _self.$localStorage.set('userInfoM', JSON.stringify(res.data.data), 24 *
                                60 * 60 * 1000); // 1天后过期
                            _self.$.userInfo= _self.d = res.data.data;
                        }
                    });
            },
            gxMenu(b){
                this.d = b
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
                if (key == 5) {
                    this.pointFlag = false
                } else {
                    this.pointFlag = true
                }
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
                if (key == 5) {
                    this.pointFlag = true
                }
            },
            imLogin(v){
                var winpop=window.open('','pop');
                winpop.document.write('<div style="width:370px;height:85px;border:solid 1px #ddd;margin:100px auto;text-align:center;line-height:85px;font-size:14px;color:#2b2b2b;background:#f8f8f8;">跳转中请稍后...</div>');
                _self.$http.get('im/gettoken?username='+v.im_kf_username)
                    .then(function (res) {
                        if (res.codeFlag) {
                            window.open('https://im.jiajuol.com/login?expires_in='+res.d.expires_in+'&access_token='+res.d.access_token,'pop')
                        }else{
                            winpop.close();
                            _self.$message({
                                message: res.data.description,
                                type: 'warning'
                            });
                        }
                    })
            }
        },
        computed: {
            navData() {
                // console.log(this.d.menus)
                return this.d.menus;
            },
            activePath() {
                var path = this.$route.path;
                var light = this.$route.meta.light;
                var param = this.$route.meta.param;
                if (light) {
                    path = light;
                    if (param) {
                        path = path + '/' + this.$route.params[param];
                    }
                }
                return path;
            }
        }
    }

</script>
