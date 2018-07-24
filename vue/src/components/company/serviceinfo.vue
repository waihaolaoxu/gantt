<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">服务信息</div>
                </div>
            </div>
        </div>
        <div class="list-body">
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
            <div class="home">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>基本信息</span>
                    </div>
                    <div class="basicInfo">
                        <el-row :gutter="10" style='width:100%;'>
                            <el-col :sm="24" :md="24" :lg="24" :xl="24">
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
                        </el-row>

                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>
<style scoped>
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
    var _self;
    export default {
        data() {
            return {
                loading: true,
                data:{}
            }
        },
        created() {
            _self = this;
            this.getData()
        },
        mounted() {

        },
        computed: {
            
        },
        methods: {
            getData() {
                this.$http.get('data/service/info')
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.data = res.data.data;
                            _self.detail()
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            },
            detail() {
                _self.data.storePercent = Number(_self.data.storePercent.toFixed(2))
                _self.data.subjectPercent = Number(_self.data.subjectPercent.toFixed(2))
                _self.data.designerPercent = Number(_self.data.designerPercent.toFixed(2))
                _self.data.cluePercent = Number(_self.data.cluePercent.toFixed(2))
            },
        },
        components: {

        },
    }

</script>
