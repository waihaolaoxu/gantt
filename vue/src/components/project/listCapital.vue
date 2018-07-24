<template>
    <div>
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <span class="is-active el-tabs__item fl">收支明细</span>
                    <span class="el-tabs__item fl" @click="$router.push({path:'total_capital_analyse'})">收支分析</span>
                </div>
            </div>
        </div>
        <div class="list-box bg-white">
            <div class="list-body no-border-top">
                <div class="list-header">
                    <el-form :model="query" :inline="true" size="small" style='max-width:800px;display:block;' v-if='false'>
                        <el-form-item class="search-head full-w">
                            <div class="pr flex1" style='min-height:30px;'>
                                <div class="f14 bg-greyBg flex-box middle" style='line-height:1.5em;padding:10px;border-radius:5px;' v-if='d.id'>
                                    <div class="flex1">
                                        <div>{{d.title}}</div>
                                        <!-- <div>{{d.build_name}} {{d.landlord_name}} {{d.room_name?d.room_name+"居室":''}} {{d.area?d.area+"㎡":''}}</div> -->
                                        <div class="mt5 f12">
                                            <i class="iconfont icon-ren f12"></i> {{ d.landlord_name }}
                                            <span class="pd-r10"></span>
                                            <i class="iconfont icon-ziyuan f12"></i> {{ d.build_name }}
                                        </div>
                                    </div>
                                    <i class="el-icon-arrow-down"></i>
                                </div>
                                <el-autocomplete v-model="query.q" :fetch-suggestions="querySearchAsync" placeholder="请输入查询工地" @select="handleSelect" :trigger-on-focus="true"
                                    style='width:100%;' :class="{'autoInput':d.id}" class="pa full zero">
                                    <template slot-scope="props">
                                        <div class="f14" style='line-height:1.5em;padding:5px;'>
                                            <div>{{props.item.title}}</div>
                                            <!-- <div>{{props.item.build_name}} {{props.item.landlord_name}} {{props.item.room_name?props.item.room_name+"居室":''}}
                                                {{props.item.area?props.item.area+"㎡":''}}
                                            </div> -->
                                            <div class="mt5 f12">
                                                <i class="iconfont icon-ren f12"></i> {{ props.item.landlord_name }}
                                                <span class="pd-r10"></span>
                                                <i class="iconfont icon-ziyuan f12"></i> {{ props.item.build_name }}
                                            </div>
                                        </div>
                                    </template>
                                </el-autocomplete>
                                <input type="hidden" v-model='query.engineer_id'>
                            </div>
                            <div style='margin-left:10px;height:32px;'>
                                <el-button type="primary" @click="goRouter" icon="el-icon-search" :loading="loading">查询</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                    <div class="list-header mb20" style="border: none;">
                        <el-button icon="el-icon-plus" title="添加" size="mini" @click="$router.push({path:'capital_save',query:{engineer_id: $route.query.engineer_id, prevPath: $route.fullPath, type: 1,selectType:1}})">添加收入</el-button>
                        <el-button icon="el-icon-plus" title="添加" size="mini" @click="$router.push({path:'capital_save',query:{engineer_id: $route.query.engineer_id, prevPath: $route.fullPath, type: 2,selectType:1}})">添加支出</el-button>
                    </div>
                </div>
                <div class="tip text-sub f12">【全部】工地收入:
                    <span class="text-success">{{data.info.income}}</span> 元， 支出:
                    <span class="text-error">{{data.info.expend}}</span> 元， 结余:
                    <span class="text-success" v-if='data.info.balance.indexOf("-")==-1'>{{data.info.balance}}</span>
                    <span class="text-error" v-else>{{data.info.balance}}</span> 元
                    <!-- ，  -->
                    <!-- 工地:<span class="text-success">41</span> -->
                </div>
                <div class="pd5" v-if='data.list.length'>
                    <ul class="process-list  pd-l10 pr f14">
                        <!-- <li class="list pr hoverable" v-for='(item,index) in data.list' :key='index'> -->
                        <li class="dateList pr hoverable showDate" :class="{'mouthOne':  index ==0 || data.list[index].create_date.substring(5,7) != data.list[index-1].create_date.substring(5,7)}" v-for='(item,index) in data.list' :key='index'>
                            <div class="error-show over pd-t10 pd-b10" :class="{'show': index ==0 || data.list[index].sort_date.substring(5,7) != data.list[index-1].sort_date.substring(5,7)}">
                                <div class="fl">{{item.sort_date.substring(5,7) > 9 ? item.sort_date.substring(5,7) : item.sort_date.substring(6,7)}}月明细</div>
                                <div class="fr">
                                    <span>支出：{{item.month_expend}}</span>
                                    <span>收入：{{item.month_income}}</span>
                                </div>
                            </div>
                            <!-- <div v-if="index ==0 || data.list[index].create_date != data.list[index-1].create_date">{{item.create_date}}</div> -->
                            <!-- <span class="text-sub clearfix">
                                <div class="fl">
                                   <span>{{item.create_date}}</span>
                                   <span>(收入时间)</span>
                                </div>
                                <div class="fr">
                                    <el-button-group>
                                        //<el-button @click="$router.push({path:'capital_save',query:{prevPath: $route.fullPath, id: item.id, type: item.type,selectType:1}})" title="编辑" size="mini">编辑</el-button>
                                        <el-button @click="handleDelete(item)" title="删除" size="mini">删除</el-button>//
                                    </el-button-group>
                                </div>
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
                                <el-col :xs="12" :sm="6" :md="6" :lg="6" :xl="6" v-for='(item1,index1) in item.pic' :key='index1' v-if='index1<8'>
                                    <div class="img over radius5 pr mt10">
                                        <img v-lazy="item1.full_small_url" class="full cover zero pa pointer" alt="" @click='imgBig(item.pic,index1)'>
                                        <div class="pa full flex-box middle text-white f16 zero event-none" style='background:rgba(0,0,0,0.3);' v-if='index1==7'>共{{item.pic.length}}张</div>
                                    </div>
                                </el-col>
                            </el-row>
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
                        <img v-lazy="item.full_big_url" class="full" alt="" style="object-fit:contain;background-color:transparent!important;">
                    </div>
                </el-carousel-item>
            </el-carousel>
        </transition>
    </div>
</template>
<style scoped>
    .autoInput input {
        opacity: 0;
        height: 45px !important;
        margin-top: 10px;
    }

    .search-head .el-form-item__content {
        display: flex;
        align-items: center;
    }

    .autoInput input:focus {
        opacity: 1;
        box-shadow: 0 20px #fff, 0 -20px #fff;
    }
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
                d: {

                },
                imgs: {
                    list: [],
                    show: false,
                    now: 0,
                },
                data: {
                    info: {
                        balance: ''
                    },
                    list: []
                },
                loading: true,
                query: {
                    page: this.$route.query.page ? Number(this.$route.query.page) : 1,
                    page_size: this.$route.query.page_size ? Number(this.$route.query.page_size) : 20,
                    engineer_id: this.$route.query.engineer_id || '',
                },
            }
        },
        mixins: [pagingEvent],
        computed: {},
        created() {
            _self = this;
            _self.getData();
            if (_self.query.engineer_id) {
                _self.getEngineer();
            }
        },
        methods: {
            getEngineer() {
                this.$http.get(`common/engineer/info`, {
                        params: {
                            engineer_id: _self.query.engineer_id
                        }
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.d = res.d;
                        }
                    });
            },
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
                _self.$http.get('engineer/capital/list', {
                        params: _self.query
                    })
                    .then(function (res) {
                        _self.loading = false;
                        if (res.codeFlag) {
                            _self.data = res.d;
                        }
                    })
            },
            querySearchAsync(queryString, cb) {
                this.$cache('engineer/list', {
                    params: {
                        name: queryString
                    }
                }).then(res => {
                    if (res) {
                        var d = res.data.data.list;
                        // console.log(d);
                        cb(d);
                    }
                })
            },
            handleSelect(item) {
                this.query.engineer_id = item.id;
                this.d = item;
            },
            handleDelete(d) {
                _self.$confirm('此操作将永久删除该记录, 是否继续?', '提示', _self.$.confirm).then(() => {
                    _self.$http.get('engineer/capital/delete', {
                        params: {
                            id: d.id,
                            engineer_id: d.engineer_id
                        }
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

