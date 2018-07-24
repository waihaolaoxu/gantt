<template>
    <div>
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <span class="is-active el-tabs__item fl">工地明细</span>
                    <span class="el-tabs__item fl" @click="$router.push({path:'gongdi_analyse',query: {id: $route.query.id, engineer_name: $route.query.engineer_name}})">工地收支分析</span>
                </div>
            </div>
        </div>
        <div class="list-box bg-white">
            <div class="list-body no-border-top">
                <div class="tip text-sub f12">
                    <div class="f16 mb5 text-title pd-l5">
                        <p class="f16 text-title" style='margin-top:-5px;'>
                            {{data.info.title}}
                        </p>
                        <p class="f14 text-title mt5" style='margin-top:-5px;'>
                            {{data.info.sub_title}}
                        </p>
                    </div>

                    【全部】工地收入:
                    <span class="text-success">{{data.info.income}}</span> 元， 支出:
                    <span class="text-error">{{data.info.expend}}</span> 元， 结余:
                    <span class="text-success">{{data.info.balance}}</span> 元
                </div>
                <div class="mt10">
                    <!-- <el-button icon="el-icon-plus" title="添加" size="mini" @click="$router.push({path:'capital_save',query:{engineer_id:$route.query.id,prevPath: $route.fullPath}})">添加收支</el-button> -->

                    <el-button icon="el-icon-plus" title="添加" size="mini" @click="$router.push({path:'capital_save',query:{engineer_id: $route.query.engineer_id, prevPath: $route.fullPath, type: 1,selectType:1}})">添加收入</el-button>
                    <el-button icon="el-icon-plus" title="添加" size="mini" @click="$router.push({path:'capital_save',query:{engineer_id: $route.query.engineer_id, prevPath: $route.fullPath, type: 2,selectType:1}})">添加支出</el-button>
                </div>
                <div class="pd5" v-if='data.list.length'>
                    <ul class="process-list  pd-l10 pr f14">
                        <li class="list pr hoverable" :class="{'mouthOne':  index ==0 || data.list[index].create_date.substring(5,7) != data.list[index-1].create_date.substring(5,7)}"  v-for='(item,index) in data.list' :key='index'>
                            <div class="error-show over pd-t10 pd-b10" :class="{'show': index ==0 || data.list[index].sort_date.substring(5,7) != data.list[index-1].sort_date.substring(5,7)}">
                                <div class="fl">{{item.sort_date.substring(5,7) > 9 ? item.sort_date.substring(5,7) : item.sort_date.substring(6,7)}}月明细</div>
                                <div class="fr">
                                    <span>支出：{{item.month_expend}}</span>
                                    <span>收入：{{item.month_income}}</span>
                                </div>
                            </div>
                            <!-- <div v-if="index ==0 || data.list[index].create_date != data.list[index-1].create_date">{{item.create_date}}</div> -->
                            <!-- <span class="text-sub clearfix">
                                <span class="fl">{{item.create_date}}</span>
                                //<div class="fr">
                                    <el-button-group>
                                        <el-button @click="$router.push({path:'capital_save',query:{prevPath: $route.fullPath,id:item.id}})" title="编辑" size="mini">编辑</el-button>
                                        <el-button @click="$router.push({path:'capital_save',query:{prevPath: $route.fullPath, id: item.id, type: item.type,selectType:1}})" title="编辑" size="mini">编辑</el-button>
                                        <el-button @click="handleDelete(item)" title="删除" size="mini">删除</el-button>
                                    </el-button-group>
                                </div>//
                            </span> -->
                            <div class="clearfix">
                                <div class="fl">
                                    <span class="small-btn bg-success" v-if='item.type==1'>收</span>
                                    <span class="small-btn bg-error" v-else>支</span>
                                    <span class="text-title fblod">{{item.expend_type_name}}</span>
                                    <span v-if="item.expend_user_name" class="fblod">（{{item.expend_user_name}}）</span>
                                </div>
                                <div class="fr text-success" v-if='item.type==1'>¥{{item.money}}</div>
                                <div class="fr text-error" v-else>¥{{item.money}}</div>
                            </div>
                            <p class="text-sub f13 mt5">{{item.remark}}</p>
                            <el-row :gutter="10">
                                <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6" v-for='(item1,index1) in item.pic' :key='index1'>
                                    <div class="img over radius5 pr mt10">
                                        <img v-lazy="item1.photo_url+'!zmm'" class="full cover zero pa pointer" alt="" @click='imgBig(item.pic,index1)'>
                                    </div>
                                </el-col>
                            </el-row>
                            <!-- <p class="text-title bg-greyBg f13 mt10 pd10">{{item.title}}</p> -->
                            <div class="bg-greyBg pd10 mt10">
                                <p class="text-title f15">
                                    {{item.title}}
                                </p>
                                <div  class="text-title f13 mt5">
                                    {{item.sub_title}}
                                </div>
                                <div  class="text-title f13 mt5">
                                    <span v-if="item.type==1">收入时间：</span>
                                    <span v-else>支出时间：</span>
                                    {{item.create_date}}
                                </div>
                            </div>
                            <div  class="text-title f12 mt5">
                                <span>{{item.add_date}}</span>
                                <span class="ml10">{{item.add_user}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <empty :empty='!loading&&!data.list.length' :loading='loading'></empty>
                <paging :query='query' :total='data.total'></paging>
            </div>
        </div>
        <transition name='slide-scale'>
            <el-carousel :autoplay='false' arrow="always" class="pf zero full bigImgs tran" v-if='imgs.show' :initial-index='imgs.now'>
                <span class="no-select pa closeImg flex-box middle" @click='closeImg'>X</span>
                <el-carousel-item v-for="(item,index) in imgs.list" :key="index">
                    <div class="flex-box full middle">
                        <img v-lazy="item.photo_url" class="full" alt="" style="object-fit:contain;background-color:transparent!important;">
                    </div>
                </el-carousel-item>
            </el-carousel>
        </transition>
    </div>
</template>
<style scoped>
    .show{
        display: block;
        background: #e1e1e1;
        margin-top: -40px;
        margin-bottom: 5px;
        margin-left: -15px;
        margin-right: -15px;
        padding-left:15px;
        padding-right:15px;

    }
</style>
<script>
    import paging from '@/components/block/paging';
    import {
        pagingEvent
    } from '@/mixins/index';
    var _self;
    export default {
        data() {
            return {
                imgs: {
                    list: [],
                    show: false,
                    now: 0,
                },
                data: {
                    info: {

                    },
                    list: []
                },
                loading: true,
                query: {
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                    id: this.$route.query.id
                },
            }
        },
        mixins: [pagingEvent],
        computed: {},
        created() {
            _self = this;
            _self.getData();
        },
        methods: {
            closeImg() {
                this.imgs.show = false;
            },
            imgBig(obj, index) {
                if (obj) {
                    this.imgs.list = obj;
                    this.imgs.show = true;
                    this.imgs.now = index;
                }
            },
            getData() {
                _self.$http.get('engineer/capital/info', {
                        params: _self.query
                    })
                    .then(function (res) {
                        _self.loading = false;
                        if (res.codeFlag) {
                            _self.data = res.d;
                        }
                    })
            },
            handleDelete(d) {
                _self.$confirm('此操作将永久删除该记录, 是否继续?', '提示', _self.$.confirm).then(() => {
                    _self.$http.get('engineer/capital/delete', {
                        params: {
                            id: d.id,
                            engineer_id: d.engineer_id
                        },
                        rule: true
                    }).then(res => {
                        if (res.codeFlag) {
                            _self.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        _self.getData();
                    })
                })
            },
        },
        components: {
            paging
        }
    }

</script>

