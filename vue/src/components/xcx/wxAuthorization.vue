<template>
    <el-form class="list-box">
        <el-tabs v-model="activeName" type="card">
            <div class="list-body">
                <el-tab-pane label="小程序授权" name="first">

                    <el-row :gutter="10">
                        <el-col :lg="6">&nbsp;</el-col>
                        <el-col :lg="12">
                            <el-alert
                                v-if="data.wx_xcx_joined==1"
                                title="已开通小程序"
                                type="success"
                                :description="description"
                                :closable="false"
                                show-icon>
                              </el-alert>
                            <el-alert
                                v-if="data.wx_xcx_joined==0"
                                title="未开通小程序"
                                type="warning"
                                :description="description"
                                :closable="false"
                                show-icon>
                              </el-alert>
                            <div class="shouquan" v-if="data.wx_xcx_authorized==0 && data.wx_xcx_auth_url">
                                <a :href="data.wx_xcx_auth_url" target="_blank" class="el-button el-button--primary">一键授权</a>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" v-if="data.wx_xcx_authorized">
                        <el-col :lg="6">&nbsp;</el-col>
                        <el-col :lg="12">
                            <dl class="sqInfo">
                                 <dt>已授权小程序信息</dt>
                                 <dd>
                                    <ul>
                                        <li><span>小程序名称：</span>{{data.wx_xcx_authorized_info.nick_name}}</li>
                                        <li><span>小程序LOGO：</span><img :src="data.wx_xcx_authorized_info.head_img" alt="" width="100"></li>
                                        <li><span>小程序二维码：</span><img :src="data.wx_xcx_authorized_info.qrcode_url" alt="" width="100"></li>
                                        <li><span>公司信息：</span>{{data.wx_xcx_authorized_info.principal_name}}</li>
                                    </ul>
                                 </dd>
                             </dl> 
                        </el-col>
                    </el-row>
            
            </el-tab-pane>
        </div>
    </el-tabs>
</el-form>
</template>
<style scope lang='scss'>
.el-alert{
    margin-top: 20px;
}
.shouquan{
    text-align: center;margin: 20px;
}
.sqInfo{
    border:solid 1px #eee;
    line-height: 2.5;
    margin-top: 20px;
    font-size: 14px;
    dt{
        padding: 5px 10px;
        color:#666;
        background: #f8f8f8;
        border-bottom:solid 1px #eee;
    }
    dd{
        padding: 10px;
    }
    span{
        color:#666;
        display: inline-block;
        width: 10em;
        text-align: right;
    }
    img{
        vertical-align: middle;
    }
}
</style>
<script>
    var _self
    export default {
        data() {
            return {
                activeName: 'first',
                description:'',
                data:{
                    wx_xcx_joined:2,
                    wx_xcx_authorized:0,
                    wx_xcx_authorized_info:{}
                }
            }
        },
        created() {
            _self = this;
            this.getData();
        },
        methods: {
            getData(){
                _self.$http.get('weixin/component/auth?auth_type=2')
                    .then(function (res) {
                        if (res.codeFlag) {
                            var data = _self.data = res.d;
                            if(data.wx_xcx_joined){ //已开通
                                if(data.wx_xcx_authorized){ //已授权
                                    _self.description = "您已经成功授权过小程序,以下是您授权的详细信息";
                                }else{ //未授权
                                    _self.description = "您可以点击一键授权来创建自己的小程序";
                                }
                            }else{
                                _self.description = "如需要独立小程序，请联系网家客服";
                            }
                            console.log(22222,res)
                        }
                    })
            }
        }
    }
</script>