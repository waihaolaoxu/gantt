<template>
    <div class="home">
        <div v-show="showFlag&&!loading">
            <div class="widget-user-header">
                <div class="widget-user-img">
                    <img :src="data.companyLogo" class="border5">
                </div>
                <div class="widget-user-username">
                    <div class="widge-user-info">
                        <span>{{data.companyName}}</span>
                        <span class="standard">
                            <span v-if="data.cooperation_status == 1">标准版</span>
                            <span v-else>未合作</span>
                        </span>
                    </div>
                    <p class="text-muted" v-if="data.source_type == 1">服务有效期：{{data.servceDate}}</p>
                </div>
            </div>
            <div class="box-footer my_box_footer">
                <div class="col-sm-offset">
                    <div v-if="data.cooperation_status == 1">
                        <router-link :to='{path:"/clue/list"}'>
                            <h5 class="description-header text-red">{{data.crmApplyNum}}</h5>
                            <p class="description-text">新客户</p>
                        </router-link>
                    </div>
                    <div v-else>
                        <router-link :to='{path:"/clue/appoint/list"}'>
                            <h5 class="description-header text-red">{{data.crmApplyNum}}</h5>
                            <p class="description-text">新客户</p>
                        </router-link>
                    </div>

                </div>
                <div class="col-sm-offset">
                    <div v-if="data.cooperation_status == 1">
                        <router-link :to='{path:"/clue/follow/list",query:{status:0}}'>
                            <h5 class="description-header text-red">{{data.totalUnUnderwayTransformNum}}</h5>
                            <p class="description-text">未跟进</p>
                        </router-link>
                    </div>
                    <div v-else>
                        <router-link :to='{path:"/clue/appoint/follow/list",query:{status:0}}'>
                            <h5 class="description-header text-red">{{data.totalUnUnderwayTransformNum}}</h5>
                            <p class="description-text">未跟进</p>
                        </router-link>
                    </div>
                </div>
                <div class="col-sm-offset">
                    <div v-if="data.cooperation_status == 1">
                        <router-link :to='{path:"/clue/follow/list",query:{status:1}}'>
                            <h5 class="description-header text-green">{{data.totalUnderwayTransformNum}}</h5>
                            <p class="description-text">跟进中</p>
                        </router-link>
                    </div>
                    <div v-else>
                        <router-link :to='{path:"/clue/appoint/follow/list",query:{status:1}}'>
                            <h5 class="description-header text-green">{{data.totalUnderwayTransformNum}}</h5>
                            <p class="description-text">跟进中</p>
                        </router-link>
                    </div>
                </div>
                <div class="col-sm-offset">
                    <div v-if="data.cooperation_status == 1">
                        <router-link :to='{path:"/clue/follow/list",query:{status:3}}'>
                            <h5 class="description-header text-green">{{data.totalInvalidTransformNum}}</h5>
                            <p class="description-text">废单</p>
                        </router-link>
                    </div>
                    <div v-else>
                        <router-link :to='{path:"/clue/appoint/follow/list",query:{status:3}}'>
                            <h5 class="description-header text-green">{{data.totalInvalidTransformNum}}</h5>
                            <p class="description-text">废单</p>
                        </router-link>
                    </div>
                </div>
                <div class="col-sm-offset">
                    <div v-if="data.cooperation_status == 1">
                        <router-link :to='{path:"/clue/follow/list",query:{status:2}}'>
                            <h5 class="description-header text-green">{{data.totalDealTransformNum}}</h5>
                            <p class="description-text">成交</p>
                        </router-link>
                    </div>
                    <div v-else>
                        <router-link :to='{path:"/clue/appoint/follow/list",query:{status:2}}'>
                            <h5 class="description-header text-green">{{data.totalDealTransformNum}}</h5>
                            <p class="description-text">成交</p>
                        </router-link>
                    </div>
                </div>
            </div>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>基本信息</span>
                </div>
                <div class="basicInfo">
                    <el-row :gutter="10" style='width:100%;'>
                        <el-col :sm="24" :md="24" :lg="12" :xl="12">
                            <div class="basicInfoLeft" style='padding-right:10px;'>
                                <p>我的服务</p>
                                <div class="basicInfoItem">
                                    <div class="basicInfoItemBar">
                                        <span>客户数量：</span>
                                        <span>
                                            <span class="color-red">{{data.totalTransformNum}}</span>/{{data.totalClueNum}}条/年</span>
                                    </div>
                                    <el-progress :text-inside="true" :stroke-width="18" status="success" :percentage="data.cluePercent"></el-progress>
                                </div>
                                <div class="basicInfoItem">
                                    <div class="basicInfoItemBar">
                                        <span>设计师数量：</span>
                                        <span>
                                            <span class="color-red">{{data.designerNum}}</span>/{{data.totalDesignerNum}}人</span>
                                    </div>
                                    <el-progress :text-inside="true" :stroke-width="18" status="success" :percentage="data.designerPercent"></el-progress>
                                </div>
                                <div class="basicInfoItem">
                                    <div class="basicInfoItemBar">
                                        <span>案例数量：</span>
                                        <span>
                                            <span class="color-red">{{data.subjectNum}}</span>/{{data.totalSubjectNum}}套</span>
                                    </div>
                                    <el-progress :text-inside="true" :stroke-width="18" status="success" :percentage="data.subjectPercent"></el-progress>
                                </div>
                                <div class="basicInfoItem">
                                    <div class="basicInfoItemBar">
                                        <span>门店数量：</span>
                                        <span>
                                            <span class="color-red">{{data.storeNum}}</span>/{{data.totalStoreNum}}个</span>
                                    </div>
                                    <el-progress :text-inside="true" :stroke-width="18" status="success" :percentage="data.storePercent"></el-progress>
                                </div>
                                <p class="basicInfoInstruction">可视线索区域：{{data.cityRangeStr}}</p>
                            </div>
                        </el-col>
                        <el-col :sm="24" :md="24" :lg="12" :xl="12">
                            <div class="basicInfoRight">
                                <div class="canvasTips" @mouseenter="canvasTipsMouseenter" @mouseleave="canvasTipsMouseleave">
                                    <span>排行指数</span>
                                    <div class="canvasTipsCons" v-if="canvasTipsShow">
                                        <p>排行指数</p>
                                        <p>什么是排行指数？</p>
                                        <p>是指您在家居在线平台的信息完善排行情况，在平台的排行指数越高，曝光率越高</p>
                                    </div>
                                </div>
                                <span class="pa numGreen">{{data.companyScore.score}}</span>
                                <div id="main" ref="mains" style="width: 100%;height:400px;"></div>
                                <div class="basicInfoRight_tips" @mouseenter="tipsMouseenter" @mouseleave="tipsMouseleave">
                                    <p>如何提升排行指数</p>
                                </div>
                                <div class="tipsCons" v-if="tipShow">
                                    <p style="font-size:20px;">
                                        <span>指数评分解读</span>
                                        <span style="font-size:13px;"></span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>
                                            <br>
                                        </span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>公司信息指数是</span>
                                        <span style="color:#009966;">{{_self.data.companyScore.base_info_score || 0}}</span>
                                        <span></span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>上传的完善的公司信息，可获得更高的公司信息指数</span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>该指数越高，大大提升企业在互联网上的企业形象</span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>
                                            <br>
                                        </span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>跟进指数是</span>
                                        <span style="color:#009966;">{{_self.data.companyScore.deal_score || 0}}</span>
                                        <span></span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>跟进的线索越多，可获得更高的跟进指数</span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>该指数越高，成交概率则越大</span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>
                                            <br>
                                        </span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>案例指数是</span>
                                        <span style="color:#009966;">{{_self.data.companyScore.subject_score || 0}}</span>
                                        <span></span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>上传案例时，绑定真实的楼盘/小区信息，可获得更高的案例指数，该指数越高，可提升企业在互联网上的曝光率</span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>
                                            <br>
                                        </span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>线索成交指数是</span>
                                        <span style="color:#009966;">{{_self.data.companyScore.clue_done_score || 0}}</span>
                                        <span></span>
                                    </p>
                                    <p style="font-size:13px;">
                                        <span>成交签单越多，则可获得更高的成交指数</span>
                                    </p>
                                </div>
                            </div>
                        </el-col>
                    </el-row>

                </div>
            </el-card>
            <img v-lazy="'//icon.jiajuol.com/companyCrm/company_footer1.jpg!c'" alt="" class="mt20 big-hide" style='max-width:100%;'>
            <img v-lazy="'//icon.jiajuol.com/companyCrm/company_footer_big.jpg!c'" alt="" class="mt20 small-hide" style='max-width:100%;'>
        </div>
        <div v-show='!showFlag' class="f24" style="text-align:center;margin-top:150px;">
            欢迎您登录装修公司管理系统
        </div>
    </div>
</template>

<style scoped>
    .widget-user-header {
        width: 100%;
    }

    .widget-user-header {
        display: flex;
        padding: 20px;
        background: #fff;
    }

    .widget-user-header .widget-user-img img {
        width: 65px;
        height: 65px;
    }

    .widget-user-header .widget-user-username {
        margin: 0;
        font-size: 16px;
        margin-left: 10px;
    }

    .widget-user-header .widget-user-username .widge-user-info {
        font-size: 25px;
        margin-top: 6px;
        padding-right: 10px;
    }

    .widget-user-header .widget-user-username .widge-user-info span {
        font-weight: 200;
    }

    .widget-user-header .widget-user-username .widge-user-info .standard {
        font-size: 14px;
        padding: 3px 6px;
        border-radius: 3px;
        color: #fff;
        background: #d7b23b;
    }

    .widget-user-header .widget-user-username p {
        font-size: 14px;
    }

    .my_box_footer {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 60px;
    }

    .my_box_footer .col-sm-offset {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        -webkit-justify-content: center;
        -webkit-align-items: center;
        border-right: 1px solid #cdcecd;
    }

    .my_box_footer {
        border-bottom: 1px solid #cdcecd;
        margin-bottom: 30px;
    }

    .my_box_footer .col-sm-offset:last-child {
        border-right: none;
    }

    .my_box_footer .col-sm-offset a {
        display: block;
        text-align: center;
        font-size: 30px;
    }

    .my_box_footer .col-sm-offset a .text-red {
        font-weight: 600;
        color: #dd4b39 !important;
    }

    .my_box_footer .col-sm-offset a .text-green {
        font-weight: 600;
        color: #00a65a !important
    }

    .my_box_footer .col-sm-offset a .description-text {
        font-size: 14px;
        color: #7a869d !important
    }


    .basicInfoLeft p:first-child {
        font-size: 20px;
    }

    .basicInfo {
        display: flex;
    }


    .basicInfo .basicInfoLeft {
        border-right: 1px solid #cdcecd;
        font-size: 14px;
    }

    .basicInfo .basicInfoLeft .basicInfoInstruction {
        color: #999;
        margin-top: 30px;
    }

    .basicInfoLeft {
        /*padding-right:20px;*/
    }

    .basicInfoLeft .basicInfoItem {
        margin-top: 30px;
    }

    .basicInfoLeft .basicInfoItem .basicInfoItemBar {
        font-size: 14px;
    }

    .basicInfoLeft .basicInfoItem .basicInfoItemBar span:nth-of-type(1) {
        float: left;
    }

    .basicInfoLeft .basicInfoItem .basicInfoItemBar span:nth-of-type(2) {
        float: right;
        margin-right: 20px;
    }

    .basicInfoRight {
        position: relative;
    }

    .basicInfoRight .canvasTips {
        position: absolute;
        top: 130px;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 100;
    }

    .basicInfoRight .canvasTips:after {
        content: "?";
        width: 14px;
        height: 14px;
        background: #000;
        line-height: 16px;
        text-align: center;
        color: #fff;
        border-radius: 14px;
        display: inline-block;
        /*margin-left:2px;*/
        font-size: 12px;
    }

    .basicInfoRight .basicInfoRight_tips {
        position: absolute;
        top: 0;
        right: 40px;
        font-size: 14px;
        color: #f39c12;
    }

    .basicInfoRight .basicInfoRight_tips p:after {
        content: "?";
        width: 16px;
        height: 16px;
        background: #f39c12;
        line-height: 16px;
        text-align: center;
        color: #fff;
        border-radius: 16px;
        display: inline-block;
        margin-left: 2px;
        font-size: 12px;
    }

    .basicInfoRight .tipsCons {
        position: absolute;
        right: 50px;
        top: 30px;
        width: 300px;
        background: #fff;
        box-shadow: 0 0 2px 2px #ccc;
        padding: 10px;
        z-index: 100;
        text-align: center;
    }

    .canvasTipsCons {
        position: absolute;
        right: 10px;
        top: 30px;
        width: 300px;
        background: #fff;
        box-shadow: 0 0 2px 2px #ccc;
        padding: 10px;
        z-index: 90;
        text-align: center;
    }

    .numGreen {
        bottom: 120px;
        font-size: 30px;
        width: 100%;
        text-align: center;
        z-index: 20;
        color: #00a65a;
    }

</style>

<script type="text/javascript">
    var echarts = require('echarts');
    var _self, myChart;
    export default {
        data() {
            return {
                loading: true,
                data: {
                    companyScore: {

                    }
                },
                tipShow: false,
                canvasTipsShow: false,
                option: {
                    series: [{
                        name: '业务指标',
                        type: 'gauge',
                        detail: {
                            formatter: '击败全国：{value}%装修公司',
                            fontSize: 15,
                            lineHeight: 30,
                            padding: [80, 0, 0, 0]
                        },
                        data: [{
                            value: 100
                        }]
                    }]
                },


            }
        },
        created() {
            _self = this;
            // this.$http.get('data/board')
            //     .then(function (res) {
            //         _self.loading = false;
            //         if (res.codeFlag) {
            //             console.log('首页的数据', res);
            //             _self.data = res.data.data;

            //         }
            //     })
            if (_self.showFlag) {
                setTimeout(function () {
                    myChart = echarts.init(document.getElementById('main'));
                    _self.getDetail();
                    window.addEventListener('resize', function () {
                        setTimeout(function () {
                            myChart.resize();
                        }, 300)
                    })
                }, 10)
            }
        },
        mounted() {

        },
        computed: {
            showFlag() {
                var flag = true;
                var d = this.$.userInfo.info.index_data;
                for (var key in d) {
                    if (!d[key]) {
                        flag = false;
                        break;
                    }
                }
                return flag;
            }
        },
        methods: {
            getDetail() {
                var n = 0;
                var apis = ['data/score/rank', 'data/service/info', 'data/board/result'];
                var obj={}
                apis.forEach(e => {
                    _self.$http.get(e)
                        .then(function (res) {
                            if (res.codeFlag) {
                                n++;
                                _self.$.extend(obj, res.d);
                                if (n >= 3) {
                                    _self.loading = false;
                                    _self.data = obj;
                                    console.log(_self.data, 8998989)
                                    _self.detail();
                                }
                            }
                        })
                })
            },
            detail() {
                _self.data.storePercent = Number(_self.data.storePercent.toFixed(2))
                _self.data.subjectPercent = Number(_self.data.subjectPercent.toFixed(2))
                _self.data.designerPercent = Number(_self.data.designerPercent.toFixed(2))
                _self.data.cluePercent = Number(_self.data.cluePercent.toFixed(2))
                _self.option.series[0].data[0].value = _self.data.companyScore.percent || 0;
                myChart.setOption(_self.option, true);
                setTimeout(function () {
                    myChart.resize();
                }, 300)
            },
            tipsMouseenter() {
                this.tipShow = true;
            },
            tipsMouseleave() {
                this.tipShow = false;
            },
            canvasTipsMouseenter() {
                this.canvasTipsShow = true;
            },
            canvasTipsMouseleave() {
                this.canvasTipsShow = false;
            }
        },
        components: {

        },
    }

</script>
